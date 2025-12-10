/**
 * Slack Integration Service
 * - Slash commands: /freeze, /wake, /list
 * - Channel monitoring: #ideas 채널 메시지 모니터링
 */

// Environment variables
const SLACK_BOT_TOKEN = import.meta.env.VITE_SLACK_BOT_TOKEN;
const SLACK_SIGNING_SECRET = import.meta.env.VITE_SLACK_SIGNING_SECRET;

export interface SlackMessage {
    channel: string;
    user: string;
    text: string;
    ts: string;
    thread_ts?: string;
}

export interface SlackCommand {
    command: string;
    text: string;
    user_id: string;
    user_name: string;
    channel_id: string;
    response_url: string;
}

/**
 * Parse a Slack message to extract idea-related keywords
 */
export function parseMessageForIdeas(text: string): { isIdea: boolean; title?: string; keywords: string[] } {
    // Keywords that suggest an idea
    const ideaKeywords = [
        'we should', 'we could', 'idea:', 'what if', 'how about',
        'let\'s try', 'maybe we', 'suggestion:', 'feature request',
        'it would be nice', 'wouldn\'t it be', '아이디어', '제안', '해보면'
    ];

    const lowerText = text.toLowerCase();
    const isIdea = ideaKeywords.some(kw => lowerText.includes(kw));

    // Extract potential title (first sentence or up to 100 chars)
    const title = isIdea ? text.split(/[.!?\n]/)[0].slice(0, 100).trim() : undefined;

    // Extract keywords
    const keywords = text.match(/\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)*\b/g) || [];

    return { isIdea, title, keywords };
}

/**
 * Handle slash command from Slack
 */
export async function handleSlackCommand(command: SlackCommand): Promise<{ text: string; response_type?: 'in_channel' | 'ephemeral' }> {
    const { command: cmd, text, user_name } = command;

    switch (cmd) {
        case '/freeze':
            if (!text.trim()) {
                return { text: '❌ Please provide an idea to freeze. Usage: `/freeze Your idea title here`', response_type: 'ephemeral' };
            }
            // This would call your API to create a frozen idea
            return {
                text: `❄️ Idea frozen by @${user_name}: "${text.slice(0, 100)}"`,
                response_type: 'in_channel'
            };

        case '/wake':
            if (!text.trim()) {
                return { text: '❌ Please provide an idea ID. Usage: `/wake idea-id`', response_type: 'ephemeral' };
            }
            return {
                text: `⚡ @${user_name} requested to wake idea: "${text}"`,
                response_type: 'in_channel'
            };

        case '/cryo':
        case '/list':
            return {
                text: `📋 Your frozen ideas:\n1. Feature X (30 days)\n2. Feature Y (15 days)\n\nVisit Cryo for full details.`,
                response_type: 'ephemeral'
            };

        default:
            return { text: '❓ Unknown command', response_type: 'ephemeral' };
    }
}

/**
 * Monitor channel for idea-like messages
 */
export async function processChannelMessage(message: SlackMessage): Promise<{
    shouldCapture: boolean;
    idea?: { title: string; content: string; source: string };
}> {
    const analysis = parseMessageForIdeas(message.text);

    if (!analysis.isIdea) {
        return { shouldCapture: false };
    }

    return {
        shouldCapture: true,
        idea: {
            title: analysis.title || message.text.slice(0, 100),
            content: message.text,
            source: `slack:${message.channel}`
        }
    };
}

/**
 * Send a message to Slack channel
 */
export async function sendSlackMessage(channel: string, text: string, thread_ts?: string): Promise<boolean> {
    if (!SLACK_BOT_TOKEN) {
        console.warn('Slack bot token not configured');
        return false;
    }

    try {
        const response = await fetch('https://slack.com/api/chat.postMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SLACK_BOT_TOKEN}`
            },
            body: JSON.stringify({
                channel,
                text,
                thread_ts
            })
        });

        const data = await response.json();
        return data.ok;
    } catch (error) {
        console.error('Failed to send Slack message:', error);
        return false;
    }
}

/**
 * Get Slack OAuth URL for app installation
 */
export function getSlackOAuthUrl(): string {
    const clientId = import.meta.env.VITE_SLACK_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/slack/callback`;
    const scopes = ['commands', 'chat:write', 'channels:read', 'channels:history'].join(',');

    return `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}`;
}

/**
 * Slack App Manifest (for reference when creating the app)
 */
export const SLACK_APP_MANIFEST = {
    display_information: {
        name: "Cryo",
        description: "Freeze your backlog ideas, wake them at the right time",
        background_color: "#0ea5e9"
    },
    features: {
        slash_commands: [
            { command: "/freeze", description: "Freeze an idea for later", usage_hint: "Your idea title here" },
            { command: "/wake", description: "Request to wake a frozen idea", usage_hint: "idea-id" },
            { command: "/cryo", description: "List your frozen ideas" }
        ],
        bot_user: {
            display_name: "Cryo Bot",
            always_online: true
        }
    },
    oauth_config: {
        scopes: {
            bot: ["commands", "chat:write", "channels:read", "channels:history"]
        }
    }
};
