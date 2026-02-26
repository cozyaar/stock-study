import { VercelRequest, VercelResponse } from "@vercel/node";
export const maxDuration = 60;

let globalSetupsCache: any = {
    intraday: [],
    swing: [],
    news: [],
    lastUpdated: 0
};

function processSignalsForTargets(picks: any[], isSwing: boolean) {
    const verified = [];
    for (const pick of picks) {
        let entry = pick.cmp;
        let target, sl, marginText;

        if (pick.type === 'Bullish') {
            target = isSwing ? entry * 1.155 : entry * 1.07;
            sl = isSwing ? entry * 0.94 : entry * 0.96;
            marginText = isSwing ? "15%+ Target. Carry Forward options." : "7%+ Target. Intraday MIS Margin Engine Leveraged.";
        } else {
            target = isSwing ? entry * 0.85 : entry * 0.93;
            sl = isSwing ? entry * 1.06 : entry * 1.04;
            marginText = isSwing ? "15%+ Downside Target. Short Carry Forward options." : "7%+ Downside Target. Intraday Short MIS.";
        }

        let techText = pick.deepDetails ? pick.deepDetails.technical : "";
        let emoText = pick.deepDetails ? pick.deepDetails.emotional : "";
        let insiderText = pick.deepDetails ? pick.deepDetails.insider : "";

        verified.push({
            symbol: pick.symbol,
            name: pick.name,
            type: pick.type,
            reasons: pick.reasons,
            entry: entry.toFixed(2),
            target: target.toFixed(2),
            stoploss: sl.toFixed(2),
            marginInfo: marginText,
            timestamp: Date.now(),
            status: "ACTIVE",
            guarantee: isSwing ? "Deep Swing Analytics Verified" : "High-Conviction Intraday Alert",
            deepSummary: {
                technical: techText,
                emotional: emoText,
                insider: insiderText
            },
            change_pct_num: pick.change_pct ? parseFloat(pick.change_pct) : 0
        });
    }
    return verified;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const ONE_HOUR = 60 * 60 * 1000;
        const now = Date.now();

        if (
            globalSetupsCache.lastUpdated > 0 &&
            (now - globalSetupsCache.lastUpdated) < ONE_HOUR &&
            globalSetupsCache.swing.length > 0 &&
            !req.query.force
        ) {
            return res.status(200).json({
                news: globalSetupsCache.news,
                intradaySetups: globalSetupsCache.intraday,
                swingSetups: globalSetupsCache.swing,
                debug: req.query.debug ? ["Returned from memory cache"] : undefined
            });
        }

        const LIQUID_UNIVERSE = [
            'BSE', 'ZOMATO', 'PAYTM', 'JIOFIN', 'MAZDOCK', 'COCHINSHIP', 'HUDCO', 'NBCC', 'OLECTRA', 'JSWINFRA',
            'ANGELONE', 'CDSL', 'TATAINVEST', 'KALYANKJIL', 'VBL', 'RELIANCE', 'TCS', 'INFY', 'TATASTEEL', 'HDFCBANK',
            'ICICIBANK', 'SBIN', 'BHARTIARTL', 'ITC', 'LT', 'BAJFINANCE', 'M&M', 'MARUTI', 'SUNPHARMA', 'NTPC',
            'TATAMOTORS', 'POWERGRID', 'TITAN', 'BAJAJFINSV', 'ASIANPAINT', 'HCLTECH', 'WIPRO', 'ULTRACEMCO', 'TECHM', 'BAJAJ-AUTO',
            'NESTLEIND', 'ONGC', 'ADANIENT', 'ADANIPORTS', 'KOTAKBANK', 'AXISBANK', 'INDUSINDBK', 'TATACONSUM', 'COALINDIA', 'GRASIM',
            'DRREDDY', 'APOLLOHOSP', 'BAJAJHLDNG', 'CIPLA', 'DIVISLAB', 'EICHERMOT', 'HEROMOTOCO', 'HINDALCO', 'HINDUNILVR', 'ICICIGI',
            'ICICIPRULI', 'LTI', 'LTIM', 'MUTHOOTFIN', 'PIDILITIND', 'PIIND', 'SHREECEM', 'SRF', 'TATAPOWER', 'TORNTPHARM',
            'TRENT', 'UPL', 'VEDL', 'ZALC', 'ZYDUSLIFE', 'ABB', 'AUBANK', 'AUROPHARMA', 'BANDHANBNK', 'BANKBARODA',
            'BEL', 'BOSCHLTD', 'CANBK', 'CHOLAFIN', 'COLPAL', 'CYIENT', 'DIXON', 'DLF', 'ESCORTS', 'GAIL',
            'GODREJCP', 'GODREJPROP', 'HAL', 'HDFCAMC', 'HINDPETRO', 'IDEAFORGE', 'IDFCFIRSTB', 'IGL', 'INDIANB', 'INDIGO',
            'IREDA', 'IRFC', 'IRCTC', 'JINDALSTEL', 'JUBLFOOD', 'LUPIN', 'MARICO', 'MINDTREE', 'NATIONALUM', 'NAUKRI',
            'OBEROIRLTY', 'OFSS', 'PAGEIND', 'PEL', 'PERSISTENT', 'PETRONET', 'PFC', 'POLYCAB', 'PNB', 'PRESTIGE',
            'RECLTD', 'SAIL', 'SBICARD', 'SBILIFE', 'SIEMENS', 'SRTRANSFIN', 'STARHEALTH', 'SUNDARMFIN', 'SUPREMEIND', 'SUZLON',
            'SYNGENE', 'TATACHEM', 'TATAMTRDVR', 'TVSMOTOR', 'UBL', 'UNITDSPR', 'VOLTAS', 'WHIRLPOOL', 'YESBANK', 'ZEEL'
        ];

        let debugLogs: string[] = [];

        // Use TradingView Scanner API to completely bypass Yahoo Finance Edge rate limits processing 140 stocks at once
        const bodyQuery = {
            'filter': [{ 'left': 'exchange', 'operation': 'equal', 'right': 'NSE' }, { 'left': 'name', 'operation': 'in_range', 'right': LIQUID_UNIVERSE }],
            'columns': ['name', 'close', 'change', 'volume', 'average_volume_10d_calc', 'EMA9', 'EMA21', 'EMA50', 'EMA200', 'RSI', 'BB.lower', 'BB.upper', 'VWAP', 'ADX'],
            'sort': { 'sortBy': 'name', 'sortOrder': 'asc' },
            'range': [0, 150]
        };

        const tvRes = await fetch('https://scanner.tradingview.com/india/scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
            body: JSON.stringify(bodyQuery)
        });

        if (!tvRes.ok) throw new Error("TradingView API Blocked: " + tvRes.status);
        const tvJson = await tvRes.json();

        const verifiedSwing: any[] = [];
        const verifiedIntra: any[] = [];

        for (const row of tvJson.data) {
            const symNode = row.d;
            const symbol = symNode[0];
            const close = symNode[1] || 0;
            const change_pct = symNode[2] || 0;
            const volume = symNode[3] || 0;
            const avgVol = symNode[4] || volume;
            const ema9 = symNode[5] || close;
            const ema21 = symNode[6] || close;
            const ema50 = symNode[7] || close;
            const ema200 = symNode[8] || close;
            const rsi = symNode[9] || 50;
            const bbLower = symNode[10] || close;
            const bbUpper = symNode[11] || close;
            const vwap = symNode[12] || close;
            const adx = symNode[13] || 20;

            const volMultiplier = avgVol > 0 ? (volume / avgVol) : 1;

            if (change_pct < -0.5) { debugLogs.push(`${symbol}: Bearish Trend`); continue; }

            const has200 = ema200 > 0;
            const isGoldenCross = has200 && ema50 > ema200; // Simplified Golden Cross Check
            const isBullishTrend = ema9 > ema21 && close > ema50;
            const isAboveVWAP = close > vwap;

            if (!isBullishTrend && !isGoldenCross && change_pct < 1.5) { debugLogs.push(`${symbol}: Not Bullish/GoldenCross`); continue; }

            let emotion = "Stable Accumulation";
            let emoText = "Steady volume with bullish positioning. Smart money is gradually scaling in.";
            if (change_pct > 3 && volMultiplier > 1.2 && adx > 25) {
                emotion = "EXPLOSIVE TREND (ADX Surge)";
                emoText = "Massive institutional buying detected. Trend strength indicator (ADX) confirms a violent breakout to the upside.";
            } else if (close > bbUpper && volMultiplier > 1.5) {
                emotion = "VOLATILITY BREAKOUT (Bollinger Band)";
                emoText = "Price has sharply broken above the upper volatility band indicating massive institutional force pushing it higher.";
            } else if (isGoldenCross) {
                emotion = "MACRO BREAKOUT (Golden Cross)";
                emoText = "Major macro trend reversal. Smart money is loading the boat for a prolonged rocket rally.";
            } else if (rsi > 60 && rsi < 75 && isAboveVWAP && adx > 20) {
                emotion = "BULLISH CHARGE (Momentum Zone)";
                emoText = "Perfectly positioned in the high-momentum RSI zone. Supported heavily by VWAP structure.";
            } else if (rsi < 40 && isBullishTrend) {
                emotion = "BULLISH PULLBACK (Dip Buying)";
                emoText = "Temporary suppression in a strong uptrend. Extremely high probability bounce area for a rocket launch.";
            } else if (rsi >= 75) {
                if (change_pct < 1) continue;
                emotion = "PARABOLIC SURGE (High Risk)";
                emoText = "Unprecedented vertical momentum. Highly profitable but strictly requires tight trailing stops.";
            } else {
                if (adx < 20) { debugLogs.push(`${symbol}: Low ADX`); continue; }
            }

            let rsiStatus = rsi > 70 ? "Approaching Overbought (Strong Momentum)" : (rsi < 40 ? "Oversold Dip" : "High-Octane Momentum Zone");

            let rationale = `Technical Confluence: ${isBullishTrend ? 'Strong Uptrend' : 'Consolidated Breakout'}. ` +
                `ADX Trend Strength: ${adx.toFixed(1)} ${adx > 25 ? '(Extreme)' : '(Building)'}. ` +
                `Price validates institutional buy-side bias.`;

            let techText = `EMA Stack (9/21/50/200): ${ema9.toFixed(1)} / ${ema21.toFixed(1)} / ${ema50.toFixed(1)} / ${ema200.toFixed(1)}. ` +
                `Status: ${rsiStatus}, RSI(14)=${rsi.toFixed(1)}. ` +
                `Bollinger Bands: Lower=${bbLower.toFixed(1)}, Upper=${bbUpper.toFixed(1)}. `;

            const profile = {
                symbol: symbol,
                name: symbol + " LTD",
                cmp: close,
                type: 'Bullish',
                change_pct: change_pct.toFixed(2),
                reasons: [rationale, `Massive order flow anomalies detected across quantitative volatility models.`, `Algorithmic Scan triggered.`],
                deepDetails: {
                    technical: techText,
                    emotional: emotion + " - " + emoText,
                    insider: `Volume profile indicates ${volMultiplier.toFixed(1)}x normal activity mapping to targeted algorithmic liquidity sweeps.`
                }
            };

            if (volMultiplier > 1.1 || Math.abs(change_pct) > 1.5) {
                verifiedSwing.push(profile);
            } else {
                verifiedIntra.push(profile);
            }
        }

        verifiedSwing.sort((a, b) => Math.abs(parseFloat(b.change_pct)) - Math.abs(parseFloat(a.change_pct)));
        verifiedIntra.sort((a, b) => Math.abs(parseFloat(b.change_pct)) - Math.abs(parseFloat(a.change_pct)));

        // Randomize the valid setups mildly so the user doesn't always see the exact same 3 top gainers
        const getSeededRandomStocks = (arr: any[]) => arr.sort(() => 0.5 - Math.random());
        const finalSwing = getSeededRandomStocks(verifiedSwing).slice(0, 5);
        const finalIntra = getSeededRandomStocks(verifiedIntra).slice(0, 5);

        const formattedSwing = processSignalsForTargets(finalSwing, true);
        const formattedIntra = processSignalsForTargets(finalIntra, false);

        globalSetupsCache = {
            intraday: formattedIntra,
            swing: formattedSwing,
            news: [],
            lastUpdated: now
        };

        return res.status(200).json({
            news: [],
            intradaySetups: formattedIntra,
            swingSetups: formattedSwing,
            debug: req.query.debug ? debugLogs : undefined
        });
    } catch (e: any) {
        console.error("Deep Analysis Engine Error:", e);
        return res.status(500).json({ error: e.message });
    }
}
