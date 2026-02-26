import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { TrendingUp, Mail, ArrowRight, Loader2 } from 'lucide-react';
import type { Page } from '@/App';

export function LoginPage({ isSignup = false, onPageChange }: { isSignup?: boolean, onPageChange: (page: Page) => void }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin,
            },
        });

        if (error) {
            setMessage({ text: error.message, type: 'error' });
        } else {
            setMessage({ text: 'Check your email for the login link!', type: 'success' });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-[calc(100vh-72px)] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#111827] border border-[#2d3748] rounded-2xl p-8 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-[#22c55e]/20 rounded-xl flex items-center justify-center mb-4">
                        <TrendingUp className="w-6 h-6 text-[#22c55e]" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {isSignup ? 'Create your account' : 'Welcome back'}
                    </h2>
                    <p className="text-[#94a3b8] text-sm text-center">
                        Enter your email to receive a secure magic link. No passwords required.
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full bg-[#0a0e1a] border border-[#2d3748] rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors"
                            />
                        </div>
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-red-500/10 text-red-500'}`}>
                            {message.text}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white py-6"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <div className="flex items-center gap-2">
                                {isSignup ? 'Sign Up' : 'Continue with Email'}
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        )}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-[#94a3b8]">
                    {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        type="button"
                        onClick={() => onPageChange(isSignup ? 'login' : 'signup')}
                        className="text-[#22c55e] hover:underline hover:text-[#16a34a] font-medium transition-colors"
                    >
                        {isSignup ? 'Log in' : 'Sign up'}
                    </button>
                </div>
            </div>
        </div>
    );
}
