-- SQL Script to Set a User as Admin in Supabase
-- Run this in your Supabase SQL Editor

-- Option 1: Set admin by email address
-- Replace 'admin@example.com' with the actual email
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'admin@example.com';

-- Option 2: Set admin by user ID
-- Replace 'user-uuid-here' with the actual user ID
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE id = 'user-uuid-here';

-- Verify the admin role was set correctly
-- This will show all users with their metadata
SELECT id, email, raw_user_meta_data
FROM auth.users
WHERE email = 'admin@example.com';

-- To remove admin role from a user (if needed)
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data - 'role'
WHERE email = 'admin@example.com';
