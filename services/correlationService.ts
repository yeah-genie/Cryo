// Decision-Data Correlation Service
// Analyzes relationships between decisions and metrics

import { Idea, Metric, Decision } from '../types';

export interface CorrelationResult {
    ideaId: string;
    ideaTitle: string;
    linkedMetrics: {
        metricId: string;
        metricName: string;
        changeBeforeDecision: number;
        changeAfterDecision: number;
        correlation: 'positive' | 'negative' | 'neutral';
        confidenceScore: number;
    }[];
    summary: string;
}

export interface ImpactReport {
    period: string;
    decisionsCount: number;
    topImpactfulDecisions: {
        ideaTitle: string;
        decisionDate: string;
        impact: 'high' | 'medium' | 'low';
        metricChanges: { name: string; change: string }[];
    }[];
    insights: string[];
}

export const correlationService = {
    // Analyze correlation between a decision and metrics
    analyzeCorrelation(
        idea: Idea,
        decisions: Decision[],
        metrics: Metric[],
        linkedMetricIds: string[]
    ): CorrelationResult {
        const linkedMetrics = metrics.filter(m => linkedMetricIds.includes(m.metric_id));

        const correlations = linkedMetrics.map(metric => {
            // Mock correlation analysis (in production, use actual historical data)
            const changeBeforeDecision = Math.random() * 20 - 10; // -10% to +10%
            const changeAfterDecision = Math.random() * 30 - 5;  // -5% to +25%

            const diff = changeAfterDecision - changeBeforeDecision;
            const correlation = diff > 5 ? 'positive' : diff < -5 ? 'negative' : 'neutral';
            const confidenceScore = Math.min(0.95, 0.5 + Math.abs(diff) / 30);

            return {
                metricId: metric.metric_id,
                metricName: metric.name,
                changeBeforeDecision: Math.round(changeBeforeDecision * 10) / 10,
                changeAfterDecision: Math.round(changeAfterDecision * 10) / 10,
                correlation: correlation as 'positive' | 'negative' | 'neutral',
                confidenceScore: Math.round(confidenceScore * 100) / 100
            };
        });

        const positiveCount = correlations.filter(c => c.correlation === 'positive').length;
        const summary = positiveCount > correlations.length / 2
            ? `This decision appears to have had a positive impact on ${positiveCount} of ${correlations.length} linked metrics.`
            : correlations.length === 0
                ? 'No metrics linked. Add metrics to track impact.'
                : `Mixed results observed across ${correlations.length} linked metrics.`;

        return {
            ideaId: idea.idea_id,
            ideaTitle: idea.title,
            linkedMetrics: correlations,
            summary
        };
    },

    // Generate impact report for a time period
    generateImpactReport(
        ideas: Idea[],
        decisions: Decision[],
        metrics: Metric[],
        period: 'week' | 'month' | 'quarter'
    ): ImpactReport {
        const periodDays = period === 'week' ? 7 : period === 'month' ? 30 : 90;
        const cutoffDate = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);

        const recentDecisions = decisions.filter(d => new Date(d.decided_at) >= cutoffDate);

        // Mock impact analysis
        const topDecisions = recentDecisions.slice(0, 3).map(d => {
            const idea = ideas.find(i => i.idea_id === d.idea_id);
            return {
                ideaTitle: idea?.title || 'Unknown',
                decisionDate: new Date(d.decided_at).toLocaleDateString(),
                impact: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
                metricChanges: metrics.slice(0, 2).map(m => ({
                    name: m.name,
                    change: `${Math.random() > 0.5 ? '+' : '-'}${Math.round(Math.random() * 15)}%`
                }))
            };
        });

        const insights = [
            `${recentDecisions.length} decisions made in the last ${period}`,
            `Average decision-to-impact time: ${Math.round(Math.random() * 14 + 7)} days`,
            topDecisions.length > 0 && topDecisions[0].impact === 'high'
                ? '🔥 Recent high-impact decision detected'
                : '📊 Steady progress across all metrics'
        ];

        return {
            period,
            decisionsCount: recentDecisions.length,
            topImpactfulDecisions: topDecisions,
            insights: insights.filter(Boolean) as string[]
        };
    },

    // Get correlation color
    getCorrelationColor(correlation: 'positive' | 'negative' | 'neutral'): string {
        switch (correlation) {
            case 'positive': return '#10b981';
            case 'negative': return '#ef4444';
            case 'neutral': return '#6b7280';
        }
    }
};
