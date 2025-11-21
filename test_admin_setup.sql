-- Test Admin Setup
-- Run this to verify everything is configured correctly

-- 1. Check if the is_admin function exists
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'is_admin';

-- 2. Check if admin policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE policyname LIKE '%Admin%' OR policyname LIKE '%admin%'
ORDER BY tablename;

-- 3. Check your user's metadata
SELECT 
    email, 
    raw_user_meta_data,
    raw_user_meta_data->>'role' as role
FROM auth.users 
WHERE email = 'yusrarahmath2@gmail.com';

-- 4. Test if you can see baby profiles (run this while logged in as admin)
-- This should return all baby profiles if admin setup is correct
SELECT id, baby_name, birth_date, gender 
FROM baby_profiles 
ORDER BY created_at DESC;

-- 5. If the above returns nothing, manually check the data exists
SELECT COUNT(*) as total_babies FROM baby_profiles;
