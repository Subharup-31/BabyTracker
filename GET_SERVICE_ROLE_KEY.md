# How to Get Your Supabase Service Role Key

## Steps:

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Log in to your account

2. **Select Your Project**
   - Click on your BabyTracker project

3. **Navigate to API Settings**
   - Click on **Settings** (gear icon) in the left sidebar
   - Click on **API**

4. **Find the Service Role Key**
   - Scroll down to the "Project API keys" section
   - You'll see two keys:
     - `anon` `public` - This is what you already have
     - `service_role` `secret` - **This is what you need!**

5. **Copy the Service Role Key**
   - Click the copy button next to the `service_role` key
   - ⚠️ **IMPORTANT**: This key bypasses Row Level Security - keep it secret!

6. **Add to .env File**
   Open your `.env` file and replace this line:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
   
   With:
   ```
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (paste your actual key here)
   ```

7. **Restart the Server**
   - Stop the current server (Ctrl+C)
   - Run: `npm run dev`

8. **Test the Admin Portal**
   - Log in as admin
   - You should now see all baby profiles!

## Why Do We Need This?

The service role key allows the admin endpoints to bypass Row Level Security (RLS) policies in Supabase. This lets admins see ALL baby profiles across ALL users, not just their own.

The anon key (which you already have) respects RLS policies, so it only shows data that belongs to the logged-in user.
