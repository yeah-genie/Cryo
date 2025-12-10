
-- Create the decisions table (extending the concept of ideas)
create table if not exists public.decisions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Core Content (Extracted by AI)
  problem text,
  decision text not null, -- This maps to the 'title' or 'idea' in the old schema
  reason text,
  content text, -- Raw content
  
  -- Metadata
  source_type text check (source_type in ('slack', 'manual', 'notion', 'web')),
  source_link text,
  raw_metadata jsonb, -- For storing full Slack event object
  
  -- Tracking
  owner_id uuid references auth.users(id),
  status text default 'inbox' check (status in ('inbox', 'archived', 'active', 'completed')),
  
  -- AI Flags
  ai_summary boolean default false,
  
  -- Smart Thaw Triggers (JSONB for flexibility)
  thaw_trigger_type text check (thaw_trigger_type in ('date', 'metric', 'news', 'quarterly', 'none')),
  thaw_trigger_value jsonb
);

-- Enable RLS
alter table public.decisions enable row level security;

-- Policies
create policy "Users can view their own team's decisions"
  on public.decisions for select
  using (auth.uid() = owner_id); -- Simplified for MVP, later should be team-based

create policy "Users can insert decisions"
  on public.decisions for insert
  with check (auth.uid() = owner_id);

create policy "Users can update their own decisions"
  on public.decisions for update
  using (auth.uid() = owner_id);
