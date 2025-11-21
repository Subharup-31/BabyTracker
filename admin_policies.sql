-- Admin Policies for BabyTracker
-- Run this SQL in your Supabase SQL Editor to allow admins to see all data

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the user has admin role in their metadata
  RETURN (
    SELECT COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin',
      false
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add admin policies for baby_profiles
CREATE POLICY "Admins can view all baby profiles" ON baby_profiles
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can insert any baby profile" ON baby_profiles
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update any baby profile" ON baby_profiles
    FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete any baby profile" ON baby_profiles
    FOR DELETE USING (is_admin());

-- Add admin policies for vaccines
CREATE POLICY "Admins can view all vaccines" ON vaccines
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can insert any vaccine" ON vaccines
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update any vaccine" ON vaccines
    FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete any vaccine" ON vaccines
    FOR DELETE USING (is_admin());

-- Add admin policies for growth_records
CREATE POLICY "Admins can view all growth records" ON growth_records
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can insert any growth record" ON growth_records
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update any growth record" ON growth_records
    FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete any growth record" ON growth_records
    FOR DELETE USING (is_admin());

-- Add admin policies for chat_messages
CREATE POLICY "Admins can view all chat messages" ON chat_messages
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can insert any chat message" ON chat_messages
    FOR INSERT WITH CHECK (is_admin());

-- Verify the policies were created
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('baby_profiles', 'vaccines', 'growth_records', 'chat_messages')
ORDER BY tablename, policyname;
