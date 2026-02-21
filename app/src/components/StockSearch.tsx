import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, Loader2 } from 'lucide-react';

export interface Instrument {
    instrument_key: string;
    symbol: string;
    name: string;
    exchange: string;
    exchanges?: string[];
    instrument_keys?: Record<string, string>;
}

const StockSearch: React.FC<{ onSelect: (i: Instrument) => void }> = ({ onSelect }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Instrument[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:4000/api/search?q=${query.trim()}`);
                setResults(res.data);
            } catch (e) {
                console.error("Search failed", e);
            } finally {
                setLoading(false);
            }
        };
        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        const clickOut = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', clickOut);
        return () => document.removeEventListener('mousedown', clickOut);
    }, []);

    return (
        <div ref={wrapperRef} className="relative w-full max-w-lg">
            <div className="relative group">
                <input
                    type="text"
                    className="w-full bg-slate-900/80 text-white border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm placeholder-slate-400 group-hover:border-slate-600"
                    placeholder="Search for NSE / BSE stocks (e.g. RELIANCE)..."
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
                    onFocus={() => setIsOpen(true)}
                />
                {loading ? (
                    <Loader2 className="absolute left-4 top-3.5 text-blue-500 animate-spin" size={20} />
                ) : (
                    <Search className="absolute left-4 top-3.5 text-slate-400 group-hover:text-blue-400 transition-colors" size={20} />
                )}
            </div>

            {isOpen && query.length >= 2 && (
                <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl">
                    {results.length > 0 ? (
                        results.map((i) => (
                            <div
                                key={i.instrument_key}
                                className="px-5 py-3 hover:bg-slate-700 cursor-pointer flex justify-between items-center bg-slate-800/90 text-white border-b border-slate-700/50 last:border-0 transition-colors"
                                onClick={() => { onSelect(i); setQuery(''); setIsOpen(false); }}
                            >
                                <div>
                                    <div className="font-bold flex items-center gap-2">
                                        {i.symbol}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-0.5">{i.name}</div>
                                </div>
                                <div className={`text-xs px-2.5 py-1 rounded font-medium tracking-wide ${i.exchange.includes('NSE') ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                                    }`}>
                                    {i.exchanges ? i.exchanges.map(e => e.replace('_EQ', '')).join(' / ') : i.exchange.replace('_EQ', '')}
                                </div>
                            </div>
                        ))
                    ) : !loading && (
                        <div className="px-5 py-8 text-center text-slate-400">
                            No results found for "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StockSearch;
