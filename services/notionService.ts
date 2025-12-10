// Notion OAuth & API Service for idea discovery
import { Idea, IdeaStatus, Priority } from '../types';

// Notion OAuth Configuration
// User needs to create a Notion Integration at https://www.notion.so/my-integrations
const NOTION_CLIENT_ID = import.meta.env.VITE_NOTION_CLIENT_ID || '';
const NOTION_CLIENT_SECRET = import.meta.env.VITE_NOTION_CLIENT_SECRET || '';
const NOTION_REDIRECT_URI = import.meta.env.VITE_NOTION_REDIRECT_URI || `${window.location.origin}/auth/notion/callback`;

// Gemini for idea classification
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export interface NotionPage {
    id: string;
    title: string;
    content: string;
    lastEdited: string;
    url: string;
    parentType: string;
    parentName: string;
}

export interface DiscoveredIdea {
    id: string;
    title: string;
    content: string;
    source: string;
    sourceUrl: string;
    lastEdited: string;
    dormantDays: number;
    confidence: number; // AI confidence that this is an "idea"
}

export interface ScanResult {
    totalPages: number;
    analyzedPages: number;
    discoveredIdeas: DiscoveredIdea[];
    averageDormantDays: number;
    oldestIdea: DiscoveredIdea | null;
}

// Generate OAuth URL for Notion
export function getNotionOAuthUrl(): string {
    const params = new URLSearchParams({
        client_id: NOTION_CLIENT_ID,
        redirect_uri: NOTION_REDIRECT_URI,
        response_type: 'code',
        owner: 'user',
    });
    return `https://api.notion.com/v1/oauth/authorize?${params.toString()}`;
}

// Exchange auth code for access token
export async function exchangeNotionCode(code: string): Promise<string> {
    console.log('Exchanging code for token...');
    // Use Proxy path to avoid CORS
    const response = await fetch('/api/notion/oauth/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${btoa(`${NOTION_CLIENT_ID}:${NOTION_CLIENT_SECRET}`)}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            grant_type: 'authorization_code',
            code,
            redirect_uri: NOTION_REDIRECT_URI,
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        console.error('Token exchange failed:', response.status, text);
        throw new Error(`Failed to exchange Notion auth code: ${response.status} ${text}`);
    }

    const data = await response.json();
    console.log('Token exchange success. Workspace:', data.workspace_name);
    return data.access_token;
}

// Fetch all pages from Notion workspace
export async function fetchNotionPages(accessToken: string, onProgress?: (count: number) => void): Promise<NotionPage[]> {
    console.log('Fetching Notion pages...');
    const pages: NotionPage[] = [];
    let hasMore = true;
    let startCursor: string | undefined;

    while (hasMore) {
        console.log('Fetching page batch, cursor:', startCursor);
        // Use Proxy path to avoid CORS
        const response = await fetch('/api/notion/search', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filter: { property: 'object', value: 'page' },
                page_size: 100,
                start_cursor: startCursor,
            }),
        });

        if (!response.ok) {
            const text = await response.text();
            console.error('Fetch pages failed:', response.status, text);
            throw new Error(`Failed to fetch Notion pages: ${response.status} ${text}`);
        }

        const data = await response.json();
        console.log(`Fetched ${data.results.length} pages in this batch`);

        for (const page of data.results) {
            const title = extractPageTitle(page);
            const content = await fetchPageContent(accessToken, page.id);

            pages.push({
                id: page.id,
                title,
                content,
                lastEdited: page.last_edited_time,
                url: page.url,
                parentType: page.parent?.type || 'unknown',
                parentName: page.parent?.database_id ? 'Database' : 'Page',
            });

            onProgress?.(pages.length);
        }

        hasMore = data.has_more;
        startCursor = data.next_cursor;
    }

    console.log(`Total fetched pages: ${pages.length}`);
    return pages;
}

// Extract title from Notion page object
function extractPageTitle(page: any): string {
    if (page.properties?.title?.title?.[0]?.plain_text) {
        return page.properties.title.title[0].plain_text;
    }
    if (page.properties?.Name?.title?.[0]?.plain_text) {
        return page.properties.Name.title[0].plain_text;
    }
    // Try other common title properties
    for (const key of Object.keys(page.properties || {})) {
        const prop = page.properties[key];
        if (prop.type === 'title' && prop.title?.[0]?.plain_text) {
            return prop.title[0].plain_text;
        }
    }
    return 'Untitled';
}

// Fetch page content (blocks)
async function fetchPageContent(accessToken: string, pageId: string): Promise<string> {
    try {
        // Use Proxy path to avoid CORS
        const response = await fetch(`/api/notion/blocks/${pageId}/children?page_size=50`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Notion-Version': '2022-06-28',
            },
        });

        if (!response.ok) return '';

        const data = await response.json();
        return data.results
            .map((block: any) => extractBlockText(block))
            .filter(Boolean)
            .join('\n');
    } catch {
        return '';
    }
}

// Extract text from a Notion block
function extractBlockText(block: any): string {
    const type = block.type;
    const content = block[type];

    if (content?.rich_text) {
        return content.rich_text.map((t: any) => t.plain_text).join('');
    }
    if (content?.text) {
        return content.text.map((t: any) => t.plain_text).join('');
    }
    return '';
}

// Use Gemini to classify which pages contain "ideas"
export async function classifyIdeas(
    pages: NotionPage[],
    onProgress?: (analyzed: number, found: number) => void
): Promise<DiscoveredIdea[]> {
    const ideas: DiscoveredIdea[] = [];

    // Process in batches of 5 for efficiency
    const batchSize = 5;
    for (let i = 0; i < pages.length; i += batchSize) {
        const batch = pages.slice(i, i + batchSize);

        const prompt = `You are analyzing Notion pages to find "dormant ideas" - concepts, features, projects, or plans that were written but never executed.

For each page below, determine if it contains an "idea" that could be revisited later. An idea is:
- A feature proposal or product concept
- A project plan or initiative
- A business strategy or pivot consideration
- A technical solution or architecture
- A marketing campaign or growth idea

NOT ideas (ignore these):
- Meeting notes
- Documentation
- Personal journals
- Task lists
- Reference materials

Pages to analyze:
${batch.map((p, idx) => `
[${idx}] Title: "${p.title}"
Content preview: "${p.content.slice(0, 500)}..."
Last edited: ${p.lastEdited}
`).join('\n')}

Respond in JSON format only:
{
  "results": [
    { "index": 0, "isIdea": true/false, "confidence": 0.0-1.0, "summary": "brief summary if isIdea" },
    ...
  ]
}`;

        try {
            if (!GEMINI_API_KEY) {
                // Fallback: simple heuristic classification
                for (const page of batch) {
                    const isIdea = simpleIdeaClassification(page);
                    if (isIdea) {
                        ideas.push(pageToIdea(page, 0.7));
                    }
                }
            } else {
                const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            temperature: 0.3,
                            maxOutputTokens: 1024,
                        },
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                    const jsonMatch = text.match(/\{[\s\S]*\}/);

                    if (jsonMatch) {
                        const parsed = JSON.parse(jsonMatch[0]);
                        for (const result of parsed.results || []) {
                            if (result.isIdea && result.confidence > 0.6) {
                                const page = batch[result.index];
                                if (page) {
                                    ideas.push(pageToIdea(page, result.confidence));
                                }
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.warn('AI classification failed, using fallback:', error);
            for (const page of batch) {
                const isIdea = simpleIdeaClassification(page);
                if (isIdea) {
                    ideas.push(pageToIdea(page, 0.6));
                }
            }
        }

        onProgress?.(i + batch.length, ideas.length);

        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 200));
    }

    return ideas;
}

// Simple heuristic classification when AI is not available
function simpleIdeaClassification(page: NotionPage): boolean {
    const text = `${page.title} ${page.content}`.toLowerCase();

    // Positive signals
    const ideaKeywords = [
        'idea', 'concept', 'proposal', 'feature', 'project',
        'plan', 'strategy', 'initiative', 'build', 'create',
        'launch', 'implement', 'develop', 'pivot', 'experiment',
        '아이디어', '제안', '기획', '프로젝트', '전략', '계획'
    ];

    // Negative signals
    const notIdeaKeywords = [
        'meeting notes', 'minutes', 'agenda', 'documentation',
        'reference', 'how to', 'guide', '회의록', '미팅'
    ];

    const hasPositive = ideaKeywords.some(k => text.includes(k));
    const hasNegative = notIdeaKeywords.some(k => text.includes(k));

    // Must be dormant (older than 30 days)
    const daysSinceEdit = Math.floor((Date.now() - new Date(page.lastEdited).getTime()) / (1000 * 60 * 60 * 24));
    const isDormant = daysSinceEdit > 30;

    return hasPositive && !hasNegative && isDormant;
}

// Convert NotionPage to DiscoveredIdea
function pageToIdea(page: NotionPage, confidence: number): DiscoveredIdea {
    const dormantDays = Math.floor(
        (Date.now() - new Date(page.lastEdited).getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
        id: page.id,
        title: page.title,
        content: page.content.slice(0, 500),
        source: `Notion: ${page.parentName}`,
        sourceUrl: page.url,
        lastEdited: page.lastEdited,
        dormantDays,
        confidence,
    };
}

// Main function: Scan Notion and discover ideas
export async function scanNotionForIdeas(
    accessToken: string,
    onProgress?: (stage: string, current: number, total: number) => void
): Promise<ScanResult> {
    // Stage 1: Fetch pages
    onProgress?.('fetching', 0, 100);
    const pages = await fetchNotionPages(accessToken, (count) => {
        onProgress?.('fetching', count, count + 10);
    });

    // Stage 2: Classify ideas
    onProgress?.('analyzing', 0, pages.length);
    const ideas = await classifyIdeas(pages, (analyzed, found) => {
        onProgress?.('analyzing', analyzed, pages.length);
    });

    // Sort by dormant days (oldest first)
    ideas.sort((a, b) => b.dormantDays - a.dormantDays);

    const avgDormant = ideas.length > 0
        ? Math.round(ideas.reduce((sum, i) => sum + i.dormantDays, 0) / ideas.length)
        : 0;

    return {
        totalPages: pages.length,
        analyzedPages: pages.length,
        discoveredIdeas: ideas,
        averageDormantDays: avgDormant,
        oldestIdea: ideas[0] || null,
    };
}

// Convert DiscoveredIdea to Cryo Idea format
export function convertToIdeaFormat(discovered: DiscoveredIdea, workspaceId: string, _userId: string): Partial<Idea> {
    return {
        title: discovered.title,
        description: discovered.content,
        status: IdeaStatus.Active,
        priority: Priority.Medium,
        votes: 0,
        is_zombie: false,
        workspace_id: workspaceId,
    };
}

// Store Notion token in localStorage (for demo mode)
export function storeNotionToken(token: string): void {
    localStorage.setItem('notion_access_token', token);
}

export function getStoredNotionToken(): string | null {
    return localStorage.getItem('notion_access_token');
}

export function clearNotionToken(): void {
    localStorage.removeItem('notion_access_token');
}
