
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cryo-secret',
}

interface SlackPayload {
    action?: 'create' | 'update' | 'delete';
    text: string;
    user_name?: string;
    idea_id?: string;  // Required for update/delete
    title?: string;
    status?: string;
    priority?: string;
}

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Security check
        const secret = Deno.env.get('CRYO_WEBHOOK_SECRET');
        if (secret) {
            const receivedSecret = req.headers.get('x-cryo-secret');
            if (receivedSecret !== secret) {
                throw new Error("Unauthorized: Invalid Secret");
            }
        }

        const payload: SlackPayload = await req.json()
        const { action = 'create', text, user_name, idea_id, title, status, priority } = payload;

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        )

        // DELETE: Soft delete (mark as Killed)
        if (action === 'delete' && idea_id) {
            const { error } = await supabaseClient
                .from('ideas')
                .update({
                    status: 'Killed',
                    archive_reason: `Deleted via Slack by ${user_name || 'unknown'}`,
                    updated_at: new Date().toISOString()
                })
                .eq('idea_id', idea_id);

            if (error) throw error;

            return new Response(
                JSON.stringify({ message: 'Idea deleted (soft)', idea_id }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } },
            )
        }

        // UPDATE: Update existing idea
        if (action === 'update' && idea_id) {
            const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
            if (title) updateData.title = title;
            if (text) updateData.description = text;
            if (status) updateData.status = status;
            if (priority) updateData.priority = priority;

            const { data, error } = await supabaseClient
                .from('ideas')
                .update(updateData)
                .eq('idea_id', idea_id)
                .select();

            if (error) throw error;

            return new Response(
                JSON.stringify({ message: 'Idea updated', data }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } },
            )
        }

        // CREATE: Original logic with duplicate detection
        const ideaTitle = title || text.split('\n')[0].substring(0, 100) || "New Idea from Slack"

        // Duplicate detection
        const { data: existing } = await supabaseClient
            .from('ideas')
            .select('idea_id, votes, description')
            .eq('title', ideaTitle)
            .neq('status', 'Killed')
            .maybeSingle();

        if (existing) {
            const { error: updateError } = await supabaseClient
                .from('ideas')
                .update({
                    votes: (existing.votes || 0) + 1,
                    description: existing.description + `\n\n[+1 via Slack by ${user_name}]: ${text}`
                })
                .eq('idea_id', existing.idea_id);

            if (updateError) throw updateError;

            return new Response(
                JSON.stringify({ message: "Duplicate detected. Upvoted existing idea.", idea_id: existing.idea_id }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } },
            )
        }

        // AI Classification (keyword-based)
        let category = 'Feature';
        let ideaPriority = priority || 'Medium';
        const lowerText = text.toLowerCase();

        if (lowerText.includes('bug') || lowerText.includes('error') || lowerText.includes('fix')) {
            category = 'Technical';
            ideaPriority = 'High';
        } else if (lowerText.includes('urgent') || lowerText.includes('asap')) {
            ideaPriority = 'High';
        } else if (lowerText.includes('payment') || lowerText.includes('billing')) {
            category = 'Growth';
            ideaPriority = 'High';
        }

        // Insert new idea
        const { data, error } = await supabaseClient
            .from('ideas')
            .insert([{
                title: ideaTitle,
                description: text,
                status: status || 'Frozen',
                category,
                priority: ideaPriority,
                source: 'Slack',
                created_by_user_id: 'd0c72950-0001-4000-a000-000000000002',
                votes: 1
            }])
            .select()

        if (error) throw error

        return new Response(
            JSON.stringify({ message: 'Idea created!', data }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
    }
})
