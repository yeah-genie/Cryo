
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cryo-secret, linear-signature',
}

interface LinearPayload {
    action?: 'create' | 'update' | 'delete';
    // From Linear webhook or manual sync
    issue_id?: string;
    idea_id?: string;  // For Cryo-side operations
    title: string;
    description?: string;
    state?: string;  // Linear states: backlog, todo, in_progress, done, canceled
    priority?: number;  // Linear: 0-4 (0=no priority, 4=urgent)
    url?: string;
}

// Map Linear states to Cryo statuses
const stateMapping: Record<string, string> = {
    'backlog': 'Frozen',
    'todo': 'Active',
    'in_progress': 'In Progress',
    'done': 'Completed',
    'canceled': 'Killed',
    'triage': 'Frozen'
};

// Map Linear priority (0-4) to Cryo priority
const priorityMapping: Record<number, string> = {
    0: 'Medium',  // No priority
    1: 'Low',
    2: 'Medium',
    3: 'High',
    4: 'High'  // Urgent
};

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

        const payload: LinearPayload = await req.json()
        const { action = 'create', issue_id, idea_id, title, description, state, priority, url } = payload;

        // Map Linear values to Cryo values
        const cryoStatus = state ? (stateMapping[state] || 'Frozen') : 'Frozen';
        const cryoPriority = priority !== undefined ? (priorityMapping[priority] || 'Medium') : 'Medium';

        // DELETE: Soft delete (mark as Killed)
        if (action === 'delete') {
            const targetId = idea_id || issue_id;
            if (!targetId) throw new Error("Missing id for delete");

            const { error } = await supabaseClient
                .from('ideas')
                .update({
                    status: 'Killed',
                    archive_reason: 'Canceled in Linear',
                    updated_at: new Date().toISOString()
                })
                .or(`idea_id.eq.${targetId},source_url.ilike.%${issue_id}%`);

            if (error) throw error;

            return new Response(
                JSON.stringify({ message: 'Idea synced as deleted from Linear', id: targetId }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            )
        }

        // UPDATE: Update existing idea
        if (action === 'update') {
            const targetId = idea_id || issue_id;
            if (!targetId) throw new Error("Missing id for update");

            const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
            if (title) updateData.title = title;
            if (description) updateData.description = description;
            if (state) updateData.status = cryoStatus;
            if (priority !== undefined) updateData.priority = cryoPriority;

            // Try to find by idea_id first, then by source_url containing issue_id
            let query = supabaseClient.from('ideas').update(updateData);

            if (idea_id) {
                query = query.eq('idea_id', idea_id);
            } else if (issue_id) {
                query = query.ilike('source_url', `%${issue_id}%`);
            }

            const { data, error } = await query.select();

            if (error) throw error;

            return new Response(
                JSON.stringify({ message: 'Idea updated from Linear', data }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            )
        }

        // CREATE: Create new idea from Linear issue
        // Check for duplicate first
        if (issue_id) {
            const { data: existing } = await supabaseClient
                .from('ideas')
                .select('idea_id')
                .ilike('source_url', `%${issue_id}%`)
                .maybeSingle();

            if (existing) {
                return new Response(
                    JSON.stringify({ message: 'Idea already exists for this Linear issue', idea_id: existing.idea_id }),
                    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
                )
            }
        }

        const { data, error } = await supabaseClient
            .from('ideas')
            .insert([{
                title: title || "New Idea from Linear",
                description: description || "",
                status: cryoStatus,
                priority: cryoPriority,
                category: 'Feature',  // Default category for Linear issues
                source: 'Linear',
                source_url: url || (issue_id ? `https://linear.app/issue/${issue_id}` : null),
                created_by_user_id: 'd0c72950-0001-4000-a000-000000000002',
                votes: 0
            }])
            .select()

        if (error) throw error

        return new Response(
            JSON.stringify({ message: 'Idea created from Linear!', data }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )

    } catch (error) {
        console.error("Linear webhook error:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
    }
})
