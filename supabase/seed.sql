
-- Users
INSERT INTO users (user_id, email, name, role, workspace_id, profile_image, notification_email, notification_slack) VALUES
('d0c72950-0001-4000-a000-000000000001', 'founder@startup.io', 'Alex Founder', 'Admin', 'd0c72950-0002-4000-a000-000000000001', 'https://picsum.photos/200/200', true, false),
('d0c72950-0001-4000-a000-000000000002', 'dev@startup.io', 'Sarah Dev', 'Editor', 'd0c72950-0002-4000-a000-000000000001', 'https://picsum.photos/201/201', true, true);

-- Workspaces
INSERT INTO workspaces (workspace_id, name, plan, owner_email, member_count, idea_count, logo) VALUES
('d0c72950-0002-4000-a000-000000000001', 'NextBigThing Inc.', 'Pro', 'founder@startup.io', 5, 12, 'https://picsum.photos/100/100');

-- WikiDocs (Insert first due to Idea dependency in mock, though schema allows circular if nullable)
INSERT INTO wiki_docs (wiki_id, workspace_id, title, content, category, is_pinned, updated_at, view_count, verification_date, status, related_idea_ids, emoji, cover_image) VALUES
('d0c72950-0004-4000-a000-000000000001', 'd0c72950-0002-4000-a000-000000000001', 'Onboarding Checklist', '1. Email setup\n2. Slack invite\n3. Git access...', 'Onboarding', true, '2024-01-01T00:00:00Z', 150, '2024-06-01', 'Verified', '{"d0c72950-0003-4000-a000-000000000001"}', '👋', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80'),
('d0c72950-0004-4000-a000-000000000002', 'd0c72950-0002-4000-a000-000000000001', 'Remote Work Policy', 'We are a remote-first company. Core hours are...', 'Policy', false, '2023-06-01T00:00:00Z', 89, '2023-12-01', 'Stale', null, '🏠', null);

-- Ideas
INSERT INTO ideas (idea_id, title, description, status, priority, category, workspace_id, created_by_user_id, created_at, updated_at, archived_at, archive_reason, trigger_type, trigger_date, trigger_metric, is_zombie, zombie_reason, source, source_url, related_wiki_ids, votes, start_date, target_date, predicted_thaw_date) VALUES
('d0c72950-0003-4000-a000-000000000001', 'AI-Powered Resume Builder', 'A tool that scans your existing resume and optimizes it for ATS systems using Gemini API.', 'Frozen', 'High', 'Feature', 'd0c72950-0002-4000-a000-000000000001', 'd0c72950-0001-4000-a000-000000000001', '2023-10-01T10:00:00Z', '2024-05-20T09:00:00Z', '2023-12-15T10:00:00Z', 'Wait for better API pricing', 'Time', '2024-05-01', null, true, '⏰ Scheduled review date reached', 'Manual', null, '{"d0c72950-0004-4000-a000-000000000001"}', 5, '2023-10-01', '2023-12-31', '2024-06-15'),
('d0c72950-0003-4000-a000-000000000002', 'Dark Mode Support', 'Implement system-wide dark mode for better accessibility. Requested by multiple users in Slack.', 'Active', 'Medium', 'Technical', 'd0c72950-0002-4000-a000-000000000001', 'd0c72950-0001-4000-a000-000000000002', '2024-05-10T10:00:00Z', '2024-05-10T10:00:00Z', null, null, 'None', null, null, false, null, 'Slack', 'https://slack.com/archives/C12345/p1234567890', null, 12, '2024-05-15', '2024-06-15', null),
('d0c72950-0003-4000-a000-000000000003', 'Crypto Payment Gateway', 'Allow customers to pay using ETH and BTC.', 'Killed', 'Low', 'Growth', 'd0c72950-0002-4000-a000-000000000001', 'd0c72950-0001-4000-a000-000000000001', '2023-01-10T10:00:00Z', '2023-02-10T10:00:00Z', null, 'Regulatory concerns too high', 'None', null, null, false, null, 'Notion', 'https://notion.so/roadmap/crypto-payments', null, 2, null, null, null),
('d0c72950-0003-4000-a000-000000000004', 'Mobile App (React Native)', 'Port the web app to mobile platforms.', 'Archived', 'High', 'Growth', 'd0c72950-0002-4000-a000-000000000001', 'd0c72950-0001-4000-a000-000000000002', '2024-01-15T10:00:00Z', '2024-03-01T10:00:00Z', '2024-03-01T10:00:00Z', 'Focus on web stability first', 'Metric', null, 'MAU > 5000', false, null, 'Linear', 'https://linear.app/issue/PRO-123', null, 8, '2024-02-01', '2024-04-01', null),
('d0c72950-0003-4000-a000-000000000005', 'Referral Program', 'Give $10 to users who invite friends.', 'Frozen', 'Medium', 'Growth', 'd0c72950-0002-4000-a000-000000000001', 'd0c72950-0001-4000-a000-000000000001', '2023-11-01T10:00:00Z', '2024-02-01T10:00:00Z', null, null, 'Metric', null, 'Viral Coeff > 1.2', true, 'Manual Freeze', 'Manual', null, null, 3, null, null, null);

-- Decisions
INSERT INTO decisions (decision_id, idea_id, type, title, content, outcome, decided_by_user_id, decided_at, workspace_id) VALUES
('d0c72950-0005-4000-a000-000000000001', 'd0c72950-0003-4000-a000-000000000001', 'Meeting', 'Initial Brainstorming', 'Team agreed this has high potential but tech is expensive right now.', 'Deferred', 'd0c72950-0001-4000-a000-000000000001', '2023-11-01T14:00:00Z', 'd0c72950-0002-4000-a000-000000000001'),
('d0c72950-0005-4000-a000-000000000002', 'd0c72950-0003-4000-a000-000000000003', 'Kill', 'Kill Idea', 'Legal team advised against it due to new SEC regulations.', 'Rejected', 'd0c72950-0001-4000-a000-000000000001', '2023-02-10T10:00:00Z', 'd0c72950-0002-4000-a000-000000000001');

-- Metrics
INSERT INTO metrics (metric_id, workspace_id, name, current_value, target_value, unit, updated_at, trend, description) VALUES
('d0c72950-0006-4000-a000-000000000001', 'd0c72950-0002-4000-a000-000000000001', 'Monthly Active Users', 4200, 5000, 'Users', '2024-05-20T10:00:00Z', 'Up', 'Total unique users who logged in past 30 days'),
('d0c72950-0006-4000-a000-000000000002', 'd0c72950-0002-4000-a000-000000000001', 'MRR', 12500, 15000, 'USD', '2024-05-19T10:00:00Z', 'Flat', 'Monthly Recurring Revenue');

-- Market Pulses
INSERT INTO market_pulses (id, idea_id, type, description, severity, timestamp, source_url) VALUES
('d0c72950-0007-4000-a000-000000000001', 'd0c72950-0003-4000-a000-000000000001', 'Funding', 'Competitor ''ResumAI'' raised $5M Series A', 'High', '2024-05-21T08:00:00Z', 'https://techcrunch.com'),
('d0c72950-0007-4000-a000-000000000002', 'd0c72950-0003-4000-a000-000000000003', 'Regulatory', 'New crypto bill passed in Senate', 'Medium', '2024-05-20T14:00:00Z', null);

-- Synthesis Suggestions
INSERT INTO synthesis_suggestions (id, source_idea_ids, suggested_title, reason, confidence_score) VALUES
('d0c72950-0008-4000-a000-000000000001', '{"d0c72950-0003-4000-a000-000000000001", "d0c72950-0003-4000-a000-000000000004"}', 'AI Resume Builder Mobile App', 'Both ideas target user retention. Combining mobile accessibility with AI features creates a stronger MVP.', 85);
