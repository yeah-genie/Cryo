import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LucideIcon, Plus, ArrowRight, Lightbulb, Snowflake, FileText, Sparkles } from 'lucide-react';

interface EmptyStateProps {
    type?: 'ideas' | 'frozen' | 'decisions' | 'dashboard' | 'generic';
    icon?: LucideIcon;
    title?: string;
    description?: string;
    actionLabel?: string;
    actionPath?: string;
    onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    type = 'generic',
    icon: PropIcon,
    title: propTitle,
    description: propDescription,
    actionLabel: propActionLabel,
    actionPath,
    onAction,
}) => {
    const navigate = useNavigate();

    const configs: Record<string, {
        icon: LucideIcon;
        title: string;
        subtitle: string;
        description: string;
        action: string;
        tips: string[];
        gradient: string;
    }> = {
        ideas: {
            icon: Lightbulb,
            title: "Your idea vault is empty",
            subtitle: "Every great startup started with an idea",
            description: "Capture your ideas here. When timing isn't right, freeze them. We'll remind you when conditions are perfect.",
            action: "Add Your First Idea",
            tips: [
                "💡 Capture ideas before they slip away",
                "❄️ Freeze when timing isn't right",
                "⏰ Set smart wake-up conditions"
            ],
            gradient: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(249, 115, 22, 0.08) 100%)'
        },
        frozen: {
            icon: Snowflake,
            title: "Cryo Chamber is empty",
            subtitle: "No frozen ideas... yet!",
            description: "Great ideas sometimes fail because of bad timing. Freeze them here and wake them when the time is right.",
            action: "Freeze an Idea",
            tips: [
                "❄️ Frozen ideas aren't dead - just sleeping",
                "📊 Set metric triggers (e.g., MAU > 5000)",
                "📰 Set external signals (e.g., 'GPT-5 announced')"
            ],
            gradient: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(6, 182, 212, 0.08) 100%)'
        },
        decisions: {
            icon: FileText,
            title: "No decisions yet",
            subtitle: "Track your team's choices",
            description: "Decisions are auto-logged when you approve, reject, or freeze ideas. Start by reviewing some ideas!",
            action: "Go to Ideas",
            tips: [
                "✅ Decisions are auto-logged on actions",
                "📝 Add context to remember why",
                "🔍 Search past decisions anytime"
            ],
            gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%)'
        },
        dashboard: {
            icon: Sparkles,
            title: "Welcome to Cryo! ❄️",
            subtitle: "Let's get started",
            description: "Your dashboard will come alive once you add some ideas. Start by capturing your first brilliant thought!",
            action: "Add Your First Idea",
            tips: [
                "1️⃣ Add ideas you want to revisit later",
                "2️⃣ Set conditions for when to wake them",
                "3️⃣ AI will help find the perfect timing"
            ],
            gradient: 'linear-gradient(135deg, rgba(34, 211, 238, 0.15) 0%, rgba(14, 165, 233, 0.08) 100%)'
        },
        generic: {
            icon: PropIcon || Lightbulb,
            title: propTitle || "Nothing here yet",
            subtitle: "",
            description: propDescription || "No items found.",
            action: propActionLabel || "Add Item",
            tips: [],
            gradient: 'var(--bg-tertiary)'
        }
    };

    const config = configs[type] || configs.generic;
    const Icon = config.icon;

    const handleAction = () => {
        if (onAction) {
            onAction();
        } else if (actionPath) {
            navigate(actionPath);
        } else if (type === 'ideas' || type === 'dashboard' || type === 'frozen') {
            navigate('/ideas?new=true');
        } else if (type === 'decisions') {
            navigate('/ideas');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center max-w-lg mx-auto">
            {/* Icon with gradient background */}
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-8 relative"
                style={{ background: config.gradient, border: '1px solid var(--border)' }}>
                <Icon className="w-12 h-12" style={{ color: 'var(--accent)' }} />
                <div className="absolute inset-0 rounded-3xl animate-pulse opacity-50"
                    style={{ background: 'radial-gradient(circle at center, rgba(34, 211, 238, 0.3) 0%, transparent 70%)' }} />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {config.title}
            </h2>
            {config.subtitle && (
                <p className="text-sm font-medium mb-3" style={{ color: 'var(--accent)' }}>
                    {config.subtitle}
                </p>
            )}
            <p className="text-sm mb-8 leading-relaxed max-w-sm" style={{ color: 'var(--text-muted)' }}>
                {config.description}
            </p>

            {/* Tips */}
            {config.tips.length > 0 && (
                <div className="w-full space-y-3 mb-8">
                    {config.tips.map((tip, i) => (
                        <div key={i}
                            className="flex items-center gap-3 text-left px-5 py-4 rounded-xl transition-all hover:scale-[1.02]"
                            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{tip}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Action Button */}
            <button onClick={handleAction}
                className="flex items-center gap-3 px-8 py-4 rounded-xl text-base font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20"
                style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>
                <Plus className="w-5 h-5" />
                {config.action}
                <ArrowRight className="w-5 h-5" />
            </button>

            {/* Decorative elements */}
            <div className="mt-8 flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <Sparkles className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                <span>Powered by AI Smart Wake technology</span>
            </div>
        </div>
    );
};

export default EmptyState;
