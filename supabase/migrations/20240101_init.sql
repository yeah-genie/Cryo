-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users
create table users (
  user_id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text,
  role text check (role in ('Admin', 'Editor', 'Viewer')),
  workspace_id uuid, -- Link to workspace later
  profile_image text,
  notification_email boolean default false,
  notification_slack boolean default false
);

-- Workspaces
create table workspaces (
  workspace_id uuid primary key default uuid_generate_v4(),
  name text not null,
  plan text check (plan in ('Free', 'Pro', 'Team')),
  owner_email text,
  member_count int default 1,
  idea_count int default 0,
  logo text
);

-- Ideas
create table ideas (
  idea_id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  status text check (status in ('Active', 'In Progress', 'Completed', 'Archived', 'Killed', 'Frozen')),
  priority text check (priority in ('High', 'Medium', 'Low')),
  category text,
  workspace_id uuid references workspaces(workspace_id),
  created_by_user_id uuid references users(user_id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  archived_at timestamp with time zone,
  archive_reason text,
  trigger_type text,
  trigger_date timestamp with time zone,
  trigger_metric text,
  trigger_keyword text,
  is_zombie boolean default false,
  zombie_reason text,
  votes int default 0,
  source text,
  source_url text,
  related_wiki_ids text[], -- Array of UUIDs
  start_date timestamp with time zone,
  target_date timestamp with time zone,
  lineage jsonb, -- Store complex object as JSONB
  predicted_thaw_date timestamp with time zone
);

-- Decisions
create table decisions (
  decision_id uuid primary key default uuid_generate_v4(),
  idea_id uuid references ideas(idea_id),
  type text,
  title text,
  content text,
  outcome text,
  decided_by_user_id uuid references users(user_id),
  decided_at timestamp with time zone default now(),
  workspace_id uuid references workspaces(workspace_id)
);

-- Metrics
create table metrics (
  metric_id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(workspace_id),
  name text,
  current_value numeric,
  target_value numeric,
  unit text,
  updated_at timestamp with time zone default now(),
  trend text,
  description text
);

-- WikiDocs
create table wiki_docs (
  wiki_id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(workspace_id),
  title text,
  content text,
  category text,
  is_pinned boolean default false,
  updated_at timestamp with time zone default now(),
  view_count int default 0,
  verification_date timestamp with time zone,
  status text,
  related_idea_ids text[],
  emoji text,
  cover_image text
);

-- ActivityLogs
create table activity_logs (
  activity_id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(user_id),
  entity_type text,
  entity_id uuid,
  entity_title text,
  action text,
  timestamp timestamp with time zone default now(),
  details text,
  is_read boolean default false
);

-- MarketPulses
create table market_pulses (
  id uuid primary key default uuid_generate_v4(),
  idea_id uuid references ideas(idea_id),
  type text,
  description text,
  severity text,
  timestamp timestamp with time zone default now(),
  source_url text
);

-- SynthesisSuggestions
create table synthesis_suggestions (
  id uuid primary key default uuid_generate_v4(),
  source_idea_ids text[],
  suggested_title text,
  reason text,
  confidence_score numeric
);

-- Row Level Security (RLS) - Basic Policy: Allow all for now (Dev Mode)
alter table users enable row level security;
create policy "Allow all" on users for all using (true) with check (true);

alter table workspaces enable row level security;
create policy "Allow all" on workspaces for all using (true) with check (true);

alter table ideas enable row level security;
create policy "Allow all" on ideas for all using (true) with check (true);

alter table decisions enable row level security;
create policy "Allow all" on decisions for all using (true) with check (true);

alter table metrics enable row level security;
create policy "Allow all" on metrics for all using (true) with check (true);

alter table wiki_docs enable row level security;
create policy "Allow all" on wiki_docs for all using (true) with check (true);

alter table activity_logs enable row level security;
create policy "Allow all" on activity_logs for all using (true) with check (true);

alter table market_pulses enable row level security;
create policy "Allow all" on market_pulses for all using (true) with check (true);

alter table synthesis_suggestions enable row level security;
create policy "Allow all" on synthesis_suggestions for all using (true) with check (true);
