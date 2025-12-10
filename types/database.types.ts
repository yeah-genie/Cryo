
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    user_id: string
                    email: string
                    name: string | null
                    role: 'Admin' | 'Editor' | 'Viewer' | null
                    workspace_id: string | null
                    profile_image: string | null
                    notification_email: boolean | null
                    notification_slack: boolean | null
                }
                Insert: {
                    user_id?: string
                    email: string
                    name?: string | null
                    role?: 'Admin' | 'Editor' | 'Viewer' | null
                    workspace_id?: string | null
                    profile_image?: string | null
                    notification_email?: boolean | null
                    notification_slack?: boolean | null
                }
                Update: {
                    user_id?: string
                    email?: string
                    name?: string | null
                    role?: 'Admin' | 'Editor' | 'Viewer' | null
                    workspace_id?: string | null
                    profile_image?: string | null
                    notification_email?: boolean | null
                    notification_slack?: boolean | null
                }
            }
            workspaces: {
                Row: {
                    workspace_id: string
                    name: string
                    plan: 'Free' | 'Pro' | 'Team' | null
                    owner_email: string | null
                    member_count: number | null
                    idea_count: number | null
                    logo: string | null
                }
                Insert: {
                    workspace_id?: string
                    name: string
                    plan?: 'Free' | 'Pro' | 'Team' | null
                    owner_email?: string | null
                    member_count?: number | null
                    idea_count?: number | null
                    logo?: string | null
                }
                Update: {
                    workspace_id?: string
                    name?: string
                    plan?: 'Free' | 'Pro' | 'Team' | null
                    owner_email?: string | null
                    member_count?: number | null
                    idea_count?: number | null
                    logo?: string | null
                }
            }
            ideas: {
                Row: {
                    idea_id: string
                    title: string
                    description: string | null
                    status: 'Active' | 'In Progress' | 'Completed' | 'Archived' | 'Killed' | 'Frozen' | null
                    priority: 'High' | 'Medium' | 'Low' | null
                    category: string | null
                    workspace_id: string | null
                    created_by_user_id: string | null
                    created_at: string | null
                    updated_at: string | null
                    archived_at: string | null
                    archive_reason: string | null
                    trigger_type: string | null
                    trigger_date: string | null
                    trigger_metric: string | null
                    trigger_keyword: string | null
                    is_zombie: boolean | null
                    zombie_reason: string | null
                    votes: number | null
                    source: string | null
                    source_url: string | null
                    related_wiki_ids: string[] | null
                    start_date: string | null
                    target_date: string | null
                    lineage: Json | null
                    predicted_thaw_date: string | null
                    vote_records: Json[] | null // Custom addition not in SQL but used in code
                }
                Insert: {
                    idea_id?: string
                    title: string
                    description?: string | null
                    status?: 'Active' | 'In Progress' | 'Completed' | 'Archived' | 'Killed' | 'Frozen' | null
                    priority?: 'High' | 'Medium' | 'Low' | null
                    category?: string | null
                    workspace_id?: string | null
                    created_by_user_id?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                    archived_at?: string | null
                    archive_reason?: string | null
                    trigger_type?: string | null
                    trigger_date?: string | null
                    trigger_metric?: string | null
                    trigger_keyword?: string | null
                    is_zombie?: boolean | null
                    zombie_reason?: string | null
                    votes?: number | null
                    source?: string | null
                    source_url?: string | null
                    related_wiki_ids?: string[] | null
                    start_date?: string | null
                    target_date?: string | null
                    lineage?: Json | null
                    predicted_thaw_date?: string | null
                    vote_records?: Json[] | null
                }
                Update: {
                    idea_id?: string
                    title?: string
                    description?: string | null
                    status?: 'Active' | 'In Progress' | 'Completed' | 'Archived' | 'Killed' | 'Frozen' | null
                    priority?: 'High' | 'Medium' | 'Low' | null
                    category?: string | null
                    workspace_id?: string | null
                    created_by_user_id?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                    archived_at?: string | null
                    archive_reason?: string | null
                    trigger_type?: string | null
                    trigger_date?: string | null
                    trigger_metric?: string | null
                    trigger_keyword?: string | null
                    is_zombie?: boolean | null
                    zombie_reason?: string | null
                    votes?: number | null
                    source?: string | null
                    source_url?: string | null
                    related_wiki_ids?: string[] | null
                    start_date?: string | null
                    target_date?: string | null
                    lineage?: Json | null
                    predicted_thaw_date?: string | null
                    vote_records?: Json[] | null
                }
            }
            decisions: {
                Row: {
                    decision_id: string
                    idea_id: string | null
                    type: string | null
                    title: string | null
                    content: string | null
                    outcome: string | null
                    decided_by_user_id: string | null
                    decided_at: string | null
                    workspace_id: string | null
                }
                Insert: {
                    decision_id?: string
                    idea_id?: string | null
                    type?: string | null
                    title?: string | null
                    content?: string | null
                    outcome?: string | null
                    decided_by_user_id?: string | null
                    decided_at?: string | null
                    workspace_id?: string | null
                }
                Update: {
                    decision_id?: string
                    idea_id?: string | null
                    type?: string | null
                    title?: string | null
                    content?: string | null
                    outcome?: string | null
                    decided_by_user_id?: string | null
                    decided_at?: string | null
                    workspace_id?: string | null
                }
            }
            metrics: {
                Row: {
                    metric_id: string
                    workspace_id: string | null
                    name: string | null
                    current_value: number | null
                    target_value: number | null
                    unit: string | null
                    updated_at: string | null
                    trend: string | null
                    description: string | null
                }
                Insert: {
                    metric_id?: string
                    workspace_id?: string | null
                    name?: string | null
                    current_value?: number | null
                    target_value?: number | null
                    unit?: string | null
                    updated_at?: string | null
                    trend?: string | null
                    description?: string | null
                }
                Update: {
                    metric_id?: string
                    workspace_id?: string | null
                    name?: string | null
                    current_value?: number | null
                    target_value?: number | null
                    unit?: string | null
                    updated_at?: string | null
                    trend?: string | null
                    description?: string | null
                }
            }
            wiki_docs: {
                Row: {
                    wiki_id: string
                    workspace_id: string | null
                    title: string | null
                    content: string | null
                    category: string | null
                    is_pinned: boolean | null
                    updated_at: string | null
                    view_count: number | null
                    verification_date: string | null
                    status: string | null
                    related_idea_ids: string[] | null
                    emoji: string | null
                    cover_image: string | null
                }
                Insert: {
                    wiki_id?: string
                    workspace_id?: string | null
                    title?: string | null
                    content?: string | null
                    category?: string | null
                    is_pinned?: boolean | null
                    updated_at?: string | null
                    view_count?: number | null
                    verification_date?: string | null
                    status?: string | null
                    related_idea_ids?: string[] | null
                    emoji?: string | null
                    cover_image?: string | null
                }
                Update: {
                    wiki_id?: string
                    workspace_id?: string | null
                    title?: string | null
                    content?: string | null
                    category?: string | null
                    is_pinned?: boolean | null
                    updated_at?: string | null
                    view_count?: number | null
                    verification_date?: string | null
                    status?: string | null
                    related_idea_ids?: string[] | null
                    emoji?: string | null
                    cover_image?: string | null
                }
            }
            activity_logs: {
                Row: {
                    activity_id: string
                    user_id: string | null
                    entity_type: string | null
                    entity_id: string | null
                    entity_title: string | null
                    action: string | null
                    timestamp: string | null
                    details: string | null
                    is_read: boolean | null
                }
                Insert: {
                    activity_id?: string
                    user_id?: string | null
                    entity_type?: string | null
                    entity_id?: string | null
                    entity_title?: string | null
                    action?: string | null
                    timestamp?: string | null
                    details?: string | null
                    is_read?: boolean | null
                }
                Update: {
                    activity_id?: string
                    user_id?: string | null
                    entity_type?: string | null
                    entity_id?: string | null
                    entity_title?: string | null
                    action?: string | null
                    timestamp?: string | null
                    details?: string | null
                    is_read?: boolean | null
                }
            }
            market_pulses: {
                Row: {
                    id: string
                    idea_id: string | null
                    type: string | null
                    description: string | null
                    severity: string | null
                    timestamp: string | null
                    source_url: string | null
                }
                Insert: {
                    id?: string
                    idea_id?: string | null
                    type?: string | null
                    description?: string | null
                    severity?: string | null
                    timestamp?: string | null
                    source_url?: string | null
                }
                Update: {
                    id?: string
                    idea_id?: string | null
                    type?: string | null
                    description?: string | null
                    severity?: string | null
                    timestamp?: string | null
                    source_url?: string | null
                }
            }
            synthesis_suggestions: {
                Row: {
                    id: string
                    source_idea_ids: string[] | null
                    suggested_title: string | null
                    reason: string | null
                    confidence_score: number | null
                }
                Insert: {
                    id?: string
                    source_idea_ids?: string[] | null
                    suggested_title?: string | null
                    reason?: string | null
                    confidence_score?: number | null
                }
                Update: {
                    id?: string
                    source_idea_ids?: string[] | null
                    suggested_title?: string | null
                    reason?: string | null
                    confidence_score?: number | null
                }
            }
        }
    }
}
