// Vercel Serverless: /api/news — Full Institutional-Grade ML Screener
// api/_mlScreener.js is co-located in api/ to guarantee Vercel bundling
import { VercelRequest, VercelResponse } from "@vercel/node";

export const maxDuration = 60;

let cache: any = null;
let cacheTime = 0;
const CACHE_TTL = 3600000; // 1 hour

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const now = Date.now();
        if (cache && (now - cacheTime < CACHE_TTL)) {
            return res.status(200).json(cache);
        }

        console.log('\n🔬 [VERCEL] Running Institutional-Grade Screener...');

        // Dynamically import all deps inside handler to avoid top-level ESM issues
        const [{ default: YahooFinance }, ti, { runProScreener }] = await Promise.all([
            import("yahoo-finance2"),
            import("technicalindicators"),
            import("./_mlScreener.js"),
        ]);

        const yahooFinance = new (YahooFinance as any)();
        const instruments: any[] = [];

        // Run swing + intraday in parallel. maxStocks=200 keeps us under the 60s limit.
        const [swingResult, intradayResult] = await Promise.all([
            (runProScreener as any)('swing', yahooFinance, ti, instruments, null, null, 200).catch((e: any) => {
                console.error('Swing screener error:', e.message);
                return { results: [], for_date: '', disclaimer: '', universe_scanned: 0 };
            }),
            (runProScreener as any)('intraday', yahooFinance, ti, instruments, null, null, 200).catch((e: any) => {
                console.error('Intraday screener error:', e.message);
                return { results: [], for_date: '', disclaimer: '', universe_scanned: 0 };
            })
        ]);

        const responsePayload = {
            news: [],
            intradaySetups: (intradayResult as any).results || [],
            swingSetups: (swingResult as any).results || [],
            for_date: (swingResult as any).for_date || (intradayResult as any).for_date || '',
            model_version: '5.0.0',
            universe_scanned: Math.max(
                (swingResult as any).universe_scanned || 0,
                (intradayResult as any).universe_scanned || 0
            ),
            indicators_used: 16,
            disclaimer: (swingResult as any).disclaimer || (intradayResult as any).disclaimer || 'Educational analysis only.'
        };

        if (responsePayload.swingSetups.length > 0 || responsePayload.intradaySetups.length > 0) {
            cache = responsePayload;
            cacheTime = now;
        }

        return res.status(200).json(responsePayload);
    } catch (error: any) {
        console.error("ML Screener Error on Vercel:", error?.message, error?.stack);
        if (cache) return res.status(200).json(cache);
        return res.status(500).json({
            error: "Screening engine temporarily unavailable.",
            message: error?.message,
            intradaySetups: [],
            swingSetups: [],
            model_version: '5.0.0',
            universe_scanned: 0,
            indicators_used: 0,
            disclaimer: ''
        });
    }
}
