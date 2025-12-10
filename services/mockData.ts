
import {
  User, Role, Workspace, Plan, Idea, IdeaStatus, Priority, Category, TriggerType,
  Decision, DecisionType, DecisionOutcome, Metric, MetricTrend, WikiDoc, IdeaSource, WikiStatus,
  ActivityLog, ActivityType, VoteTag, MarketPulse, SynthesisSuggestion
} from '../types';

// Valid UUIDs for consistent testing
const UUIDS = {
  USER_1: 'd0c72950-0001-4000-a000-000000000001',
  USER_2: 'd0c72950-0001-4000-a000-000000000002',
  WORKSPACE_1: 'd0c72950-0002-4000-a000-000000000001',
  IDEA_1: 'd0c72950-0003-4000-a000-000000000001',
  IDEA_2: 'd0c72950-0003-4000-a000-000000000002',
  IDEA_3: 'd0c72950-0003-4000-a000-000000000003',
  IDEA_4: 'd0c72950-0003-4000-a000-000000000004',
  IDEA_5: 'd0c72950-0003-4000-a000-000000000005',
  WIKI_1: 'd0c72950-0004-4000-a000-000000000001',
  WIKI_2: 'd0c72950-0004-4000-a000-000000000002',
  DECISION_1: 'd0c72950-0005-4000-a000-000000000001',
  DECISION_2: 'd0c72950-0005-4000-a000-000000000002',
  METRIC_1: 'd0c72950-0006-4000-a000-000000000001',
  METRIC_2: 'd0c72950-0006-4000-a000-000000000002',
  PULSE_1: 'd0c72950-0007-4000-a000-000000000001',
  PULSE_2: 'd0c72950-0007-4000-a000-000000000002',
  SYNTHESIS_1: 'd0c72950-0008-4000-a000-000000000001',
  ACTIVITY_1: 'd0c72950-0009-4000-a000-000000000001',
  ACTIVITY_2: 'd0c72950-0009-4000-a000-000000000002',
  ACTIVITY_3: 'd0c72950-0009-4000-a000-000000000003'
};

export const CURRENT_USER: User = {
  user_id: UUIDS.USER_1,
  email: 'founder@startup.io',
  name: 'Alex Founder',
  role: Role.Admin,
  workspace_id: UUIDS.WORKSPACE_1,
  profile_image: 'https://picsum.photos/200/200',
  notification_email: true,
  notification_slack: false,
};

export const CURRENT_WORKSPACE: Workspace = {
  workspace_id: UUIDS.WORKSPACE_1,
  name: 'NextBigThing Inc.',
  plan: Plan.Pro,
  owner_email: 'founder@startup.io',
  member_count: 5,
  idea_count: 12,
  logo: 'https://picsum.photos/100/100',
};

export const MOCK_USERS: User[] = [
  CURRENT_USER,
  {
    user_id: UUIDS.USER_2,
    email: 'dev@startup.io',
    name: 'Sarah Dev',
    role: Role.Editor,
    workspace_id: UUIDS.WORKSPACE_1,
    profile_image: 'https://picsum.photos/201/201',
    notification_email: true,
    notification_slack: true,
  }
];

export const MOCK_IDEAS: Idea[] = [
  {
    idea_id: UUIDS.IDEA_1,
    title: 'AI-Powered Resume Builder',
    description: 'A tool that scans your existing resume and optimizes it for ATS systems using Gemini API.',
    status: IdeaStatus.Frozen,
    priority: Priority.High,
    category: Category.Feature,
    workspace_id: UUIDS.WORKSPACE_1,
    created_by_user_id: UUIDS.USER_1,
    created_at: '2023-10-01T10:00:00Z',
    updated_at: '2024-05-20T09:00:00Z',
    archived_at: '2023-12-15T10:00:00Z',
    archive_reason: 'Wait for better API pricing',
    trigger_type: TriggerType.Time,
    trigger_date: '2024-05-01',
    is_zombie: true,
    zombie_reason: '⏰ Scheduled review date reached',
    source: IdeaSource.Manual,
    related_wiki_ids: [UUIDS.WIKI_1],
    votes: 5,
    vote_records: [
      { user_id: UUIDS.USER_2, tag: VoteTag.Customer, timestamp: '2024-01-01T10:00:00Z' }
    ],
    start_date: '2023-10-01',
    target_date: '2023-12-31',
    predicted_thaw_date: '2024-06-15'
  },
  {
    idea_id: UUIDS.IDEA_2,
    title: 'Dark Mode Support',
    description: 'Implement system-wide dark mode for better accessibility. Requested by multiple users in Slack.',
    status: IdeaStatus.Active,
    priority: Priority.Medium,
    category: Category.Technical,
    workspace_id: UUIDS.WORKSPACE_1,
    created_by_user_id: UUIDS.USER_2,
    created_at: '2024-05-10T10:00:00Z',
    updated_at: '2024-05-10T10:00:00Z',
    trigger_type: TriggerType.None,
    is_zombie: false,
    source: IdeaSource.Slack,
    source_url: 'https://slack.com/archives/C12345/p1234567890',
    votes: 12,
    vote_records: [],
    start_date: '2024-05-15',
    target_date: '2024-06-15'
  },
  {
    idea_id: UUIDS.IDEA_3,
    title: 'Crypto Payment Gateway',
    description: 'Allow customers to pay using ETH and BTC.',
    status: IdeaStatus.Killed,
    priority: Priority.Low,
    category: Category.Growth,
    workspace_id: UUIDS.WORKSPACE_1,
    created_by_user_id: UUIDS.USER_1,
    created_at: '2023-01-10T10:00:00Z',
    updated_at: '2023-02-10T10:00:00Z',
    trigger_type: TriggerType.None,
    is_zombie: false,
    archive_reason: 'Regulatory concerns too high',
    source: IdeaSource.Notion,
    source_url: 'https://notion.so/roadmap/crypto-payments',
    votes: 2,
    vote_records: [],
    lineage: []
  },
  {
    idea_id: UUIDS.IDEA_4,
    title: 'Mobile App (React Native)',
    description: 'Port the web app to mobile platforms.',
    status: IdeaStatus.Archived,
    priority: Priority.High,
    category: Category.Growth,
    workspace_id: UUIDS.WORKSPACE_1,
    created_by_user_id: UUIDS.USER_2,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-03-01T10:00:00Z',
    archived_at: '2024-03-01T10:00:00Z',
    archive_reason: 'Focus on web stability first',
    trigger_type: TriggerType.Metric,
    trigger_metric: 'MAU > 5000',
    is_zombie: false,
    source: IdeaSource.Linear,
    source_url: 'https://linear.app/issue/PRO-123',
    votes: 8,
    vote_records: [],
    start_date: '2024-02-01',
    target_date: '2024-04-01'
  },
  {
    idea_id: UUIDS.IDEA_5,
    title: 'Referral Program',
    description: 'Give $10 to users who invite friends.',
    status: IdeaStatus.Frozen,
    priority: Priority.Medium,
    category: Category.Growth,
    workspace_id: UUIDS.WORKSPACE_1,
    created_by_user_id: UUIDS.USER_1,
    created_at: '2023-11-01T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z',
    trigger_type: TriggerType.Metric,
    trigger_metric: 'Viral Coeff > 1.2',
    is_zombie: true,
    zombie_reason: 'Manual Freeze',
    source: IdeaSource.Manual,
    votes: 3,
    vote_records: []
  }
];

export const MOCK_DECISIONS: Decision[] = [
  {
    decision_id: UUIDS.DECISION_1,
    idea_id: UUIDS.IDEA_1,
    type: DecisionType.Meeting,
    title: 'Initial Brainstorming',
    content: 'Team agreed this has high potential but tech is expensive right now.',
    outcome: DecisionOutcome.Deferred,
    decided_by_user_id: UUIDS.USER_1,
    decided_at: '2023-11-01T14:00:00Z',
    workspace_id: UUIDS.WORKSPACE_1,
  },
  {
    decision_id: UUIDS.DECISION_2,
    idea_id: UUIDS.IDEA_3,
    type: DecisionType.Kill,
    title: 'Kill Idea',
    content: 'Legal team advised against it due to new SEC regulations.',
    outcome: DecisionOutcome.Rejected,
    decided_by_user_id: UUIDS.USER_1,
    decided_at: '2023-02-10T10:00:00Z',
    workspace_id: UUIDS.WORKSPACE_1,
  }
];

export const MOCK_METRICS: Metric[] = [
  {
    metric_id: UUIDS.METRIC_1,
    workspace_id: UUIDS.WORKSPACE_1,
    name: 'Monthly Active Users',
    current_value: 4200,
    target_value: 5000,
    unit: 'Users',
    updated_at: '2024-05-20T10:00:00Z',
    trend: MetricTrend.Up,
    description: 'Total unique users who logged in past 30 days'
  },
  {
    metric_id: UUIDS.METRIC_2,
    workspace_id: UUIDS.WORKSPACE_1,
    name: 'MRR',
    current_value: 12500,
    target_value: 15000,
    unit: 'USD',
    updated_at: '2024-05-19T10:00:00Z',
    trend: MetricTrend.Flat,
    description: 'Monthly Recurring Revenue'
  }
];

export const MOCK_WIKI: WikiDoc[] = [
  {
    wiki_id: UUIDS.WIKI_1,
    workspace_id: UUIDS.WORKSPACE_1,
    title: 'Onboarding Checklist',
    content: '1. Email setup\n2. Slack invite\n3. Git access...',
    category: 'Onboarding',
    is_pinned: true,
    updated_at: '2024-01-01T00:00:00Z',
    view_count: 150,
    verification_date: '2024-06-01',
    status: WikiStatus.Verified,
    related_idea_ids: [UUIDS.IDEA_1],
    emoji: '👋',
    cover_image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80'
  },
  {
    wiki_id: UUIDS.WIKI_2,
    workspace_id: UUIDS.WORKSPACE_1,
    title: 'Remote Work Policy',
    content: 'We are a remote-first company. Core hours are...',
    category: 'Policy',
    is_pinned: false,
    updated_at: '2023-06-01T00:00:00Z',
    view_count: 89,
    verification_date: '2023-12-01',
    status: WikiStatus.Stale,
    emoji: '🏠'
  }
];

export const MOCK_ACTIVITIES: ActivityLog[] = [
  {
    activity_id: UUIDS.ACTIVITY_1,
    user_id: UUIDS.USER_2,
    entity_type: 'Idea',
    entity_id: UUIDS.IDEA_2,
    entity_title: 'Dark Mode Support',
    action: ActivityType.Vote,
    timestamp: '2024-05-21T09:30:00Z',
    is_read: false
  },
  {
    activity_id: UUIDS.ACTIVITY_2,
    user_id: UUIDS.USER_1,
    entity_type: 'Wiki',
    entity_id: UUIDS.WIKI_1,
    entity_title: 'Onboarding Checklist',
    action: ActivityType.Update,
    timestamp: '2024-05-20T16:45:00Z',
    details: 'Updated verification date',
    is_read: true
  },
  {
    activity_id: UUIDS.ACTIVITY_3,
    user_id: UUIDS.USER_2,
    entity_type: 'Idea',
    entity_id: UUIDS.IDEA_1,
    entity_title: 'AI-Powered Resume Builder',
    action: ActivityType.Wake,
    timestamp: '2024-05-20T10:00:00Z',
    details: 'Triggered by schedule',
    is_read: true
  }
];

export const MOCK_MARKET_PULSE: MarketPulse[] = [
  {
    id: UUIDS.PULSE_1,
    idea_id: UUIDS.IDEA_1,
    type: 'Funding',
    description: "Competitor 'ResumAI' raised $5M Series A",
    severity: 'High',
    timestamp: '2024-05-21T08:00:00Z',
    source_url: 'https://techcrunch.com'
  },
  {
    id: UUIDS.PULSE_2,
    idea_id: UUIDS.IDEA_3,
    type: 'Regulatory',
    description: "New crypto bill passed in Senate",
    severity: 'Medium',
    timestamp: '2024-05-20T14:00:00Z'
  }
];

export const MOCK_SYNTHESIS_SUGGESTIONS: SynthesisSuggestion[] = [
  {
    id: UUIDS.SYNTHESIS_1,
    source_idea_ids: [UUIDS.IDEA_1, UUIDS.IDEA_4],
    suggested_title: 'AI Resume Builder Mobile App',
    reason: 'Both ideas target user retention. Combining mobile accessibility with AI features creates a stronger MVP.',
    confidence_score: 85
  }
];
