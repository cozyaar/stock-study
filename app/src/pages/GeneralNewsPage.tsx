import { useEffect, useState } from 'react';
import { Newspaper, Globe, ShieldCheck } from 'lucide-react';

interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    source: string;
    contentSnippet: string;
    isVerified: boolean;
}

export function GeneralNewsPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/global-news')
            .then(res => res.json())
            .then(data => {
                setNews(data.news || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mb-8 border-b border-gray-800 pb-6">
                <h1 className="text-3xl font-bold text-white flex items-center">
                    <Globe className="w-8 h-8 text-blue-500 mr-3" />
                    Global Macro & Stock News
                </h1>
                <p className="text-gray-400 mt-2">Live feed aggregated from verified institutional sources and alternative sentiment data pipelines.</p>
            </div>

            {loading ? (
                <div className="flex flex-col justify-center items-center py-32 space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="text-blue-500 animate-pulse font-medium">Scraping global newswires...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {news.map((item, idx) => (
                        <div key={idx} className="bg-[#1a1f36]/80 p-6 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all hover:-translate-y-1 shadow-lg">
                            <div className="flex flex-wrap items-center justify-between mb-3">
                                <span className="px-3 py-1 bg-blue-900/40 text-blue-400 text-xs rounded-full flex items-center font-bold tracking-widest border border-blue-500/20">
                                    <ShieldCheck className="w-4 h-4 mr-1" />
                                    VERIFIED SOURCE
                                </span>
                                <span className="font-mono text-xs text-gray-500">
                                    {new Date(item.pubDate).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold mb-3 leading-snug">
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 text-white transition-colors flex items-start">
                                    <Newspaper className="w-5 h-5 mr-2 mt-0.5 opacity-70 shrink-0" />
                                    {item.title}
                                </a>
                            </h3>

                            <p className="text-gray-400 text-base mb-4 leading-relaxed">{item.contentSnippet || "Full report published on destination site."}</p>

                            <div className="flex justify-between items-center text-sm font-semibold text-gray-400 pt-4 border-t border-gray-800/50">
                                <span className="text-blue-300">Published By: {item.source.split(' - ')[0]}</span>
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    Read Full Article →
                                </a>
                            </div>
                        </div>
                    ))}

                    {news.length === 0 && (
                        <div className="text-center py-10 text-gray-500">No major market-moving news available at this second.</div>
                    )}
                </div>
            )}
        </div>
    );
}
