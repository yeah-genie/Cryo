// Gemini AI Service for Smart Wake recommendations
import { Idea, Metric } from '../types';

const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface SmartWakeAnalysis {
    ideaId: string;
    score: number; // 0-100
    reason: string;
    suggestedAction: string;
}

interface AIAnalysisResult {
    recommendations: SmartWakeAnalysis[];
    synthesis: string | null;
}

// Analyze frozen ideas and recommend which ones to wake
export async function analyzeSmartWake(
    frozenIdeas: Idea[],
    metrics: Metric[]
): Promise<SmartWakeAnalysis[]> {
    if (!GEMINI_API_KEY) {
        console.warn('Gemini API key not configured, using fallback logic');
        return fallbackAnalysis(frozenIdeas, metrics);
    }

    if (frozenIdeas.length === 0) {
        return [];
    }

    const prompt = buildSmartWakePrompt(frozenIdeas, metrics);

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            console.error('Gemini API error:', response.status);
            return fallbackAnalysis(frozenIdeas, metrics);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            return fallbackAnalysis(frozenIdeas, metrics);
        }

        return parseSmartWakeResponse(text, frozenIdeas);
    } catch (error) {
        console.error('Gemini API call failed:', error);
        return fallbackAnalysis(frozenIdeas, metrics);
    }
}

// Synthesize similar ideas using AI
export async function synthesizeIdeasWithAI(ideas: Idea[]): Promise<string | null> {
    if (!GEMINI_API_KEY || ideas.length < 2) {
        return null;
    }

    const prompt = `Analyze these product ideas and suggest how they could be merged into a more powerful concept:

${ideas.map((idea, i) => `${i + 1}. "${idea.title}": ${idea.description}`).join('\n')}

Respond with:
1. A suggested merged idea title
2. Why combining them makes sense
3. What the combined idea would achieve

Keep response under 150 words.`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.8, maxOutputTokens: 512 }
            })
        });

        if (!response.ok) return null;

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch {
        return null;
    }
}

function buildSmartWakePrompt(frozenIdeas: Idea[], metrics: Metric[]): string {
    const metricsContext = metrics.length > 0
        ? `Current metrics:\n${metrics.map(m => `- ${m.name}: ${m.current_value}/${m.target_value} ${m.unit} (${m.trend})`).join('\n')}`
        : 'No metrics data available.';

    const ideasList = frozenIdeas.map((idea, i) =>
        `${i + 1}. ID: ${idea.idea_id}
   Title: "${idea.title}"
   Description: ${idea.description}
   Frozen reason: ${idea.zombie_reason || 'Not specified'}
   Trigger type: ${idea.trigger_type || 'None'}
   Trigger metric: ${idea.trigger_metric || 'None'}
   Votes: ${idea.votes || 0}
   Created: ${idea.created_at}`
    ).join('\n\n');

    return `You are an AI product advisor for a startup idea management tool called Cryo.

${metricsContext}

Here are the currently frozen (paused) ideas:

${ideasList}

Analyze which ideas should be "woken up" (reactivated) based on:
1. Current metric performance - ideas linked to improving metrics
2. Time passed since freezing - older ideas may be ripe for review
3. Vote count - team interest indicator
4. Trigger conditions - if any triggers seem met

Return a JSON array with the top 3 recommendations:
[
  {
    "ideaId": "uuid-here",
    "score": 85,
    "reason": "Brief explanation why this should wake now",
    "suggestedAction": "What to do first"
  }
]

Only return the JSON array, no other text.`;
}

function parseSmartWakeResponse(text: string, frozenIdeas: Idea[]): SmartWakeAnalysis[] {
    try {
        // Extract JSON from response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) return fallbackAnalysis(frozenIdeas, []);

        const parsed = JSON.parse(jsonMatch[0]) as SmartWakeAnalysis[];

        // Validate and filter to only existing ideas
        const validIds = new Set(frozenIdeas.map(i => i.idea_id));
        return parsed.filter(rec => validIds.has(rec.ideaId)).slice(0, 3);
    } catch {
        return fallbackAnalysis(frozenIdeas, []);
    }
}

function fallbackAnalysis(frozenIdeas: Idea[], metrics: Metric[]): SmartWakeAnalysis[] {
    // Smart fallback: prioritize by votes, trigger conditions, and age
    const now = Date.now();

    const scored = frozenIdeas.map(idea => {
        let score = 0;

        // Vote score (max 30 points)
        score += Math.min((idea.votes || 0) * 10, 30);

        // Age score - older ideas get priority (max 20 points)
        const ageInDays = (now - new Date(idea.created_at).getTime()) / (1000 * 60 * 60 * 24);
        score += Math.min(ageInDays * 2, 20);

        // Trigger match score (max 30 points)
        if (idea.trigger_metric && metrics.length > 0) {
            const matchedMetric = metrics.find(m =>
                m.name.toLowerCase().includes(idea.trigger_metric!.toLowerCase()) ||
                idea.trigger_metric!.toLowerCase().includes(m.name.toLowerCase())
            );
            if (matchedMetric && matchedMetric.current_value >= matchedMetric.target_value * 0.8) {
                score += 30;
            }
        }

        // High priority bonus (max 20 points)
        if (idea.priority === 'High') score += 20;
        else if (idea.priority === 'Medium') score += 10;

        return {
            ideaId: idea.idea_id,
            score: Math.min(score, 100),
            reason: generateFallbackReason(idea, score),
            suggestedAction: 'Review and decide whether to activate'
        };
    });

    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
}

function generateFallbackReason(idea: Idea, score: number): string {
    const reasons: string[] = [];

    if ((idea.votes || 0) >= 3) reasons.push('High team interest');
    if (idea.priority === 'High') reasons.push('High priority');
    if (idea.trigger_metric) reasons.push(`Linked to ${idea.trigger_metric} metric`);

    const ageInDays = (Date.now() - new Date(idea.created_at).getTime()) / (1000 * 60 * 60 * 24);
    if (ageInDays > 30) reasons.push('Been frozen for over a month');

    return reasons.length > 0 ? reasons.join(', ') : 'Regular review recommended';
}

export const geminiService = {
    analyzeSmartWake,
    synthesizeIdeasWithAI
};
