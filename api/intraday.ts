import { VercelRequest, VercelResponse } from "@vercel/node";
import yahooFinance from "yahoo-finance2";
import { getInstruments } from "./utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { instrument_key, interval = "1m" } = req.query;

    if (!instrument_key || typeof instrument_key !== "string") {
        return res.status(400).json({ error: "Missing instrument_key" });
    }

    let yfSymbol = '';
    let isCommodity = false;

    if (instrument_key.startsWith('COMM|')) {
        isCommodity = true;
        if (instrument_key === 'COMM|CRUDEOIL') yfSymbol = 'CL=F';
        else if (instrument_key === 'COMM|NATURALGAS') yfSymbol = 'NG=F';
        else if (instrument_key === 'COMM|GOLD') yfSymbol = 'GC=F';
        else if (instrument_key === 'COMM|SILVER') yfSymbol = 'SI=F';
    } else {
        const instruments = await getInstruments();
        const instrument = instruments.find(i => i.instrument_key === instrument_key);
        if (!instrument) return res.status(404).json({ error: 'Instrument not found' });
        yfSymbol = instrument.symbol;
        if (instrument.exchange === 'NSE_EQ') yfSymbol += '.NS';
        else if (instrument.exchange === 'BSE_EQ') yfSymbol += '.BO';
        else yfSymbol += '.NS';
    }

    let period1: string;
    const intervalStr = Array.isArray(interval) ? interval[0] : (interval as string);

    if (intervalStr === "1m") {
        period1 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    } else if (["5m", "15m", "30m", "60m", "90m"].includes(intervalStr)) {
        period1 = new Date(Date.now() - 59 * 24 * 60 * 60 * 1000).toISOString();
    } else if (intervalStr === "1h") {
        period1 = new Date(Date.now() - 729 * 24 * 60 * 60 * 1000).toISOString();
    } else {
        period1 = "1970-01-01";
    }

    try {
        const chart = await yahooFinance.chart(yfSymbol, { interval: intervalStr as any, period1 });

        let multiplier = 1;
        if (isCommodity) {
            if (instrument_key === 'COMM|GOLD') multiplier = 83 / 3.11;
            else if (instrument_key === 'COMM|SILVER') multiplier = 83 * 32.15;
            else multiplier = 83;
        }

        const candles = chart.quotes
            .filter((q) => q.open !== null && q.open !== undefined)
            .map((q) => ({
                time: new Date(q.date).getTime() / 1000,
                open: q.open! * multiplier,
                high: q.high! * multiplier,
                low: q.low! * multiplier,
                close: q.close! * multiplier,
                volume: q.volume,
            }));

        res.status(200).json(candles);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}
