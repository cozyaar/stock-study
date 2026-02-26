import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { TrendingUp, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import React from 'react';
import type { Page } from '@/App';

export function LoginPage({ isSignup = false, onPageChange }: { isSignup?: boolean, onPageChange: (page: Page) => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: React.ReactNode; type: 'success' | 'error' } | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (isSignup) {
            const { error, data } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                if (error.message.includes("already registered")) {
                    setMessage({ text: 'Email already registered. Please log in instead.', type: 'error' });
                } else if (error.message.includes("Password should contain")) {
                    setMessage({
                        text: (
                            <div className="space-y-1 text-left">
                                <p className="font-semibold mb-2">Password must contain at least:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>One lowercase letter (a-z)</li>
                                    <li>One uppercase letter (A-Z)</li>
                                    <li>One number (0-9)</li>
                                    <li>One special character (!@#$%^&*)</li>
                                </ul>
                            </div>
                        ),
                        type: 'error'
                    });
                } else {
                    setMessage({ text: error.message, type: 'error' });
                }
            } else if (data?.user?.identities?.length === 0) {
                // Supabase quirk: if user exists but signUp is called, it returns data but empty identities
                setMessage({ text: 'Email already registered. Please log in instead.', type: 'error' });
            } else {
                setMessage({ text: 'Account created successfully! Redirecting...', type: 'success' });
                setTimeout(() => onPageChange('dashboard'), 1500);
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                if (error.message.includes('Invalid login credentials')) {
                    setMessage({ text: "Invalid login credentials. If you're new here, please Sign Up first.", type: 'error' });
                } else {
                    setMessage({ text: error.message, type: 'error' });
                }
            } else {
                setMessage({ text: 'Login successful! Redirecting...', type: 'success' });
                setTimeout(() => onPageChange('dashboard'), 1000);
            }
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
                        {isSignup ? 'Create a secure password to protect your account.' : 'Enter your email and password to access your dashboard.'}
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

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="w-full bg-[#0a0e1a] border border-[#2d3748] rounded-lg py-2.5 pl-10 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
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
                                {isSignup ? 'Create Account' : 'Secure Login'}
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
