import React, { useState } from 'react';
import { Snowflake, Lightbulb, Zap, ArrowRight, X, Sparkles, Clock, BarChart2 } from 'lucide-react';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
    const [step, setStep] = useState(0);

    const steps = [
        {
            id: 'welcome',
            title: 'Welcome to Cryo ❄️',
            subtitle: 'Let your ideas hibernate until the time is right',
            description: 'Great ideas sometimes fail just because of bad timing. Cryo helps you freeze them and wake them up when conditions are perfect.',
            icon: Snowflake,
            features: [
                { icon: Snowflake, text: 'Freeze ideas that aren\'t ready yet' },
                { icon: Clock, text: 'Set smart triggers for wake-up' },
                { icon: Sparkles, text: 'AI recommends the perfect timing' },
            ]
        },
        {
            id: 'how-it-works',
            title: 'How Cryo Works',
            subtitle: '3 simple steps to never lose an idea',
            description: '',
            icon: Lightbulb,
            steps: [
                { num: '1', title: 'Capture', desc: 'Add ideas from anywhere - manually, Slack, or Linear' },
                { num: '2', title: 'Freeze', desc: 'Set conditions: time, metrics, or external signals' },
                { num: '3', title: 'Wake', desc: 'Get notified when your idea is ready to execute' },
            ]
        },
        {
            id: 'ready',
            title: 'You\'re Ready! 🚀',
            subtitle: 'Start building your idea icebox',
            description: 'Add your first idea and we\'ll help you set the perfect wake conditions.',
            icon: Zap,
            cta: true
        },
    ];

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden animate-fadeIn"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>

                {/* Close button */}
                <button onClick={handleSkip}
                    className="absolute top-4 right-4 p-2 rounded-lg transition-all hover:bg-white/10 z-10"
                    style={{ color: 'var(--text-muted)' }}>
                    <X className="w-5 h-5" />
                </button>

                {/* Progress dots */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {steps.map((_, i) => (
                        <div key={i}
                            className={`w-2 h-2 rounded-full transition-all ${i === step ? 'w-6' : ''}`}
                            style={{ background: i <= step ? 'var(--accent)' : 'var(--bg-tertiary)' }} />
                    ))}
                </div>

                {/* Content */}
                <div className="p-8 pt-14 text-center">
                    {/* Icon */}
                    <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 relative"
                        style={{ background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.2) 0%, rgba(14, 165, 233, 0.1) 100%)' }}>
                        <StepIcon className="w-10 h-10" style={{ color: 'var(--accent)' }} />
                        <div className="absolute inset-0 rounded-2xl animate-pulse"
                            style={{ background: 'radial-gradient(circle at center, rgba(34, 211, 238, 0.3) 0%, transparent 70%)' }} />
                    </div>

                    {/* Text */}
                    <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        {currentStep.title}
                    </h2>
                    <p className="text-sm mb-2 font-medium" style={{ color: 'var(--accent)' }}>
                        {currentStep.subtitle}
                    </p>
                    {currentStep.description && (
                        <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                            {currentStep.description}
                        </p>
                    )}

                    {/* Step 0: Features */}
                    {step === 0 && currentStep.features && (
                        <div className="space-y-3 mb-6">
                            {currentStep.features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl text-left"
                                    style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ background: 'var(--accent-glow)' }}>
                                        <feature.icon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                                    </div>
                                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Step 1: How it works */}
                    {step === 1 && currentStep.steps && (
                        <div className="space-y-4 mb-6 mt-4">
                            {currentStep.steps.map((s, i) => (
                                <div key={i} className="flex items-start gap-4 text-left">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg"
                                        style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>
                                        {s.num}
                                    </div>
                                    <div>
                                        <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{s.title}</div>
                                        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Step 2: CTA */}
                    {step === 2 && (
                        <div className="mb-6 p-4 rounded-xl"
                            style={{ background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)', border: '1px solid rgba(34, 211, 238, 0.2)' }}>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                💡 <strong>Pro Tip:</strong> Connect Slack in Settings to capture ideas from your team conversations!
                            </p>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-6">
                        <button onClick={handleSkip}
                            className="text-sm px-4 py-2 rounded-lg transition-all hover:bg-white/5"
                            style={{ color: 'var(--text-muted)' }}>
                            Skip
                        </button>
                        <button onClick={handleNext}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105"
                            style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>
                            {step === steps.length - 1 ? 'Add My First Idea' : 'Continue'}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default OnboardingModal;
