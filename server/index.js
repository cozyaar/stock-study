import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import csv from "csv-parser";
import { Readable } from "stream";
import zlib from "zlib";
import YahooFinance from "yahoo-finance2";
const yahooFinance = new YahooFinance();

dotenv.config();

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

let accessToken = null;
let instruments = [];

// Load Instruments (NSE and BSE only)
async function loadInstruments() {
    try {
        const exchanges = ['NSE', 'BSE'];
        let all = [];
        for (const exch of exchanges) {
            const res = await axios.get(`https://assets.upstox.com/market-quote/instruments/exchange/${exch}.csv.gz`, {
                responseType: 'arraybuffer'
            });
            const results = [];

            // Unzip the gzip buffer
            const unzipped = zlib.gunzipSync(res.data);
            const stream = Readable.from(unzipped);

            await new Promise((resolve) => {
                stream.pipe(csv()).on('data', (d) => {
                    if (d.instrument_type === 'EQUITY') {
                        results.push({
                            instrument_key: d.instrument_key,
                            exchange: d.exchange,
                            symbol: d.tradingsymbol,
                            name: d.name
                        });
                    }
                }).on('end', () => {
                    all = [...all, ...results];
                    resolve();
                });
            });
        }
        instruments = all;
        console.log(`Loaded ${all.length} instruments from NSE/BSE.`);
    } catch (e) {
        console.error("Error loading instruments:", e.message);
    }
}

// Step 1: Login URL
app.get("/login", (req, res) => {
    const url = `https://api.upstox.com/v2/login/authorization/dialog?response_type=code&client_id=${process.env.UPSTOX_API_KEY}&redirect_uri=${process.env.UPSTOX_REDIRECT_URI}`;
    res.redirect(url);
});

// Step 2: Callback
app.get("/callback", async (req, res) => {
    const { code } = req.query;

    try {
        const tokenRes = await axios.post(
            "https://api.upstox.com/v2/login/authorization/token",
            new URLSearchParams({
                code,
                client_id: process.env.UPSTOX_API_KEY,
                client_secret: process.env.UPSTOX_API_SECRET,
                redirect_uri: process.env.UPSTOX_REDIRECT_URI,
                grant_type: "authorization_code",
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        accessToken = tokenRes.data.access_token;
        res.send("✅ Upstox authentication successful. You can close this tab and return to the Demo Trading page.");
    } catch (err) {
        res.status(500).send("❌ Upstox auth failed");
    }
});

// Step 3: Test API
app.get("/api/profile", async (req, res) => {
    if (!accessToken) return res.status(401).send("Not authenticated");

    try {
        const profile = await axios.get("https://api.upstox.com/v2/user/profile", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        res.json(profile.data);
    } catch (err) {
        res.status(500).send("Failed to fetch profile");
    }
});

// Search API
app.get('/api/search', (req, res) => {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json([]);
    const query = q.toLowerCase();

    const matches = instruments.filter(i =>
        i.symbol.toLowerCase().includes(query) ||
        i.name.toLowerCase().includes(query)
    );

    const grouped = new Map();
    for (const item of matches) {
        if (!grouped.has(item.symbol)) {
            grouped.set(item.symbol, {
                ...item,
                exchanges: [item.exchange],
                instrument_keys: { [item.exchange]: item.instrument_key }
            });
        } else {
            const existing = grouped.get(item.symbol);
            if (!existing.exchanges.includes(item.exchange)) {
                existing.exchanges.push(item.exchange);
                existing.instrument_keys[item.exchange] = item.instrument_key;
            }
        }
    }

    res.json(Array.from(grouped.values()).slice(0, 15));
});

// LTP API
app.get('/api/ltp', async (req, res) => {
    const { instrument_key } = req.query;
    const instrument = instruments.find(i => i.instrument_key === instrument_key);
    if (!instrument) return res.status(404).json({ error: 'Instrument not found' });

    let yfSymbol = instrument.symbol;
    if (instrument.exchange === 'NSE_EQ') yfSymbol += '.NS';
    else if (instrument.exchange === 'BSE_EQ') yfSymbol += '.BO';
    else yfSymbol += '.NS';

    try {
        const quote = await yahooFinance.quote(yfSymbol);
        res.json({ last_price: quote.regularMarketPrice });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Intraday API
app.get('/api/intraday', async (req, res) => {
    const { instrument_key, interval = '1m' } = req.query;
    const instrument = instruments.find(i => i.instrument_key === instrument_key);
    if (!instrument) return res.status(404).json({ error: 'Instrument not found' });

    let yfSymbol = instrument.symbol;
    if (instrument.exchange === 'NSE_EQ') yfSymbol += '.NS';
    else if (instrument.exchange === 'BSE_EQ') yfSymbol += '.BO';
    else yfSymbol += '.NS';

    let period1;
    if (interval === '1m') {
        period1 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    } else if (['5m', '15m', '30m', '60m', '90m'].includes(interval)) {
        period1 = new Date(Date.now() - 59 * 24 * 60 * 60 * 1000).toISOString();
    } else if (interval === '1h') {
        period1 = new Date(Date.now() - 729 * 24 * 60 * 60 * 1000).toISOString();
    } else {
        period1 = "1970-01-01"; // maximum history
    }

    try {
        const chart = await yahooFinance.chart(yfSymbol, { interval, period1 });

        const candles = chart.quotes
            .filter(q => q.open !== null && q.open !== undefined)
            .map(q => ({
                time: new Date(q.date).getTime() / 1000,
                open: q.open,
                high: q.high,
                low: q.low,
                close: q.close,
                volume: q.volume
            }));

        res.json(candles);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Check Auth Status (Simple boolean endpoint)
app.get('/api/check-auth', (req, res) => {
    res.json({ authenticated: true });
});

app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
    loadInstruments();
});