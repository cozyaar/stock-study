import { CalendarDays, AlertTriangle, TrendingUp, Briefcase } from 'lucide-react';

const events = [
    {
        date: 'March 1, 2026',
        title: 'GST Council Meeting',
        impact: 'High',
        description: 'Expected revisions on tax slabs for critical FMCG and cement sectors. Anticipate high volatility in these indexes.',
        type: 'domestic'
    },
    {
        date: 'March 15, 2026',
        title: 'RBI Monetary Policy Update',
        impact: 'Critical',
        description: 'Governor announcement regarding the repo rate. A highly anticipated 25bps cut could trigger a massive bank-nifty rally.',
        type: 'domestic'
    },
    {
        date: 'April 10, 2026',
        title: 'Q4 Earnings Season Kickoff',
        impact: 'High',
        description: 'TCS and Infosys to report earnings, setting the tone for the IT sector for the upcoming financial year.',
        type: 'earnings'
    },
    {
        date: 'May 1, 2026',
        title: 'Maharashtra State Elections Result',
        impact: 'Critical',
        description: 'State election outcomes often trigger macroscopic sentiment shifts in infrastructure and domestic institutional flows.',
        type: 'political'
    },
    {
        date: 'June 5, 2026',
        title: 'US Fed Interest Rate Decision',
        impact: 'Critical',
        description: 'Global macro impact. A dovish stance will increase FII (Foreign Institutional Investor) flows into Indian equities.',
        type: 'global'
    }
];

export function EconomicCalendarPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center">
                    <CalendarDays className="w-8 h-8 text-blue-500 mr-3" />
                    Economic Calendar & Macro Events
                </h1>
                <p className="text-gray-400 mt-2">Critical upcoming domestic and global catalysts that will drive market volatility.</p>
            </div>

            <div className="bg-[#1a1f36] border border-gray-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#0a0e1a]/50 text-xs uppercase tracking-widest text-gray-500 border-b border-gray-800">
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Event</th>
                                <th className="p-4 font-semibold">Impact</th>
                                <th className="p-4 font-semibold">Market Rationale</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {events.map((evt, idx) => (
                                <tr key={idx} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 whitespace-nowrap align-top">
                                        <span className="text-blue-400 font-mono text-sm">{evt.date}</span>
                                    </td>
                                    <td className="p-4 align-top">
                                        <p className="text-white font-medium flex items-center">
                                            {evt.type === 'political' && <AlertTriangle className="w-4 h-4 text-orange-400 mr-2" />}
                                            {evt.type === 'earnings' && <Briefcase className="w-4 h-4 text-purple-400 mr-2" />}
                                            {evt.type === 'global' && <TrendingUp className="w-4 h-4 text-blue-400 mr-2" />}
                                            {evt.title}
                                        </p>
                                    </td>
                                    <td className="p-4 align-top">
                                        <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded ${evt.impact === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                            }`}>
                                            {evt.impact}
                                        </span>
                                    </td>
                                    <td className="p-4 align-top">
                                        <p className="text-sm text-gray-400">{evt.description}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
