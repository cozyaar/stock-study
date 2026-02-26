import { useAuth } from '../context/AuthProvider';
import { Shield, Lock } from 'lucide-react';
import type { Page } from '@/App';

export function DashboardPage({ onPageChange }: { onPageChange: (page: Page) => void }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-72px)] flex items-center justify-center">
                <div className="text-[#94a3b8]">Loading secure environment...</div>
            </div>
        );
    }

    if (!user) {
        // Basic route protection state (if accessed directly while logged out)
        return (
            <div className="min-h-[calc(100vh-72px)] flex flex-col items-center justify-center p-4">
                <Lock className="w-16 h-16 text-slate-600 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
                <p className="text-[#94a3b8] mb-6">You must be logged in to view the dashboard.</p>
                <button
                    onClick={() => onPageChange('login')}
                    className="bg-[#22c55e] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#16a34a]"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-[#22c55e]/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-[#22c55e]" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Secure Dashboard</h1>
                    <p className="text-[#94a3b8]">Welcome back, {user.email}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#111827] border border-[#2d3748] rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Account Status</h3>
                    <p className="text-[#22c55e] font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
                        Authenticated & Verified
                    </p>
                </div>
                <div className="bg-[#111827] border border-[#2d3748] rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Session ID</h3>
                    <p className="text-[#94a3b8] font-mono text-sm truncate">{user.id}</p>
                </div>
                <div className="bg-[#111827] border border-[#2d3748] rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Last Sign In</h3>
                    <p className="text-[#94a3b8]">
                        {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Just now'}
                    </p>
                </div>
            </div>
        </div>
    );
}
