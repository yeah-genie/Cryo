import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ArrowRight, Snowflake, Zap, XCircle, GitMerge, Clock } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { DecisionOutcome, DecisionType } from '../types';

const Decisions: React.FC = () => {
    const { decisions, ideas, getUserName } = useAppContext();
    const navigate = useNavigate();

    // Sort by date descending
    const sortedDecisions = [...decisions].sort(
        (a, b) => new Date(b.decided_at).getTime() - new Date(a.decided_at).getTime()
    );

    const getDecisionIcon = (type: DecisionType) => {
        switch (type) {
            case DecisionType.Freeze: return <Snowflake className="w-4 h-4" style={{ color: '#0ea5e9' }} />;
            case DecisionType.Wake: return <Zap className="w-4 h-4" style={{ color: '#22c55e' }} />;
            case DecisionType.Kill: return <XCircle className="w-4 h-4" style={{ color: '#ef4444' }} />;
            case DecisionType.Merge: return <GitMerge className="w-4 h-4" style={{ color: '#a855f7' }} />;
            default: return <Clock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />;
        }
    };

    const getOutcomeColor = (outcome: DecisionOutcome) => {
        switch (outcome) {
            case DecisionOutcome.Positive: return '#22c55e';
            case DecisionOutcome.Negative: return '#ef4444';
            case DecisionOutcome.Neutral: return '#f59e0b';
            default: return 'var(--text-muted)';
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getRelatedIdea = (ideaId: string) => ideas.find(i => i.idea_id === ideaId);

    return (
        <div className="h-full flex flex-col gap-6 overflow-auto">
            {/* Header */}
            <PageHeader
                icon={ClipboardList}
                title="Decision History"
                description="Track why decisions were made and their outcomes"
            />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Decisions', value: decisions.length, color: 'var(--accent)' },
                    { label: 'Frozen', value: decisions.filter(d => d.type === DecisionType.Freeze).length, color: '#0ea5e9' },
                    { label: 'Woken', value: decisions.filter(d => d.type === DecisionType.Wake).length, color: '#22c55e' },
                    { label: 'Killed', value: decisions.filter(d => d.type === DecisionType.Kill).length, color: '#ef4444' },
                ].map(stat => (
                    <div key={stat.label} className="glass rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                        <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Timeline */}
            <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                    Timeline
                </h2>

                {sortedDecisions.length === 0 ? (
                    <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
                        <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>No decisions recorded yet</p>
                        <p className="text-sm mt-1">Freeze, wake, or kill an idea to create a decision record</p>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ background: 'var(--border)' }} />

                        <div className="space-y-6">
                            {sortedDecisions.map((decision, index) => {
                                const relatedIdea = getRelatedIdea(decision.idea_id);
                                return (
                                    <div key={decision.decision_id} className="relative pl-10">
                                        {/* Timeline dot */}
                                        <div className="absolute left-2 top-2 w-5 h-5 rounded-full flex items-center justify-center"
                                            style={{ background: 'var(--bg-secondary)', border: '2px solid var(--border)' }}>
                                            {getDecisionIcon(decision.type)}
                                        </div>

                                        <div className="glass rounded-xl p-4 hover:bg-white/5 transition-all cursor-pointer"
                                            onClick={() => relatedIdea && navigate(`/ideas/${relatedIdea.idea_id}`)}>
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                                                            style={{
                                                                background: `${getOutcomeColor(decision.outcome)}20`,
                                                                color: getOutcomeColor(decision.outcome)
                                                            }}>
                                                            {decision.type}
                                                        </span>
                                                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                                            {formatDate(decision.decided_at)}
                                                        </span>
                                                    </div>

                                                    <h3 className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                                                        {decision.title || relatedIdea?.title || 'Untitled Decision'}
                                                    </h3>

                                                    {decision.content && (
                                                        <p className="text-sm mt-1 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                                                            {decision.content}
                                                        </p>
                                                    )}

                                                    <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                                                        <span>by {getUserName(decision.decided_by_user_id)}</span>
                                                        {relatedIdea && (
                                                            <>
                                                                <span>•</span>
                                                                <span className="flex items-center gap-1">
                                                                    <ArrowRight className="w-3 h-3" />
                                                                    {relatedIdea.title}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {decision.outcome && (
                                                    <div className="flex-shrink-0">
                                                        <span className="text-xs px-2 py-1 rounded-full"
                                                            style={{
                                                                background: `${getOutcomeColor(decision.outcome)}15`,
                                                                color: getOutcomeColor(decision.outcome)
                                                            }}>
                                                            {decision.outcome}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Decisions;
