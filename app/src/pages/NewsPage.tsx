import { useEffect, useState } from 'react';

interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    source: string;
    contentSnippet: string;
    isVerified: boolean;
}

interface SwingSetup {
    symbol: string;
    name: string;
    reason: string;
    type: string;
}

export function NewsPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [setups, setSetups] = useState<SwingSetup[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/news')
            .then(res => res.json())
            .then(data => {
                setNews(data.news || []);
                setSetups(data.swingSetups || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-[#22c55e]">Market News & Verified Swing Setups</h1>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22c55e]"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: News */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-800 pb-2">Latest Verified News</h2>
                        {news.map((item, idx) => (
                            <div key={idx} className="bg-[#1a1f36] p-6 rounded-lg shadow-lg border border-gray-800 hover:border-[#22c55e] transition-colors">
                                <span className="inline-block px-2 py-1 bg-green-900/50 text-green-400 text-xs rounded mb-3 flex items-center w-fit">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    Verified Source
                                </span>
                                <h3 className="text-xl font-medium mb-2">
                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-[#22c55e]">
                                        {item.title}
                                    </a>
                                </h3>
                                <p className="text-gray-400 text-sm mb-4">{item.contentSnippet}</p>
                                <div className="text-xs text-gray-500 flex justify-between">
                                    <span>{new Date(item.pubDate).toLocaleString()}</span>
                                    <span>{item.source}</span>
                                </div>
                            </div>
                        ))}
                        {news.length === 0 && (
                            <div className="text-gray-400">No recent market news found.</div>
                        )}
                    </div>

                    {/* Right Column: Swing Setups */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-800 pb-2">High Probability Swing Pickups</h2>
                        <div className="bg-gradient-to-br from-[#1a1f36] to-[#0a0e1a] p-6 rounded-xl border border-yellow-500/30">
                            <p className="text-sm text-yellow-500 mb-6 font-medium">
                                ⚠️ Note: These setups are algorithmically curated based on verified news sentimen, historical win rates, and fundamental strength. However, capital markets are volatile and returns are never completely guaranteed. Please manage risk appropriately.
                            </p>

                            <div className="space-y-4">
                                {setups.map((setup, idx) => (
                                    <div key={idx} className="bg-[#0a0e1a]/80 p-4 rounded-lg border border-gray-800 relative overflow-hidden shadow-md">
                                        <div className="absolute top-0 right-0 bg-[#22c55e]/20 text-[#22c55e] text-[10px] px-2 py-1 rounded-bl-lg font-bold">
                                            SWING PICK
                                        </div>
                                        <h4 className="font-bold text-lg text-white">{setup.symbol}</h4>
                                        <p className="text-xs text-gray-400 mb-2">{setup.name}</p>
                                        <p className="text-sm text-gray-300">
                                            <span className="text-[#22c55e] font-semibold">Rationale: </span>
                                            {setup.reason}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
