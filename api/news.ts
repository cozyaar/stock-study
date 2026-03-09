// Vercel Serverless: /api/news — ML Screener powered (Vercel Production)
// Uses exactly the same logic as the local Express server to preserve all parameters
import { VercelRequest, VercelResponse } from "@vercel/node";
// @ts-ignore
import yahooFinance from "yahoo-finance2";
// @ts-ignore
import * as ti from "technicalindicators";
// @ts-ignore
import axios from "axios";
// @ts-ignore
import { runProScreener } from "../server/mlScreener.js";

// Vercel Serverless maximum execution limit (must be <= 60 for Hobby, 300 for Pro)
export const maxDuration = 60;

// Shared Cache to prevent excessive rebuilding on rapid reloads
let cache: any = null;
let cacheTime = 0;
const CACHE_TTL = 3600000; // 1 hour

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const now = Date.now();
        if (cache && (now - cacheTime < CACHE_TTL)) {
            return res.status(200).json(cache);
        }

        console.log('\n🔬 [VERCEL] Running Institutional-Grade Screener (Swing + Intraday)...');

        // Provide an empty array as fallback if we don't fetch full instruments list
        const instruments: any[] = [];

        // Run the pro screener in parallel chunks (up to 600 stocks usually takes 10s thanks to parallelization)
        // Note: we can adjust the maximum limit natively inside runProScreener if needed.
        const [swingResult, intradayResult] = await Promise.all([
            runProScreener('swing', yahooFinance, ti, instruments, null, axios).catch(e => {
                console.error('Swing screener error:', e.message);
                return { results: [], for_date: '', disclaimer: '', universe_scanned: 0 };
            }),
            runProScreener('intraday', yahooFinance, ti, instruments, null, axios).catch(e => {
                console.error('Intraday screener error:', e.message);
                return { results: [], for_date: '', disclaimer: '', universe_scanned: 0 };
            })
        ]);

        const responsePayload = {
            news: [], // unused legacy
            intradaySetups: intradayResult.results || [],
            swingSetups: swingResult.results || [],
            for_date: swingResult.for_date || intradayResult.for_date || '',
            model_version: '5.0.0',
            universe_scanned: Math.max(swingResult.universe_scanned || 0, intradayResult.universe_scanned || 0),
            indicators_used: 16,
            disclaimer: swingResult.disclaimer || intradayResult.disclaimer || 'Educational and analytical screening only.'
        };

        // If we got valid results, cache them
        if (responsePayload.swingSetups.length > 0 || responsePayload.intradaySetups.length > 0) {
            cache = responsePayload;
            cacheTime = now;
        }

        res.status(200).json(responsePayload);
    } catch (error: any) {
        console.error("ML Screener Error on Vercel:", error);
        if (cache) return res.status(200).json(cache);
        res.status(500).json({ error: "Screening engine temporarily unavailable.", message: error.message });
    }
}
