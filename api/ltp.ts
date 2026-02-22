import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import { getInstruments } from "./utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { instrument_key } = req.query;

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

    try {
        const yahooRes = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${yfSymbol}?interval=1m&range=1d`, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });

        const meta = yahooRes.data.chart.result[0].meta;
        let multiplier = 1;

        if (isCommodity) {
            if (instrument_key === 'COMM|GOLD') multiplier = 83 / 3.11;
            else if (instrument_key === 'COMM|SILVER') multiplier = 83 * 32.15;
            else multiplier = 83;
        }

        res.status(200).json({
            last_price: (meta.regularMarketPrice || meta.previousClose) * multiplier,
            dayHigh: (meta.regularMarketDayHigh || meta.regularMarketPrice) * multiplier,
            dayLow: (meta.regularMarketDayLow || meta.regularMarketPrice) * multiplier,
            open: (meta.regularMarketOpen || meta.regularMarketPrice) * multiplier,
            prevClose: meta.previousClose * multiplier,
            volume: meta.regularMarketVolume || 0
        });
    } catch (e: any) {
        console.error("LTP API Error:", e.response?.data || e.message);
        res.status(500).json({ error: e.message });
    }
}
