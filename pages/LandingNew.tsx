import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Snowflake, ArrowRight, Sparkles, CheckCircle, AlertCircle, Loader2, Zap } from 'lucide-react';
import {
    getNotionOAuthUrl,
    exchangeNotionCode,
    scanNotionForIdeas,
    storeNotionToken,
    DiscoveredIdea,
    ScanResult
} from '../services/notionService';
import { supabase } from '../services/supabase';
import confetti from 'canvas-confetti';

type Stage = 'landing' | 'connecting' | 'scanning' | 'results' | 'classify' | 'freeze' | 'signup';

const LandingNew: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [stage, setStage] = useState<Stage>('landing');
    const [scanProgress, setScanProgress] = useState({ stage: '', current: 0, total: 0 });
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [selectedIdeas, setSelectedIdeas] = useState<Set<string>>(new Set());
    const [classifiedIdeas, setClassifiedIdeas] = useState<Map<string, 'now' | 'later' | 'discard'>>(new Map());
    const [error, setError] = useState<string | null>(null);
    const [currentClassifyIndex, setCurrentClassifyIndex] = useState(0);

    // Save frozen ideas to localStorage for migration after signup
    const saveFrozenIdeasToStorage = () => {
        const frozenIdeas = scanResult?.discoveredIdeas.filter(i => classifiedIdeas.get(i.id) === 'later') || [];
        const nowIdeas = scanResult?.discoveredIdeas.filter(i => classifiedIdeas.get(i.id) === 'now') || [];

        if (frozenIdeas.length > 0 || nowIdeas.length > 0) {
            const data = {
                frozenIdeas: frozenIdeas.map(i => ({
                    title: i.title,
                    content: i.content,
                    source: i.source,
                    sourceUrl: i.sourceUrl,
                    dormantDays: i.dormantDays,
                    status: 'frozen'
                })),
                nowIdeas: nowIdeas.map(i => ({
                    title: i.title,
                    content: i.content,
                    source: i.source,
                    sourceUrl: i.sourceUrl,
                    dormantDays: i.dormantDays,
                    status: 'active'
                })),
                savedAt: new Date().toISOString()
            };
            localStorage.setItem('cryo_pending_ideas', JSON.stringify(data));
        }
    };
    // Handle inline Google signup (no page redirect before OAuth)
    const handleGoogleSignup = async () => {
        saveFrozenIdeasToStorage();
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/`
            }
        });
        if (error) {
            setError('Failed to start Google signup. Please try again.');
        }
    };

    // Handle navigation to login with saving (fallback for email)
    const handleEmailSignup = () => {
        saveFrozenIdeasToStorage();
        navigate('/login');
    };

    // Handle OAuth callback
    useEffect(() => {
        const code = searchParams.get('code');
        if (code) {
            handleNotionCallback(code);
        }
    }, [searchParams]);

    const handleNotionConnect = () => {
        // Check if we have credentials
        const clientId = import.meta.env.VITE_NOTION_CLIENT_ID;

        if (!clientId) {
            // Demo mode: simulate scan
            setStage('scanning');
            simulateScan();
            return;
        }

        // Real OAuth
        window.location.href = getNotionOAuthUrl();
    };

    const handleNotionCallback = async (code: string) => {
        setStage('connecting');
        setError(null);
        try {
            const token = await exchangeNotionCode(code);
            storeNotionToken(token);
            setStage('scanning');
            await performScan(token);
        } catch (err: any) {
            setError(`Connection failed: ${err.message || 'Unknown error'}. Please try again.`);
            setStage('landing');
        }
    };

    const performScan = async (token: string) => {
        try {
            const result = await scanNotionForIdeas(token, (stage, current, total) => {
                setScanProgress({ stage, current, total });
            });
            setScanResult(result);
            setStage('results');
            triggerConfetti();
        } catch (err: any) {
            setError(`Scan failed: ${err.message || 'Unknown error'}. Please try again.`);
            setStage('landing');
        }
    };

    const simulateScan = async () => {
        // Demo mode: simulate scanning
        const stages = [
            { stage: 'fetching', steps: 20 },
            { stage: 'analyzing', steps: 30 },
        ];

        for (const s of stages) {
            for (let i = 0; i <= s.steps; i++) {
                await new Promise(r => setTimeout(r, 80));
                setScanProgress({
                    stage: s.stage,
                    current: i,
                    total: s.steps
                });
            }
        }

        // Generate demo discovered ideas
        const demoIdeas: DiscoveredIdea[] = [
            {
                id: '1',
                title: 'B2B SaaS 피벗 검토',
                content: '현재 B2C 모델에서 B2B로의 전환을 고려. 기업 고객 대상 가격 정책 필요...',
                source: 'Notion: 전략 문서',
                sourceUrl: 'https://notion.so/...',
                lastEdited: '2023-03-15',
                dormantDays: 267,
                confidence: 0.92,
            },
            {
                id: '2',
                title: 'AI 챗봇 기능 추가',
                content: '고객 지원을 위한 AI 챗봇 도입 검토. GPT-4 API 활용 방안...',
                source: 'Notion: 제품 백로그',
                sourceUrl: 'https://notion.so/...',
                lastEdited: '2023-08-22',
                dormantDays: 112,
                confidence: 0.88,
            },
            {
                id: '3',
                title: '해외 진출 검토',
                content: '일본 및 동남아 시장 진출 가능성. 현지화 전략 필요...',
                source: 'Notion: 사업 계획',
                sourceUrl: 'https://notion.so/...',
                lastEdited: '2024-01-10',
                dormantDays: 45,
                confidence: 0.85,
            },
            {
                id: '4',
                title: '구독 모델 재설계',
                content: '현재 월 구독에서 연간 + 사용량 기반 하이브리드 모델로...',
                source: 'Notion: 가격 정책',
                sourceUrl: 'https://notion.so/...',
                lastEdited: '2023-11-20',
                dormantDays: 78,
                confidence: 0.91,
            },
            {
                id: '5',
                title: '모바일 앱 MVP',
                content: 'React Native로 iOS/Android 동시 개발. 핵심 기능만 먼저...',
                source: 'Notion: 개발 로드맵',
                sourceUrl: 'https://notion.so/...',
                lastEdited: '2023-06-05',
                dormantDays: 189,
                confidence: 0.87,
            },
        ];

        setScanResult({
            totalPages: 342,
            analyzedPages: 342,
            discoveredIdeas: demoIdeas,
            averageDormantDays: Math.round(demoIdeas.reduce((s, i) => s + i.dormantDays, 0) / demoIdeas.length),
            oldestIdea: demoIdeas[0],
        });
        setStage('results');
        triggerConfetti();
    };

    const triggerConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#22d3ee', '#0ea5e9', '#6366f1'],
        });
    };

    const startClassification = () => {
        setCurrentClassifyIndex(0);
        setStage('classify');
    };

    const handleClassify = (ideaId: string, action: 'now' | 'later' | 'discard') => {
        const newMap = new Map(classifiedIdeas);
        newMap.set(ideaId, action);
        setClassifiedIdeas(newMap);

        if (currentClassifyIndex < (scanResult?.discoveredIdeas.length || 0) - 1) {
            setCurrentClassifyIndex(prev => prev + 1);
        } else {
            // All classified
            const frozenCount = Array.from(newMap.values()).filter(v => v === 'later').length;
            if (frozenCount > 0) {
                setStage('signup');
            } else {
                // No frozen ideas, go to dashboard
                navigate('/');
            }
        }
    };

    const getFrozenIdeas = () => {
        return scanResult?.discoveredIdeas.filter(i => classifiedIdeas.get(i.id) === 'later') || [];
    };

    // Render based on stage
    const renderStage = () => {
        switch (stage) {
            case 'landing':
                return (
                    <div className="min-h-screen flex flex-col items-center justify-center px-6">
                        {/* Floating snowflakes background */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {[...Array(20)].map((_, i) => (
                                <Snowflake
                                    key={i}
                                    className="absolute text-cyan-500/10 animate-float"
                                    style={{
                                        left: `${Math.random() * 100}% `,
                                        top: `${Math.random() * 100}% `,
                                        fontSize: `${Math.random() * 20 + 10} px`,
                                        animationDelay: `${Math.random() * 5} s`,
                                        animationDuration: `${Math.random() * 10 + 10} s`,
                                    }}
                                />
                            ))}
                        </div>

                        <div className="relative z-10 text-center max-w-2xl">
                            {/* Logo */}
                            <div className="flex items-center justify-center gap-3 mb-8">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
                                    style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dim) 100%)', color: 'var(--bg-primary)' }}>
                                    C
                                </div>
                                <span className="font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>Cryo</span>
                            </div>

                            {/* Main hook */}
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
                                style={{ color: 'var(--text-primary)' }}>
                                How many ideas are buried<br />in your <span style={{ color: 'var(--accent)' }}>Notion</span>?
                            </h1>

                            <p className="text-lg mb-10" style={{ color: 'var(--text-secondary)' }}>
                                We'll find them for you. And wake them up at the right time.
                            </p>

                            {/* Single CTA */}
                            <button
                                onClick={handleNotionConnect}
                                className="group px-8 py-4 rounded-2xl text-lg font-semibold flex items-center justify-center gap-3 mx-auto transition-all hover:scale-105"
                                style={{
                                    background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dim) 100%)',
                                    color: 'var(--bg-primary)',
                                    boxShadow: '0 0 40px rgba(34, 211, 238, 0.3)'
                                }}>
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.98-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.84-.046.933-.56.933-1.167V6.354c0-.606-.233-.933-.746-.886l-15.177.887c-.56.047-.747.327-.747.933z" />
                                </svg>
                                Connect Notion
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <p className="mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
                                Read-only access · Takes 30 seconds
                            </p>
                        </div>
                    </div>
                );

            case 'connecting':
                return (
                    <div className="min-h-screen flex flex-col items-center justify-center">
                        <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: 'var(--accent)' }} />
                        <p style={{ color: 'var(--text-primary)' }}>Connecting to Notion...</p>
                    </div>
                );

            case 'scanning':
                return (
                    <div className="min-h-screen flex flex-col items-center justify-center px-6">
                        <div className="text-center max-w-md">
                            <Snowflake className="w-16 h-16 mx-auto mb-6 animate-pulse" style={{ color: 'var(--accent)' }} />

                            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                                {scanProgress.stage === 'fetching' ? 'Collecting pages...' : 'Analyzing ideas...'}
                            </h2>

                            {/* Progress bar */}
                            <div className="w-full h-2 rounded-full overflow-hidden mb-4" style={{ background: 'var(--bg-tertiary)' }}>
                                <div
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{
                                        width: `${scanProgress.total > 0 ? (scanProgress.current / scanProgress.total) * 100 : 0}% `,
                                        background: 'linear-gradient(90deg, var(--accent) 0%, var(--accent-dim) 100%)'
                                    }}
                                />
                            </div>

                            <div className="flex justify-between text-sm" style={{ color: 'var(--text-muted)' }}>
                                <span>📄 {scanProgress.current} {scanProgress.stage === 'fetching' ? 'collected' : 'analyzed'}</span>
                                <span>💡 Finding idea candidates...</span>
                            </div>
                        </div>
                    </div>
                );

            case 'results':
                return (
                    <div className="min-h-screen flex flex-col items-center justify-center px-6">
                        <div className="text-center max-w-lg">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                                style={{ background: 'rgba(34, 211, 238, 0.2)' }}>
                                <Sparkles className="w-10 h-10" style={{ color: 'var(--accent)' }} />
                            </div>

                            <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                                🎉 Discovery Complete!
                            </h2>

                            <div className="frozen-card ice-breath rounded-2xl p-6 my-8">
                                <div className="text-5xl font-bold mb-2" style={{ color: 'var(--accent)' }}>
                                    {scanResult?.discoveredIdeas.length || 0}
                                </div>
                                <div style={{ color: 'var(--text-secondary)' }}>forgotten ideas found</div>

                                <div className="flex justify-around mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                                    <div>
                                        <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                            {scanResult?.averageDormantDays || 0} days
                                        </div>
                                        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>avg. dormant time</div>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                            {scanResult?.totalPages || 0}
                                        </div>
                                        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>pages analyzed</div>
                                    </div>
                                </div>
                            </div>

                            {scanResult?.oldestIdea && (
                                <div className="text-left frozen-card rounded-xl p-4 mb-8">
                                    <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Oldest idea</div>
                                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                        "{scanResult.oldestIdea.title}"
                                    </div>
                                    <div className="text-sm mt-1" style={{ color: 'var(--accent)' }}>
                                        Last edited {scanResult.oldestIdea.dormantDays} days ago
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={startClassification}
                                className="w-full px-6 py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2"
                                style={{
                                    background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dim) 100%)',
                                    color: 'var(--bg-primary)'
                                }}>
                                Organize Ideas <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                );

            case 'classify':
                const currentIdea = scanResult?.discoveredIdeas[currentClassifyIndex];
                const progress = ((currentClassifyIndex + 1) / (scanResult?.discoveredIdeas.length || 1)) * 100;

                return (
                    <div className="min-h-screen flex flex-col items-center justify-center px-6">
                        <div className="w-full max-w-md">
                            {/* Progress */}
                            <div className="mb-8">
                                <div className="flex justify-between text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                                    <span>{currentClassifyIndex + 1} / {scanResult?.discoveredIdeas.length}</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="w-full h-1 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                                    <div className="h-full rounded-full transition-all"
                                        style={{ width: `${progress}% `, background: 'var(--accent)' }} />
                                </div>
                            </div>

                            {/* Card */}
                            {currentIdea && (
                                <div className="frozen-card frost-border rounded-2xl p-6 mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs px-2 py-1 rounded-full"
                                            style={{ background: 'rgba(34, 211, 238, 0.2)', color: 'var(--accent)' }}>
                                            {currentIdea.source}
                                        </span>
                                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                            🕐 {currentIdea.dormantDays}d
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold mb-3 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                                        {currentIdea.title}
                                    </h3>
                                    <p className="text-sm line-clamp-3 mb-0" style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                        {currentIdea.content}
                                    </p>
                                </div>
                            )}

                            {/* Actions - Sleek pill buttons */}
                            <div className="flex gap-2 justify-center">
                                <button
                                    onClick={() => handleClassify(currentIdea?.id || '', 'now')}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full transition-all hover:scale-105 hover:shadow-lg"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 0.9) 100%)',
                                        color: 'white',
                                        boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)'
                                    }}>
                                    <span className="text-base">✓</span>
                                    <span className="text-sm font-medium">Now</span>
                                </button>

                                <button
                                    onClick={() => handleClassify(currentIdea?.id || '', 'later')}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full transition-all hover:scale-105 hover:shadow-lg"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.9) 0%, rgba(6, 182, 212, 0.9) 100%)',
                                        color: 'white',
                                        boxShadow: '0 4px 15px rgba(34, 211, 238, 0.3)'
                                    }}>
                                    <span className="text-base">❄</span>
                                    <span className="text-sm font-medium">Freeze</span>
                                </button>

                                <button
                                    onClick={() => handleClassify(currentIdea?.id || '', 'discard')}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full transition-all hover:scale-105 hover:shadow-lg"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        color: 'var(--text-muted)'
                                    }}>
                                    <span className="text-sm font-medium">Skip</span>
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'signup':
                const frozenIdeas = getFrozenIdeas();

                return (
                    <div className="min-h-screen flex flex-col items-center justify-center px-6">
                        <div className="text-center max-w-md">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                                style={{ background: 'rgba(34, 211, 238, 0.2)' }}>
                                <Snowflake className="w-10 h-10" style={{ color: 'var(--accent)' }} />
                            </div>

                            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                                ❄️ {frozenIdeas.length} ideas ready to freeze!
                            </h2>

                            <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
                                Save them and we'll remind you at the right time
                            </p>

                            {/* Summary */}
                            <div className="glass rounded-xl p-4 mb-6 text-left">
                                <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} />
                                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Classification Complete!</span>
                                </div>
                                <div className="flex justify-around">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold" style={{ color: '#22c55e' }}>
                                            {scanResult?.discoveredIdeas.filter(i => classifiedIdeas.get(i.id) === 'now').length || 0}
                                        </div>
                                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Active</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                                            {frozenIdeas.length}
                                        </div>
                                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Frozen</div>
                                    </div>
                                </div>
                            </div>

                            {/* Frozen ideas preview */}
                            <div className="text-left space-y-2 mb-6">
                                {frozenIdeas.slice(0, 2).map(idea => (
                                    <div key={idea.id} className="frozen-card rounded-lg p-3 flex items-center gap-3">
                                        <Snowflake className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                                        <span className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                                            {idea.title}
                                        </span>
                                    </div>
                                ))}
                                {frozenIdeas.length > 2 && (
                                    <div className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
                                        +{frozenIdeas.length - 2} more ideas ready to freeze
                                    </div>
                                )}
                            </div>

                            {/* Inline sign up */}
                            <div className="glass rounded-xl p-4 mb-4">
                                <p className="text-sm mb-4 text-center" style={{ color: 'var(--text-secondary)' }}>
                                    Sign up to save your {frozenIdeas.length + (scanResult?.discoveredIdeas.filter(i => classifiedIdeas.get(i.id) === 'now').length || 0)} ideas
                                </p>
                                <button
                                    onClick={handleGoogleSignup}
                                    className="w-full px-6 py-4 rounded-xl text-base font-semibold flex items-center justify-center gap-2 mb-3 hover:scale-[1.02] transition-transform"
                                    style={{
                                        background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dim) 100%)',
                                        color: 'var(--bg-primary)'
                                    }}>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </button>

                                <button
                                    onClick={handleEmailSignup}
                                    className="w-full px-4 py-2 rounded-lg text-sm font-medium"
                                    style={{ color: 'var(--text-muted)' }}>
                                    or continue with Email
                                </button>
                            </div>

                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                Your ideas will be saved automatically after signup
                            </p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
            {error && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 glass px-4 py-2 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" style={{ color: '#f59e0b' }} />
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{error}</span>
                </div>
            )}
            {renderStage()}
        </div>
    );
};

export default LandingNew;
