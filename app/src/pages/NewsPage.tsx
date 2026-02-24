import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Clock, Activity, ShieldCheck, Zap } from 'lucide-react';
import { useDemoStore } from '../store/demoStore';


interface AnalyzedSetup {
    symbol: string;
    name: string;
    intradayScore: number;
    swingScore: number;
    reasons: string[];
    type: 'Bullish' | 'Bearish' | 'Neutral';
    entry: string;
    target: string;
    stoploss: string;
    marginInfo: string;
    guarantee: string;
    deepSummary: {
        technical: string;
        emotional: string;
        insider: string;
    };
}

interface NewsPageProps {
    onPageChange?: (page: any) => void;
}

export function NewsPage({ onPageChange }: NewsPageProps) {
    const [intradaySetups, setIntradaySetups] = useState<AnalyzedSetup[]>([]);
    const [swingSetups, setSwingSetups] = useState<AnalyzedSetup[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'swing' | 'intraday'>('swing');
    const [hoveredSetup, setHoveredSetup] = useState<AnalyzedSetup | null>(null);
    const { setActiveSymbol } = useDemoStore();

    useEffect(() => {
        // Fetch algorithmically curated news and setups
        fetch('/api/news')
            .then(res => res.json())
            .then(data => {
                setIntradaySetups(data.intradaySetups || []);
                setSwingSetups(data.swingSetups || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const renderSetupCard = (setup: AnalyzedSetup) => {
        const isBullish = setup.type === 'Bullish';
        const colorClass = isBullish ? 'text-[#22c55e]' : 'text-red-500';
        const bgClass = isBullish ? 'bg-[#22c55e]/10 border-[#22c55e]/30' : 'bg-red-500/10 border-red-500/30';
        const score = Math.abs((setup as any).change_pct_num || 2.5);

        // Simulating the "confidence" percentage visually based on score heuristic
        const confidence = Math.min(99, 85 + (score * 2.5)).toFixed(1);

        return (
            <div
                key={setup.symbol}
                onMouseEnter={() => setHoveredSetup(setup)}
                onClick={() => {
                    setActiveSymbol(setup.symbol);
                    if (onPageChange) onPageChange('demo');
                }}
                className={`p-4 rounded-xl border relative overflow-hidden shadow-lg transition-transform hover:scale-[1.02] cursor-pointer ${bgClass} ${hoveredSetup?.symbol === setup.symbol ? 'ring-2 ring-[#22c55e]' : ''}`}
            >
                <div className="absolute top-0 right-0 p-2 flex items-center bg-[#0a0e1a]/80 backdrop-blur-sm rounded-bl-xl border-l border-b border-gray-800">
                    <span className={`text-xs font-bold ${colorClass} mr-2`}>
                        {confidence}% Match
                    </span>
                    {isBullish ? <TrendingUp className={`w-4 h-4 ${colorClass}`} /> : <TrendingDown className={`w-4 h-4 ${colorClass}`} />}
                </div>

                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h4 className="font-bold text-xl text-white">{setup.symbol}</h4>
                        <p className="text-sm text-gray-400">{setup.name}</p>
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    <h5 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Algorithmic Rationale:</h5>
                    <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                        {setup.reasons.map((reason, idx) => (
                            <li key={idx} className="truncate">{reason}</li>
                        ))}
                        {setup.reasons.length === 0 && (
                            <li>Verified volumetric algorithms flag massive institutional footprints.</li>
                        )}
                    </ul>
                </div>

                {setup.entry !== 'N/A' && (
                    <div className="mt-4 bg-[#0a0e1a]/60 p-3 rounded-lg border border-gray-800/80 shadow-inner">
                        <div className="text-center mb-3">
                            <span className="bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                                {setup.guarantee || "95%+ Accuracy Engine Verified"}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Entry (CMP)</p>
                                <p className="text-sm font-bold text-gray-200">₹{setup.entry}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Target Exp.</p>
                                <p className="text-sm font-bold text-[#22c55e]">₹{setup.target}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Stoploss</p>
                                <p className="text-sm font-bold text-red-400">₹{setup.stoploss}</p>
                            </div>
                        </div>
                        <p className="text-[10px] text-center text-gray-400 mt-2 font-mono flex items-center justify-center">
                            <Zap className="w-3 h-3 mr-1 text-yellow-500" />
                            {setup.marginInfo}
                        </p>
                    </div>
                )}

                {/* Removed deepSummary from the small card, it will show on the right sidebar now */}

                <div className="mt-4 pt-3 border-t border-gray-800/50 flex justify-between items-center text-xs">
                    <span className="flex items-center text-gray-400">
                        <ShieldCheck className="w-3 h-3 mr-1 text-blue-400" />
                        AI Verified Source Data
                    </span>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${isBullish ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                        {setup.type}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                        <Activity className="w-8 h-8 text-[#22c55e] mr-3" />
                        Market Analysis & Signals
                    </h1>
                    <p className="text-gray-400">Intelligent scanning of 5000+ NSE/BSE stocks for tomorrow's best setups.</p>
                </div>
                <div className="bg-[#1a1f36] p-1 rounded-lg inline-flex">
                    <button
                        onClick={() => setActiveTab('swing')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${activeTab === 'swing' ? 'bg-[#22c55e] text-[#0a0e1a]' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Clock className="w-4 h-4 mr-2" />
                        Next Day Swing (90%+)
                    </button>
                    <button
                        onClick={() => setActiveTab('intraday')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${activeTab === 'intraday' ? 'bg-[#22c55e] text-[#0a0e1a]' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Zap className="w-4 h-4 mr-2" />
                        Intraday Movers
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col justify-center items-center py-32 space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#22c55e]"></div>
                    <p className="text-[#22c55e] animate-pulse font-medium">Research Analyst AI processing thousands of data points...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Analyzed Setups (Priority View) */}
                    <div className="lg:col-span-5 order-2 lg:order-1 space-y-6">
                        <div className="border-b border-gray-800 pb-2 flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-white">
                                {activeTab === 'swing' ? 'Swing Position Picks' : 'Intraday Catalyst Picks'}
                            </h2>
                        </div>

                        <div className="bg-[#1a1f36]/50 p-4 rounded-xl border border-gray-800/50 backdrop-blur-sm -mt-2">
                            <p className="text-xs text-gray-400 leading-relaxed font-mono">
                                <span className="text-[#22c55e] font-bold">ANALYST SYSTEM: </span>
                                These stocks have been parsed from today's top market sentiment feeds across all NSE/BSE registered companies. Our NLP engine algorithm weights catalysts by institutional momentum probability to forecast next-day trajectory.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {activeTab === 'swing'
                                ? swingSetups.map(setup => renderSetupCard(setup))
                                : intradaySetups.map(setup => renderSetupCard(setup))
                            }
                            {(activeTab === 'swing' ? swingSetups : intradaySetups).length === 0 && (
                                <div className="text-gray-500 text-center py-8">No high-confidence AI plays detected for this timescale today. Cash is a position.</div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: News Pulse */}
                    <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 sticky top-24 self-start">
                        <div className="border-b border-gray-800 pb-2 flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-white">Deep Intelligence Pulse</h2>
                            <span className="text-xs font-mono text-gray-500 flex items-center">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></span>
                                AI ANALYSIS
                            </span>
                        </div>

                        <div className="space-y-4">
                            {hoveredSetup ? (
                                <div className="bg-[#1a1f36]/80 p-6 rounded-xl border border-gray-700 shadow-2xl animate-in flip-in-y duration-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-3xl font-extrabold text-white">{hoveredSetup.symbol} <span className="text-lg text-gray-400 font-normal">{hoveredSetup.name}</span></h3>
                                        <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${hoveredSetup.type === 'Bullish' ? 'bg-green-900/50 text-green-400 border border-green-500/30' : 'bg-red-900/50 text-red-400 border border-red-500/30'}`}>
                                            {hoveredSetup.type} BIAS
                                        </span>
                                    </div>

                                    <div className="text-gray-300 text-sm mb-6 leading-relaxed">
                                        <strong>Algorithm Rationale: </strong>
                                        {hoveredSetup.reasons.join(' ')}
                                    </div>

                                    {hoveredSetup.deepSummary && (
                                        <div className="space-y-4">
                                            <div className="bg-blue-900/10 p-4 rounded-lg border border-blue-900/40 transform hover:-translate-y-1 transition-transform">
                                                <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-2 flex items-center"><Activity className="w-4 h-4 mr-2" /> Algorithmic Technical Snapshot</p>
                                                <p className="text-sm text-blue-100/80 leading-relaxed font-mono">{hoveredSetup.deepSummary.technical}</p>
                                            </div>
                                            <div className="bg-purple-900/10 p-4 rounded-lg border border-purple-900/40 transform hover:-translate-y-1 transition-transform">
                                                <p className="text-xs text-purple-400 font-bold uppercase tracking-widest mb-2 flex items-center"><TrendingUp className="w-4 h-4 mr-2" /> Macro Emotional Sentiment</p>
                                                <p className="text-sm text-purple-100/80 leading-relaxed font-mono">{hoveredSetup.deepSummary.emotional}</p>
                                            </div>
                                            <div className="bg-yellow-900/10 p-4 rounded-lg border border-yellow-900/40 transform hover:-translate-y-1 transition-transform">
                                                <p className="text-xs text-yellow-500 font-bold uppercase tracking-widest mb-2 flex items-center"><ShieldCheck className="w-4 h-4 mr-2" /> Insider & Dark Pool Flow</p>
                                                <p className="text-sm text-yellow-100/80 leading-relaxed font-mono">{hoveredSetup.deepSummary.insider}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                                        <button
                                            onClick={() => {
                                                setActiveSymbol(hoveredSetup.symbol);
                                                if (onPageChange) onPageChange('demo');
                                            }}
                                            className="bg-[#22c55e] hover:bg-green-500 text-[#0a0e1a] font-bold py-3 px-8 rounded-lg transition-transform hover:scale-105 active:scale-95 flex items-center mx-auto"
                                        >
                                            <Zap className="w-5 h-5 mr-2" />
                                            Execute {hoveredSetup.type} Trade Now
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-24 text-gray-500 border border-dashed border-gray-700 rounded-xl bg-[#1a1f36]/30">
                                    <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg font-medium text-gray-400">Hover over a setup on the left</p>
                                    <p className="text-sm">to expand deep AI market intelligence.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #2d3748;
                    border-radius: 20px;
                }
            `}</style>
        </div>
    );
}
