
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cryo-secret',
}

interface NotionPayload {
    action?: 'create' | 'update' | 'delete';
    target?: 'ideas' | 'wiki';  // Which table to operate on
    id?: string;  // idea_id or wiki_id for update/delete
    title: string;
    content?: string;
    url?: string;
    status?: string;
    priority?: string;
    category?: string;
}

serve(async (req) => {
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

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        )

        const payload: NotionPayload = await req.json()
        const { action = 'create', target = 'wiki', id, title, content, url, status, priority, category } = payload;

        // Handle IDEAS table
        if (target === 'ideas') {
            // DELETE
            if (action === 'delete' && id) {
                const { error } = await supabaseClient
                    .from('ideas')
                    .update({
                        status: 'Killed',
                        archive_reason: 'Deleted via Notion',
                        updated_at: new Date().toISOString()
                    })
                    .eq('idea_id', id);

                if (error) throw error;
                return new Response(
                    JSON.stringify({ message: 'Idea deleted from Notion', idea_id: id }),
                    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
                )
            }

            // UPDATE
            if (action === 'update' && id) {
                const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
                if (title) updateData.title = title;
                if (content) updateData.description = content;
                if (status) updateData.status = status;
                if (priority) updateData.priority = priority;
                if (category) updateData.category = category;

                const { data, error } = await supabaseClient
                    .from('ideas')
                    .update(updateData)
                    .eq('idea_id', id)
                    .select();

                if (error) throw error;
                return new Response(
                    JSON.stringify({ message: 'Idea updated from Notion', data }),
                    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
                )
            }

            // CREATE
            const { data, error } = await supabaseClient
                .from('ideas')
                .insert([{
                    title: title || "New Idea from Notion",
                    description: content || "",
                    status: status || 'Frozen',
                    priority: priority || 'Medium',
                    category: category || 'Feature',
                    source: 'Notion',
                    source_url: url,
                    created_by_user_id: 'd0c72950-0001-4000-a000-000000000002',
                    votes: 0
                }])
                .select()

            if (error) throw error;
            return new Response(
                JSON.stringify({ message: 'Idea created from Notion!', data }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            )
        }

        // Handle WIKI table (default)
        // DELETE
        if (action === 'delete' && id) {
            const { error } = await supabaseClient
                .from('wiki_docs')
                .delete()
                .eq('wiki_id', id);

            if (error) throw error;
            return new Response(
                JSON.stringify({ message: 'Wiki deleted from Notion', wiki_id: id }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            )
        }

        // UPDATE
        if (action === 'update' && id) {
            const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
            if (title) updateData.title = title;
            if (content) updateData.content = content;
            if (category) updateData.category = category;

            const { data, error } = await supabaseClient
                .from('wiki_docs')
                .update(updateData)
                .eq('wiki_id', id)
                .select();

            if (error) throw error;
            return new Response(
                JSON.stringify({ message: 'Wiki updated from Notion', data }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            )
        }

        // CREATE (original logic)
        const { data, error } = await supabaseClient
            .from('wiki_docs')
            .insert([{
                title: title || "New Notion Doc",
                content: content || "Content synced from Notion",
                category: category || 'Operations',
                source_url: url,
                status: 'Draft',
                updated_at: new Date().toISOString()
            }])
            .select()

        if (error) throw error

        return new Response(
            JSON.stringify({ message: 'Wiki Doc synced from Notion!', data }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
    }
})
