import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snowflake, ArrowRight, Zap, Clock, Users, Lightbulb, ChevronDown, ChevronUp, Sparkles, Globe, BarChart2 } from 'lucide-react';

const Landing: React.FC = () => {
    const navigate = useNavigate();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const features = [
        {
            icon: Snowflake,
            title: 'Freeze Ideas',
            subtitle: 'Not now, not never',
            description: 'Stop killing good ideas. Freeze them until the timing is right.',
            gradient: 'from-cyan-500/20 to-blue-500/10'
        },
        {
            icon: Zap,
            title: 'Smart Wake',
            subtitle: 'AI-powered timing',
            description: 'Get notified when external signals suggest it\'s time to revisit.',
            gradient: 'from-yellow-500/20 to-orange-500/10'
        },
        {
            icon: Users,
            title: 'Team Voting',
            subtitle: 'Democratic prioritization',
            description: 'Let your team vote on which frozen ideas to wake up next.',
            gradient: 'from-purple-500/20 to-pink-500/10'
        },
        {
            icon: Clock,
            title: 'Decision History',
            subtitle: 'Track the why',
            description: 'Remember why you froze it. Track outcomes when you wake it.',
            gradient: 'from-green-500/20 to-emerald-500/10'
        }
    ];

    const faqs = [
        {
            question: "What's the difference between freezing and deleting?",
            answer: "Deleting removes an idea forever. Freezing preserves it with context, ready to be woken when conditions change. You keep the 'why' and can track outcomes later."
        },
        {
            question: "How does Smart Wake know when to notify me?",
            answer: "Smart Wake monitors external signals like news, metrics, and team votes. When relevance increases, it recommends waking specific ideas with clear reasoning."
        },
        {
            question: "Can I connect my existing tools?",
            answer: "Yes! Cryo integrates with Notion, Slack, and more. Import ideas from your existing backlog or capture new ones directly from Slack."
        },
        {
            question: "Is Cryo free?",
            answer: "Cryo is free during beta. We'll announce pricing before any changes, and early users will get special benefits."
        }
    ];

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
                style={{ background: 'rgba(10, 15, 28, 0.8)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Snowflake className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                        <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Cryo</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/welcome')}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                            style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>
                            Try Cryo Free
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-30"
                    style={{ background: 'radial-gradient(ellipse, rgba(34, 211, 238, 0.3) 0%, transparent 70%)' }} />
                <div className="absolute top-40 left-20 w-64 h-64 opacity-20"
                    style={{ background: 'radial-gradient(circle, rgba(14, 165, 233, 0.4) 0%, transparent 70%)' }} />

                <div className="relative max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-6"
                        style={{ background: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.3)', color: 'var(--accent)' }}>
                        <Sparkles className="w-3 h-3" />
                        AI-powered idea management
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6" style={{ color: 'var(--text-primary)' }}>
                        Freeze ideas.
                        <br />
                        <span style={{ color: 'var(--accent)' }}>Wake them smarter.</span>
                    </h1>

                    <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10" style={{ color: 'var(--text-secondary)' }}>
                        Stop killing good ideas just because "not now."
                        <br className="hidden md:block" />
                        Cryo preserves your backlog until the timing is right.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/welcome')}
                            className="group flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all hover:scale-105"
                            style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #0ea5e9 100%)', color: 'var(--bg-primary)' }}>
                            Start Freezing
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-medium transition-all hover:bg-white/5"
                            style={{ color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            View Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Visual Demo */}
            <section className="relative py-16 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="rounded-2xl overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)', border: '1px solid rgba(34, 211, 238, 0.2)' }}>
                        <div className="p-8 grid grid-cols-3 gap-6">
                            {/* Active Ideas */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-4">
                                    <Lightbulb className="w-4 h-4" style={{ color: '#22c55e' }} />
                                    <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Active</span>
                                </div>
                                {['Dark mode toggle', 'API rate limiting'].map((idea, i) => (
                                    <div key={i} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{idea}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Frozen Ideas */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-4">
                                    <Snowflake className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                                    <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Frozen</span>
                                </div>
                                {['Mobile app', 'Team analytics', 'AI assistant'].map((idea, i) => (
                                    <div key={i} className="p-3 rounded-lg"
                                        style={{ background: 'rgba(34, 211, 238, 0.1)', borderLeft: '2px solid var(--accent)' }}>
                                        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{idea}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Ready to Wake */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-4">
                                    <Zap className="w-4 h-4" style={{ color: '#f59e0b' }} />
                                    <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Ready to Wake</span>
                                </div>
                                <div className="p-3 rounded-lg"
                                    style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                                    <span className="text-sm font-medium" style={{ color: '#f59e0b' }}>Mobile app</span>
                                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                                        ⚡ 5 team votes • Market trend detected
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                            Built for modern product teams
                        </h2>
                        <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
                            Everything you need to manage ideas without losing them
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, i) => (
                            <div key={i}
                                className="group p-6 rounded-2xl transition-all hover:scale-[1.02]"
                                style={{ background: `linear-gradient(135deg, ${feature.gradient.split(' ')[0].replace('from-', '').replace('/20', '')}20 0%, ${feature.gradient.split(' ')[1].replace('to-', '').replace('/10', '')}10 100%)`, border: '1px solid rgba(255,255,255,0.05)' }}>
                                <feature.icon className="w-10 h-10 mb-4" style={{ color: 'var(--accent)' }} />
                                <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{feature.title}</h3>
                                <p className="text-sm mb-2" style={{ color: 'var(--accent)' }}>{feature.subtitle}</p>
                                <p style={{ color: 'var(--text-muted)' }}>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Integrations */}
            <section className="py-16 px-6" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="max-w-4xl mx-auto text-center">
                    <h3 className="text-xl font-bold mb-8" style={{ color: 'var(--text-muted)' }}>
                        Connects with your existing tools
                    </h3>
                    <div className="flex items-center justify-center gap-12 flex-wrap">
                        {['Notion', 'Slack', 'Linear', 'Google Analytics'].map((tool, i) => (
                            <div key={i} className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                                <Globe className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                                <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{tool}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                            Frequently asked questions
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <div key={i}
                                className="rounded-xl overflow-hidden transition-all"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full p-5 flex items-center justify-between text-left">
                                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{faq.question}</span>
                                    {openFaq === i ? (
                                        <ChevronUp className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                                    ) : (
                                        <ChevronDown className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                                    )}
                                </button>
                                {openFaq === i && (
                                    <div className="px-5 pb-5">
                                        <p style={{ color: 'var(--text-muted)' }}>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="rounded-3xl p-12 relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.15) 0%, rgba(14, 165, 233, 0.1) 100%)', border: '1px solid rgba(34, 211, 238, 0.3)' }}>
                        <div className="absolute top-0 right-0 w-64 h-64 opacity-30"
                            style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }} />

                        <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10" style={{ color: 'var(--text-primary)' }}>
                            Ready to stop losing good ideas?
                        </h2>
                        <p className="text-lg mb-8 relative z-10" style={{ color: 'var(--text-secondary)' }}>
                            Start freezing. Start waking smarter.
                        </p>
                        <button
                            onClick={() => navigate('/welcome')}
                            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all hover:scale-105 relative z-10"
                            style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>
                            Get Started Free
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Snowflake className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                        <span className="font-medium" style={{ color: 'var(--text-muted)' }}>Cryo</span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        © 2024 Cryo. Built for product teams.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
