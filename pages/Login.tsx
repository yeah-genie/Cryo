
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, AlertCircle, Snowflake } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }
        if (!password) {
            setError('Please enter your password');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert('Check your email for the confirmation link!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
            style={{ background: 'var(--bg-primary)' }}>
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
                    style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
                    style={{ background: 'radial-gradient(circle, var(--accent-dim) 0%, transparent 70%)' }}></div>
            </div>

            {/* Login Card */}
            <div className="glass rounded-2xl w-full max-w-md p-8 relative z-10">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-xl mx-auto flex items-center justify-center mb-4"
                        style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dim) 100%)' }}>
                        <Snowflake className="w-7 h-7" style={{ color: 'var(--bg-primary)' }} />
                    </div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        {mode === 'signin' ? 'Welcome to Cryo' : 'Create Account'}
                    </h1>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {mode === 'signin'
                            ? 'Freeze your ideas, thaw them when ready'
                            : 'Start managing your idea icebox'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 rounded-lg flex items-center text-sm"
                        style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171' }}>
                        <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
                        <div className="relative">
                            <Mail className="w-5 h-5 absolute left-3 top-2.5" style={{ color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg outline-none transition-all duration-200"
                                style={{
                                    background: 'var(--bg-tertiary)',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-primary)'
                                }}
                                placeholder="name@company.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
                        <div className="relative">
                            <Lock className="w-5 h-5 absolute left-3 top-2.5" style={{ color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg outline-none transition-all duration-200"
                                style={{
                                    background: 'var(--bg-tertiary)',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-primary)'
                                }}
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center"
                        style={{
                            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dim) 100%)',
                            color: 'var(--bg-primary)'
                        }}
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            mode === 'signin' ? 'Sign In' : 'Sign Up'
                        )}
                    </button>

                    <div className="relative flex items-center justify-center my-4">
                        <div className="w-full absolute" style={{ borderTop: '1px solid var(--border)' }}></div>
                        <span className="px-3 text-xs relative" style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>OR</span>
                    </div>

                    <button
                        type="button"
                        onClick={async () => {
                            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
                            console.log('Login Debug:', {
                                supabaseUrl,
                                allEnv: import.meta.env
                            });

                            if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
                                setError(`Configuration Error: Invalid Supabase URL in .env file. Value: ${supabaseUrl}`);
                                return;
                            }
                            console.log('Starting Google OAuth login...');

                            const { data, error } = await supabase.auth.signInWithOAuth({
                                provider: 'google',
                                options: {
                                    redirectTo: window.location.origin
                                }
                            });

                            console.log('OAuth response:', { data, error });
                            if (error) setError(error.message);
                        }}
                        className="w-full glass font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>
                </form>

                <div className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                    {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                        className="font-medium transition-colors"
                        style={{ color: 'var(--accent)' }}
                    >
                        {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
