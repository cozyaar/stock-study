import { VercelRequest, VercelResponse } from "@vercel/node";
import yahooFinance from "yahoo-finance2";
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
        const quote = await yahooFinance.quote(yfSymbol);
        let multiplier = 1;
        if (isCommodity) {
            if (instrument_key === 'COMM|GOLD') multiplier = 83 / 3.11;
            else if (instrument_key === 'COMM|SILVER') multiplier = 83 * 32.15;
            else multiplier = 83;
        }

        res.status(200).json({
            last_price: quote.regularMarketPrice * multiplier,
            dayHigh: quote.regularMarketDayHigh * multiplier,
            dayLow: quote.regularMarketDayLow * multiplier,
            open: quote.regularMarketOpen * multiplier,
            prevClose: quote.regularMarketPreviousClose * multiplier,
            volume: quote.regularMarketVolume
        });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}
