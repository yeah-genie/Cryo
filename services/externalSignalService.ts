/**
 * External Signal Service
 * - Google News RSS 모니터링
 * - Google Analytics 메트릭 트리거
 * - 아이디어 Wake 타이밍 추천
 */

import { Idea, Metric } from '../types';

export interface ExternalSignal {
    type: 'news' | 'metric' | 'competitor';
    source: string;
    title: string;
    summary: string;
    url?: string;
    relatedKeywords: string[];
    detectedAt: string;
    relevanceScore: number;
}

export interface WakeTriggerEvent {
    ideaId: string;
    ideaTitle: string;
    signal: ExternalSignal;
    reason: string;
    urgency: 'low' | 'medium' | 'high';
}

// Google News RSS Feed URLs
const NEWS_RSS_FEEDS = {
    tech: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
    startup: 'https://news.google.com/rss/search?q=startup&hl=en-US&gl=US&ceid=US:en',
    ai: 'https://news.google.com/rss/search?q=artificial+intelligence&hl=en-US&gl=US&ceid=US:en',
};

/**
 * Parse RSS feed and extract news items
 */
async function parseRSSFeed(feedUrl: string): Promise<Array<{ title: string; link: string; pubDate: string }>> {
    try {
        // Use a CORS proxy or backend for production
        const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();

        if (data.status === 'ok') {
            return data.items.map((item: any) => ({
                title: item.title,
                link: item.link,
                pubDate: item.pubDate
            }));
        }
        return [];
    } catch (error) {
        console.error('Failed to parse RSS feed:', error);
        return [];
    }
}

/**
 * Check if news title matches idea keywords
 */
function matchNewsToIdea(newsTitle: string, idea: Idea): number {
    const titleWords = newsTitle.toLowerCase().split(/\s+/);
    const ideaWords = [
        ...idea.title.toLowerCase().split(/\s+/),
        ...idea.description.toLowerCase().split(/\s+/)
    ];

    // Count matching keywords
    const matches = titleWords.filter(word =>
        word.length > 3 && ideaWords.some(iw => iw.includes(word) || word.includes(iw))
    ).length;

    // Calculate relevance score (0-100)
    return Math.min(100, (matches / Math.min(titleWords.length, 5)) * 100);
}

/**
 * Scan Google News for relevant signals
 */
export async function scanGoogleNews(ideas: Idea[]): Promise<ExternalSignal[]> {
    const signals: ExternalSignal[] = [];
    const frozenIdeas = ideas.filter(i => i.is_zombie);

    if (frozenIdeas.length === 0) return signals;

    try {
        // Scan main tech news feed
        const newsItems = await parseRSSFeed(NEWS_RSS_FEEDS.tech);

        for (const news of newsItems.slice(0, 20)) {
            for (const idea of frozenIdeas) {
                const relevance = matchNewsToIdea(news.title, idea);

                if (relevance > 30) {
                    signals.push({
                        type: 'news',
                        source: 'Google News',
                        title: news.title,
                        summary: `This news may be relevant to your frozen idea "${idea.title}"`,
                        url: news.link,
                        relatedKeywords: idea.title.split(' ').slice(0, 3),
                        detectedAt: new Date().toISOString(),
                        relevanceScore: relevance
                    });
                }
            }
        }
    } catch (error) {
        console.error('News scan failed:', error);
    }

    return signals.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 5);
}

/**
 * Check Google Analytics metrics for triggers
 */
export async function checkGAMetrics(
    ideas: Idea[],
    metrics: Metric[]
): Promise<WakeTriggerEvent[]> {
    const triggers: WakeTriggerEvent[] = [];

    // Find ideas with metric triggers
    const metricTriggeredIdeas = ideas.filter(
        i => i.is_zombie && i.trigger_type === 'metric' && i.trigger_metric
    );

    for (const idea of metricTriggeredIdeas) {
        const linkedMetric = metrics.find(m =>
            m.name.toLowerCase().includes(idea.trigger_metric?.toLowerCase() || '')
        );

        if (linkedMetric) {
            // Check if metric has significantly changed
            const isTriggered = linkedMetric.current_value >= (linkedMetric.target_value || 0);

            if (isTriggered) {
                triggers.push({
                    ideaId: idea.idea_id,
                    ideaTitle: idea.title,
                    signal: {
                        type: 'metric',
                        source: 'Google Analytics',
                        title: `${linkedMetric.name} reached target`,
                        summary: `Current: ${linkedMetric.current_value}, Target: ${linkedMetric.target_value}`,
                        relatedKeywords: [linkedMetric.name],
                        detectedAt: new Date().toISOString(),
                        relevanceScore: 100
                    },
                    reason: `Your metric "${linkedMetric.name}" has reached the target value`,
                    urgency: 'high'
                });
            }
        }
    }

    return triggers;
}

/**
 * Main function to check all external signals
 */
export async function checkExternalSignals(
    ideas: Idea[],
    metrics: Metric[]
): Promise<{ newsSignals: ExternalSignal[]; metricTriggers: WakeTriggerEvent[] }> {
    const [newsSignals, metricTriggers] = await Promise.all([
        scanGoogleNews(ideas),
        checkGAMetrics(ideas, metrics)
    ]);

    return { newsSignals, metricTriggers };
}

/**
 * Build a summary of external signals for the dashboard
 */
export function summarizeSignals(signals: ExternalSignal[], triggers: WakeTriggerEvent[]): string {
    const parts: string[] = [];

    if (triggers.length > 0) {
        parts.push(`🎯 ${triggers.length} metric trigger(s) ready`);
    }

    if (signals.length > 0) {
        parts.push(`📰 ${signals.length} relevant news signal(s)`);
    }

    return parts.join(' • ') || 'No external signals detected';
}
