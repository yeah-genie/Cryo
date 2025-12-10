import React from 'react';
import { IdeaStatus, Priority, Category, MetricStatus, MetricTrend } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const StatusBadge: React.FC<{ status: IdeaStatus }> = ({ status }) => {
  const styles: Record<IdeaStatus, string> = {
    [IdeaStatus.Active]: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    [IdeaStatus.InProgress]: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    [IdeaStatus.Completed]: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    [IdeaStatus.Archived]: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
    [IdeaStatus.Killed]: 'bg-red-500/20 text-red-400 border-red-500/30',
    [IdeaStatus.Frozen]: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  };

  const icons: Partial<Record<IdeaStatus, string>> = {
    [IdeaStatus.Frozen]: '❄️',
    [IdeaStatus.Active]: '💡',
    [IdeaStatus.Completed]: '✅',
    [IdeaStatus.Killed]: '❌',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {icons[status] && <span className="mr-1">{icons[status]}</span>}
      {status}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const styles: Record<Priority, string> = {
    [Priority.High]: 'bg-red-500/20 text-red-400 border-red-500/30',
    [Priority.Medium]: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    [Priority.Low]: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${styles[priority]}`}>
      {priority}
    </span>
  );
};

export const CategoryBadge: React.FC<{ category: Category | string }> = ({ category }) => {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
      style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
      {category}
    </span>
  );
};

export const MetricStatusBadge: React.FC<{ status: MetricStatus }> = ({ status }) => {
  const icons: Record<MetricStatus, string> = {
    [MetricStatus.Achieved]: '🎯',
    [MetricStatus.OnTrack]: '📈',
    [MetricStatus.Behind]: '⚠️',
  };
  const styles: Record<MetricStatus, string> = {
    [MetricStatus.Achieved]: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    [MetricStatus.OnTrack]: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    [MetricStatus.Behind]: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      <span className="mr-1">{icons[status]}</span>
      {status}
    </span>
  );
};

export const TrendIcon: React.FC<{ trend: MetricTrend }> = ({ trend }) => {
  switch (trend) {
    case MetricTrend.Up: return <TrendingUp className="h-4 w-4 text-emerald-400" />;
    case MetricTrend.Down: return <TrendingDown className="h-4 w-4 text-red-400" />;
    default: return <Minus className="h-4 w-4 text-zinc-500" />;
  }
};