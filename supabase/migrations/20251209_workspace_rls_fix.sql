-- Enable users to create their own workspace on first login
-- This policy allows authenticated users to create a workspace where owner_email matches their email

-- Add INSERT policy for workspaces
CREATE POLICY "Users can create workspace" ON workspaces
  FOR INSERT WITH CHECK (
    owner_email = auth.jwt()->>'email'
  );

-- Add UPDATE policy for workspace owners
CREATE POLICY "Owners can update workspace" ON workspaces
  FOR UPDATE USING (
    owner_email = auth.jwt()->>'email'
  );

-- Also need to allow users to view workspaces they own (by email) before they have a user record
DROP POLICY IF EXISTS "Users can view their workspace" ON workspaces;
CREATE POLICY "Users can view their workspace" ON workspaces
  FOR SELECT USING (
    owner_email = auth.jwt()->>'email' OR
    workspace_id IN (SELECT workspace_id FROM users WHERE user_id = auth.uid())
  );
