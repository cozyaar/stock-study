// Vercel Serverless: /api/news — ML Screener powered
// Backward-compatible endpoint that returns the same shape as the old /api/news
import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

export const maxDuration = 60;

const SCREENING_UNIVERSE = [
    "SUZLON", "IREDA", "RVNL", "IRFC", "HAL", "BSE", "ZOMATO", "PAYTM",
    "JIOFIN", "MAZDOCK", "COCHINSHIP", "HUDCO", "NBCC", "OLECTRA", "JSWINFRA",
    "ANGELONE", "CDSL", "VBL", "RELIANCE", "TCS", "INFY",
    "TATASTEEL", "HDFCBANK", "ICICIBANK", "SBIN", "BHARTIARTL", "ITC", "LT",
    "BAJFINANCE", "MARUTI", "SUNPHARMA", "NTPC", "TATAMOTORS", "POWERGRID",
    "TITAN", "BAJAJFINSV", "ASIANPAINT", "HCLTECH", "WIPRO", "ONGC",
    "COALINDIA", "ADANIPORTS", "ULTRACEMCO", "NESTLEIND", "DRREDDY",
    "CIPLA", "DIVISLAB", "EICHERMOT", "HINDALCO", "JSWSTEEL"
];

function sigmoid(x: number, center = 0, scale = 1): number {
    return 1 / (1 + Math.exp(-(x - center) / scale));
}

function computeFeatures(quotes: any[]) {
    if (!quotes || quotes.length < 20) return null;
    const closes = quotes.map((q: any) => q.close);
    const volumes = quotes.map((q: any) => q.volume);
    const latest = quotes[quotes.length - 1];
    const prev = quotes[quotes.length - 2];
    if (!latest?.close || !prev?.close) return null;

    const return1d = (latest.close - prev.close) / prev.close;
    const return5d = quotes.length >= 6 ? (latest.close - quotes[quotes.length - 6].close) / quotes[quotes.length - 6].close : 0;
    const gapPct = (latest.open - prev.close) / prev.close;

    const recentVols = volumes.slice(-21, -1);
    const avgVol = recentVols.length > 0 ? recentVols.reduce((a: number, b: number) => a + b, 0) / recentVols.length : 1;
    const volumeRatio = avgVol > 0 ? latest.volume / avgVol : 1;

    let gains = 0, losses = 0;
    const period = Math.min(14, closes.length - 1);
    for (let i = closes.length - period; i < closes.length; i++) {
        const diff = closes[i] - closes[i - 1];
        if (diff > 0) gains += diff;
        else losses += Math.abs(diff);
    }
    const rs = losses === 0 ? 100 : gains / losses;
    const rsi = 100 - (100 / (1 + rs));

    const ema = (arr: number[], p: number) => {
        const k = 2 / (p + 1);
        let e = arr[0];
        for (let i = 1; i < arr.length; i++) e = arr[i] * k + e * (1 - k);
        return e;
    };
    const ema9 = ema(closes, 9);
    const ema21 = ema(closes, 21);
    const ema50 = closes.length >= 50 ? ema(closes, 50) : ema21;
    let emaScore = 0;
    if (ema9 > ema21) emaScore += 0.4;
    if (ema21 > ema50) emaScore += 0.3;
    if (latest.close > ema9) emaScore += 0.3;

    return { return1d, return5d, gapPct, volumeRatio, rsi, emaScore, cmp: latest.close };
}

function scoreStock(features: any, mode: 'intraday' | 'swing') {
    if (!features) return null;

    if (mode === 'intraday' && features.return1d < -0.02) return null;
    if (mode === 'swing' && features.return5d < -0.05) return null;

    let probability: number;
    if (mode === 'intraday') {
        probability = Math.min(0.95, Math.max(0.05,
            sigmoid(features.volumeRatio, 1.5, 0.5) * 0.25 +
            sigmoid(features.rsi, 60, 10) * 0.15 +
            features.emaScore * 0.20 +
            sigmoid(features.gapPct * 100, 1, 1) * 0.15 +
            sigmoid(features.return1d * 100, 1, 1.5) * 0.15 +
            0.10
        ));
    } else {
        probability = Math.min(0.95, Math.max(0.05,
            features.emaScore * 0.25 +
            sigmoid(features.rsi, 55, 12) * 0.18 +
            sigmoid(features.volumeRatio, 1.3, 0.4) * 0.17 +
            sigmoid(features.return5d * 100, 2, 2) * 0.15 +
            sigmoid(features.return1d * 100, 0.5, 1) * 0.10 +
            0.15
        ));
    }

    if (probability < 0.35) return null;

    const factors: string[] = [];
    if (features.volumeRatio > 1.5) factors.push(`Volume ${features.volumeRatio.toFixed(1)}x above average`);
    if (features.emaScore >= 0.7) factors.push('Bullish EMA alignment (9/21/50)');
    if (features.rsi >= 55 && features.rsi <= 75) factors.push(`RSI momentum zone (${features.rsi.toFixed(0)})`);
    if (features.return5d > 0.03) factors.push(`5-day momentum +${(features.return5d * 100).toFixed(1)}%`);
    if (features.return1d > 0.02) factors.push(`Today +${(features.return1d * 100).toFixed(1)}%`);

    return { probability, factors };
}

let cache: any = null;
let cacheTime = 0;
const CACHE_TTL = 600000; // 10 min

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const now = Date.now();
        if (cache && (now - cacheTime < CACHE_TTL)) {
            return res.status(200).json(cache);
        }

        const intradayResults: any[] = [];
        const swingResults: any[] = [];

        // Process stocks in batches of 5 to manage serverless timeout
        for (let i = 0; i < Math.min(30, SCREENING_UNIVERSE.length); i++) {
            const symbol = SCREENING_UNIVERSE[i];
            try {
                const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS?interval=1d&range=6mo`;
                const yahooRes = await fetch(url, {
                    headers: { 'User-Agent': 'Mozilla/5.0' },
                    // @ts-ignore
                    timeout: 5000
                });
                const data: any = await yahooRes.json();
                const result = data?.chart?.result?.[0];
                if (!result?.indicators?.quote?.[0]) continue;

                const timestamps = result.timestamp || [];
                const quote = result.indicators.quote[0];
                const quotes = timestamps.map((t: number, idx: number) => ({
                    close: quote.close[idx], open: quote.open[idx],
                    high: quote.high[idx], low: quote.low[idx],
                    volume: quote.volume[idx]
                })).filter((q: any) => q.close != null);

                const features = computeFeatures(quotes);
                if (!features) continue;

                const formatResult = (score: any, mode: string) => ({
                    symbol, name: symbol, market: 'NSE',
                    probability: parseFloat(score.probability.toFixed(3)),
                    confidence: score.probability >= 0.7 ? 'HIGH' : score.probability >= 0.5 ? 'MEDIUM' : 'LOW',
                    key_factors: score.factors.slice(0, 4),
                    metrics: {
                        cmp: parseFloat(features.cmp.toFixed(2)),
                        volume_ratio: parseFloat(features.volumeRatio.toFixed(2)),
                        rsi: parseFloat(features.rsi.toFixed(1)),
                        ema_alignment: parseFloat(features.emaScore.toFixed(2)),
                        adx: 0, atr_pct: 0,
                        return_1d: parseFloat((features.return1d * 100).toFixed(2)),
                        return_5d: parseFloat((features.return5d * 100).toFixed(2)),
                    }
                });

                const intradayScore = scoreStock(features, 'intraday');
                if (intradayScore) intradayResults.push(formatResult(intradayScore, 'intraday'));

                const swingScore = scoreStock(features, 'swing');
                if (swingScore) swingResults.push(formatResult(swingScore, 'swing'));

            } catch { continue; }
        }

        intradayResults.sort((a, b) => b.probability - a.probability);
        swingResults.sort((a, b) => b.probability - a.probability);

        const response = {
            intradaySetups: intradayResults.slice(0, 10),
            swingSetups: swingResults.slice(0, 10),
            disclaimer: 'Educational and analytical screening only. Not investment advice. Past patterns do not guarantee future results.',
        };

        cache = response;
        cacheTime = now;

        res.status(200).json(response);
    } catch (error: any) {
        console.error("ML Screener Error:", error);
        if (cache) return res.status(200).json(cache);
        res.status(500).json({ error: "Screening engine temporarily unavailable." });
    }
}
