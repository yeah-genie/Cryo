
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationPayload {
    event: 'idea_created' | 'idea_updated' | 'idea_frozen' | 'idea_woken' | 'idea_killed';
    idea: {
        idea_id: string;
        title: string;
        description?: string;
        status?: string;
        priority?: string;
        category?: string;
    };
    user_name?: string;
    webhook_url: string;
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const payload: NotificationPayload = await req.json()
        const { event, idea, user_name, webhook_url } = payload;

        if (!webhook_url) {
            throw new Error("Missing webhook_url");
        }

        // Format message based on event type
        let emoji = '💡';
        let action = 'updated';
        let color = '#22d3ee'; // cyan

        switch (event) {
            case 'idea_created':
                emoji = '✨';
                action = 'created';
                color = '#22c55e'; // green
                break;
            case 'idea_frozen':
                emoji = '🧊';
                action = 'frozen';
                color = '#3b82f6'; // blue
                break;
            case 'idea_woken':
                emoji = '☀️';
                action = 'woken up';
                color = '#f59e0b'; // amber
                break;
            case 'idea_killed':
                emoji = '💀';
                action = 'killed';
                color = '#ef4444'; // red
                break;
        }

        // Slack Block Kit message
        const slackMessage = {
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `${emoji} *Idea ${action}*: ${idea.title}`
                    }
                },
                {
                    type: "section",
                    fields: [
                        {
                            type: "mrkdwn",
                            text: `*Status:*\n${idea.status || 'Active'}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Priority:*\n${idea.priority || 'Medium'}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Category:*\n${idea.category || 'Feature'}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*By:*\n${user_name || 'Unknown'}`
                        }
                    ]
                }
            ],
            attachments: [
                {
                    color: color,
                    text: idea.description?.substring(0, 200) || ''
                }
            ]
        };

        // Send to Slack
        const response = await fetch(webhook_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(slackMessage)
        });

        if (!response.ok) {
            throw new Error(`Slack API error: ${response.status}`);
        }

        return new Response(
            JSON.stringify({ success: true, event, idea_id: idea.idea_id }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )

    } catch (error) {
        console.error("Slack notifier error:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
    }
})
