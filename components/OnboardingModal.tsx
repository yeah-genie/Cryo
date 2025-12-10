
import React, { useState, useEffect } from 'react';
import { Snowflake, MessageSquare, Lightbulb, Zap, Check, ArrowRight, X, ExternalLink } from 'lucide-react';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
    const [step, setStep] = useState(0);
    const [slackConnected, setSlackConnected] = useState(false);

    const steps = [
        {
            id: 'welcome',
            title: 'Welcome to Cryo ❄️',
            subtitle: 'Never lose a brilliant idea to bad timing',
            description: 'Cryo helps you freeze ideas until the conditions are right to wake them.',
            icon: Snowflake,
        },
        {
            id: 'connect',
            title: 'Connect Your Tools',
            subtitle: 'Get the most out of Smart Wake',
            description: 'Connect Slack to capture ideas and get notifications when conditions are met.',
            icon: MessageSquare,
        },
        {
            id: 'first-idea',
            title: 'Add Your First Idea',
            subtitle: 'Start freezing ideas today',
            description: 'Think of an idea you want to revisit later. We\'ll help you set the right conditions.',
            icon: Lightbulb,
        },
        {
            id: 'ready',
            title: 'You\'re All Set! 🎉',
            subtitle: 'Smart Wake is ready',
            description: 'We\'ll notify you when your frozen ideas are ready to wake up.',
            icon: Zap,
        },
    ];

    const handleConnectSlack = () => {
        // In production, this would open OAuth
        window.open('https://slack.com/oauth/v2/authorize', '_blank');
        // Simulate connection for demo
        setTimeout(() => setSlackConnected(true), 1000);
    };

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        localStorage.setItem('cryo_onboarding_completed', 'true');
        onComplete();
    };

    const handleSkip = () => {
        localStorage.setItem('cryo_onboarding_completed', 'true');
        onClose();
    };

    if (!isOpen) return null;

    const currentStep = steps[step];
    const StepIcon = currentStep.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.8)' }}>
            <div className="relative w-full max-w-lg mx-4 rounded-2xl overflow-hidden"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>

                {/* Close button */}
                <button onClick={handleSkip}
                    className="absolute top-4 right-4 p-2 rounded-lg transition-all hover:bg-white/10"
                    style={{ color: 'var(--text-muted)' }}>
                    <X className="w-5 h-5" />
                </button>

                {/* Progress bar */}
                <div className="h-1 flex" style={{ background: 'var(--bg-tertiary)' }}>
                    {steps.map((_, i) => (
                        <div key={i} className="flex-1 h-full transition-all"
                            style={{ background: i <= step ? 'var(--accent)' : 'transparent' }} />
                    ))}
                </div>

                {/* Content */}
                <div className="p-8 text-center">
                    {/* Icon */}
                    <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6"
                        style={{ background: 'var(--accent-glow)' }}>
                        <StepIcon className="w-10 h-10" style={{ color: 'var(--accent)' }} />
                    </div>

                    {/* Text */}
                    <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        {currentStep.title}
                    </h2>
                    <p className="text-sm mb-2" style={{ color: 'var(--accent)' }}>
                        {currentStep.subtitle}
                    </p>
                    <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
                        {currentStep.description}
                    </p>

                    {/* Step-specific content */}
                    {step === 1 && (
                        <div className="mb-8 space-y-3">
                            <button onClick={handleConnectSlack}
                                className="w-full flex items-center justify-between p-4 rounded-xl transition-all"
                                style={{
                                    background: slackConnected ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-tertiary)',
                                    border: slackConnected ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border)'
                                }}>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">💬</span>
                                    <div className="text-left">
                                        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Slack</div>
                                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Capture ideas from channels</div>
                                    </div>
                                </div>
                                {slackConnected ? (
                                    <span className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                                        style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                                        <Check className="w-3 h-3" /> Connected
                                    </span>
                                ) : (
                                    <span className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                                        Connect <ExternalLink className="w-3 h-3" />
                                    </span>
                                )}
                            </button>

                            <div className="flex items-center justify-between p-4 rounded-xl"
                                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">📝</span>
                                    <div className="text-left">
                                        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Notion</div>
                                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Sync with databases</div>
                                    </div>
                                </div>
                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Coming soon</span>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="mb-8">
                            <div className="p-4 rounded-xl text-left" style={{ background: 'var(--bg-tertiary)' }}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                        style={{ background: 'var(--accent-glow)' }}>
                                        <Lightbulb className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Example: AI Resume Builder</div>
                                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Wait until GPT-5 releases</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--accent)' }}>
                                    <Zap className="w-3 h-3" />
                                    <span>Wake when: External signal "GPT-5 announced"</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                        <button onClick={handleSkip}
                            className="text-sm px-4 py-2 rounded-lg transition-all"
                            style={{ color: 'var(--text-muted)' }}>
                            Skip for now
                        </button>
                        <button onClick={handleNext}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all"
                            style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>
                            {step === steps.length - 1 ? 'Get Started' : 'Continue'}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingModal;
