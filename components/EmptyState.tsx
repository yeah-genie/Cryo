
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LucideIcon, Plus, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    actionPath?: string;
    onAction?: () => void;
    secondaryLabel?: string;
    secondaryPath?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon: Icon,
    title,
    description,
    actionLabel,
    actionPath,
    onAction,
    secondaryLabel,
    secondaryPath,
}) => {
    const navigate = useNavigate();

    const handleAction = () => {
        if (onAction) {
            onAction();
        } else if (actionPath) {
            navigate(actionPath);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            {/* Icon container */}
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: 'var(--accent-glow)' }}>
                <Icon className="w-10 h-10" style={{ color: 'var(--accent)' }} />
            </div>

            {/* Text */}
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {title}
            </h3>
            <p className="text-sm max-w-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                {description}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3">
                {actionLabel && (
                    <button onClick={handleAction}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
                        style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>
                        <Plus className="w-4 h-4" />
                        {actionLabel}
                    </button>
                )}
                {secondaryLabel && secondaryPath && (
                    <button onClick={() => navigate(secondaryPath)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                        style={{ color: 'var(--text-secondary)' }}>
                        {secondaryLabel}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default EmptyState;
