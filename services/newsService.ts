// News API Service for Market Pulse
// Uses free news sources for competitor and market monitoring

export interface NewsItem {
    id: string;
    title: string;
    description: string;
    source: string;
    url: string;
    publishedAt: string;
    category: 'competitor' | 'market' | 'trend' | 'funding';
    severity: 'high' | 'medium' | 'low';
    keywords: string[];
}

// Mock news data for demo (in production, use NewsAPI.org or similar)
const MOCK_NEWS: NewsItem[] = [
    {
        id: '1',
        title: 'Competitor X launches AI feature',
        description: 'Major competitor announces new AI-powered analytics feature, potentially disrupting the market.',
        source: 'TechCrunch',
        url: '#',
        publishedAt: new Date().toISOString(),
        category: 'competitor',
        severity: 'high',
        keywords: ['AI', 'analytics', 'competitor']
    },
    {
        id: '2',
        title: 'Series A funding surge in PM tools',
        description: 'Product management tools see 40% increase in funding this quarter.',
        source: 'Crunchbase',
        url: '#',
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        category: 'funding',
        severity: 'medium',
        keywords: ['funding', 'product management', 'startup']
    },
    {
        id: '3',
        title: 'Remote work drives collaboration tool adoption',
        description: 'Enterprise adoption of collaboration tools up 60% year over year.',
        source: 'Forbes',
        url: '#',
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        category: 'trend',
        severity: 'low',
        keywords: ['remote work', 'collaboration', 'enterprise']
    },
    {
        id: '4',
        title: 'Linear raises $35M Series B',
        description: 'Issue tracking startup Linear raises Series B to expand AI capabilities.',
        source: 'TechCrunch',
        url: '#',
        publishedAt: new Date(Date.now() - 259200000).toISOString(),
        category: 'competitor',
        severity: 'medium',
        keywords: ['Linear', 'funding', 'issue tracking']
    },
];

// Keywords to watch for each category
const COMPETITOR_KEYWORDS = ['linear', 'notion', 'jira', 'asana', 'monday', 'productboard', 'aha'];
const MARKET_KEYWORDS = ['startup', 'funding', 'series a', 'series b', 'acquisition'];
const TREND_KEYWORDS = ['ai', 'machine learning', 'remote work', 'collaboration', 'productivity'];

export const newsService = {
    // Fetch latest news (mock implementation)
    async fetchNews(): Promise<NewsItem[]> {
        // In production, replace with actual API call:
        // const response = await fetch(`https://newsapi.org/v2/everything?q=startup+tools&apiKey=${API_KEY}`);
        return new Promise(resolve => {
            setTimeout(() => resolve(MOCK_NEWS), 500);
        });
    },

    // Match news with frozen ideas based on keywords
    matchNewsWithIdeas(news: NewsItem[], frozenIdeas: { id: string; title: string; description: string }[]): {
        newsItem: NewsItem;
        matchedIdeas: { id: string; title: string; relevance: number }[];
    }[] {
        const matches: {
            newsItem: NewsItem;
            matchedIdeas: { id: string; title: string; relevance: number }[];
        }[] = [];

        for (const item of news) {
            const matchedIdeas: { id: string; title: string; relevance: number }[] = [];

            for (const idea of frozenIdeas) {
                const ideaText = `${idea.title} ${idea.description}`.toLowerCase();
                let relevance = 0;

                for (const keyword of item.keywords) {
                    if (ideaText.includes(keyword.toLowerCase())) {
                        relevance += 1;
                    }
                }

                // Check if news title/description overlaps with idea
                const newsText = `${item.title} ${item.description}`.toLowerCase();
                const ideaWords = idea.title.toLowerCase().split(' ').filter(w => w.length > 3);
                for (const word of ideaWords) {
                    if (newsText.includes(word)) {
                        relevance += 0.5;
                    }
                }

                if (relevance > 0.5) {
                    matchedIdeas.push({ id: idea.id, title: idea.title, relevance });
                }
            }

            if (matchedIdeas.length > 0) {
                matches.push({ newsItem: item, matchedIdeas: matchedIdeas.sort((a, b) => b.relevance - a.relevance) });
            }
        }

        return matches;
    },

    // Get severity color
    getSeverityColor(severity: 'high' | 'medium' | 'low'): string {
        switch (severity) {
            case 'high': return '#ef4444';
            case 'medium': return '#f59e0b';
            case 'low': return '#22d3ee';
        }
    },

    // Get category label
    getCategoryLabel(category: NewsItem['category']): string {
        switch (category) {
            case 'competitor': return '🏢 Competitor';
            case 'market': return '📈 Market';
            case 'trend': return '🔥 Trend';
            case 'funding': return '💰 Funding';
        }
    }
};
