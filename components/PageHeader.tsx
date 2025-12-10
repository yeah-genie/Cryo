import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
    icon: LucideIcon;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ icon: Icon, title, description, action }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0 pb-4 mb-2"
            style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--bg-tertiary)' }}>
                    <Icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                    <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h1>
                    {description && (
                        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{description}</p>
                    )}
                </div>
            </div>
            {action && <div className="flex gap-2">{action}</div>}
        </div>
    );
};

export default PageHeader;
