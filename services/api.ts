
import { supabase } from './supabase';
import {
    Idea, User, Workspace, Decision, Metric, WikiDoc, ActivityLog, MarketPulse, SynthesisSuggestion,
    IdeaStatus, VoteTag, ActivityType
} from '../types';

export const cryoApi = {
    // --- Ideas ---
    async fetchIdeas(workspaceId: string): Promise<Idea[]> {
        const { data, error } = await supabase
            .from('ideas')
            .select('*')
            .eq('workspace_id', workspaceId)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error("Failed to fetch ideas: " + error.message);
        }
        return data as Idea[];
    },

    async createIdea(idea: Idea): Promise<Idea> {
        const { data, error } = await supabase
            .from('ideas')
            .insert([idea])
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }
        return data as Idea;
    },

    async updateIdea(idea: Idea): Promise<Idea> {
        // Exclude vote_records as it doesn't exist in Supabase schema
        const { vote_records, ...ideaWithoutVoteRecords } = idea as any;
        const { data, error } = await supabase
            .from('ideas')
            .update(ideaWithoutVoteRecords)
            .eq('idea_id', idea.idea_id)
            .select()
            .single();

        if (error) throw new Error("Failed to update idea: " + error.message);
        return data as Idea;
    },

    async voteIdea(ideaId: string, userId: string, tag: VoteTag): Promise<void> {
        // 1. Fetch current idea to get votes (vote_records removed - not in schema)
        const { data: idea, error: fetchError } = await supabase
            .from('ideas')
            .select('votes')
            .eq('idea_id', ideaId)
            .single();

        if (fetchError || !idea) throw new Error(fetchError?.message || "Idea not found");

        const newVotes = (idea.votes || 0) + 1;

        const { error } = await supabase
            .from('ideas')
            .update({ votes: newVotes })
            .eq('idea_id', ideaId);

        if (error) throw new Error(error.message);
    },

    // --- Users ---
    async fetchUsers(workspaceId: string): Promise<User[]> {
        // In a real app, we filter by workspace linkage. For this demo, fetch all.
        const { data, error } = await supabase.from('users').select('*');
        if (error) throw new Error("Failed to fetch users: " + error.message);
        return data as User[];
    },

    async getCurrentUser(email: string): Promise<User | null> {
        const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
        if (error) return null; // Acceptable null return for "user check"
        return data as User;
    },

    // --- Decisions ---
    async fetchDecisions(workspaceId: string): Promise<Decision[]> {
        const { data, error } = await supabase
            .from('decisions')
            .select('*')
            .eq('workspace_id', workspaceId)
            .order('decided_at', { ascending: false });

        if (error) throw new Error("Failed to fetch decisions: " + error.message);
        return data as Decision[];
    },

    async createDecision(decision: Decision): Promise<void> {
        const { error } = await supabase.from('decisions').insert([decision]);
        if (error) throw new Error("Failed to create decision: " + error.message);
    },

    // --- Workspace ---
    async fetchWorkspace(workspaceId: string): Promise<Workspace | null> {
        const { data, error } = await supabase.from('workspaces').select('*').eq('workspace_id', workspaceId).single();
        if (error) return null;
        return data as Workspace;
    },

    async fetchWorkspacesByUser(email: string): Promise<Workspace[]> {
        // Simple finding by owner_email for now. RLS will protect read if we used join.
        // Or if we have a members table. For now, owner_email from workspaces table.
        const { data, error } = await supabase.from('workspaces').select('*').eq('owner_email', email);
        if (error) return [];
        return data as Workspace[];
    },

    async createWorkspace(workspace: Workspace): Promise<void> {
        const { error } = await supabase.from('workspaces').insert([workspace]);
        if (error) throw new Error("Failed to create workspace: " + error.message);
    },

    // --- Metrics ---
    async fetchMetrics(workspaceId: string): Promise<Metric[]> {
        const { data, error } = await supabase
            .from('metrics')
            .select('*')
            .eq('workspace_id', workspaceId);

        if (error) throw new Error(error.message);
        return data as Metric[];
    },

    // --- Wiki ---
    async fetchWiki(workspaceId: string): Promise<WikiDoc[]> {
        const { data, error } = await supabase
            .from('wiki_docs')
            .select('*')
            .eq('workspace_id', workspaceId);

        if (error) throw new Error(error.message);
        return data as WikiDoc[];
    },

    async createWikiDoc(doc: WikiDoc): Promise<void> {
        const { error } = await supabase.from('wiki_docs').insert([doc]);
        if (error) throw new Error(error.message);
    },

    async updateWikiDoc(doc: WikiDoc): Promise<void> {
        const { error } = await supabase.from('wiki_docs').update(doc).eq('wiki_id', doc.wiki_id);
        if (error) throw new Error(error.message);
    },

    // --- Activity Logs ---
    async fetchActivities(limit = 20): Promise<ActivityLog[]> {
        const { data, error } = await supabase
            .from('activity_logs')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(limit);
        if (error) throw new Error(error.message);
        return data as ActivityLog[];
    },

    async logActivity(log: ActivityLog): Promise<void> {
        const { error } = await supabase.from('activity_logs').insert([log]);
        if (error) console.error("Logging failed silently:", error); // Logs can fail silently
    },

    async markActivityAsRead(activityId: string): Promise<void> {
        const { error } = await supabase.from('activity_logs').update({ is_read: true }).eq('activity_id', activityId);
        if (error) throw new Error(error.message);
    },

    // --- Market Pulse ---
    async fetchMarketPulses(): Promise<MarketPulse[]> {
        const { data, error } = await supabase.from('market_pulses').select('*').order('timestamp', { ascending: false });
        if (error) throw new Error(error.message);
        return data as MarketPulse[];
    },

    async createMarketPulse(pulse: MarketPulse): Promise<void> {
        const { error } = await supabase.from('market_pulses').insert([pulse]);
        if (error) throw new Error(error.message);
    },

    // --- Synthesis ---
    async fetchSynthesisSuggestions(): Promise<SynthesisSuggestion[]> {
        const { data, error } = await supabase.from('synthesis_suggestions').select('*');
        if (error) throw new Error(error.message);
        return data as SynthesisSuggestion[];
    },

    async createSynthesisSuggestion(suggestion: SynthesisSuggestion): Promise<void> {
        const { error } = await supabase.from('synthesis_suggestions').insert([suggestion]);
        if (error) throw new Error(error.message);
    }
};
