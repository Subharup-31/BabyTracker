# Supabase Setup Instructions

## Migration Complete! 

Your BabyTracker app now uses **100% Supabase** - including Supabase Auth for authentication!

## What Was Changed:

### Removed:
- ❌ NeonDB dependencies (`@neondatabase/serverless`, `ws`)
- ❌ Drizzle ORM (`drizzle-orm`, `drizzle-zod`, `drizzle-kit`)
- ❌ Custom auth with bcrypt and sessions
- ❌ Express sessions (`express-session`, `connect-pg-simple`)
- ❌ Passport.js authentication
- ❌ Custom users table

### Added/Updated:
- ✅ Supabase client (`@supabase/supabase-js`)
- ✅ **Supabase Auth** for authentication (email/password, social login ready)
- ✅ JWT token-based authentication
- ✅ Pure Zod schemas (no Drizzle dependencies)
- ✅ Supabase-compatible database queries
- ✅ Complete SQL schema file for Supabase
- ✅ Row Level Security policies integrated with auth.uid()

## Setup Steps:

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create an account
2. Click "New Project"
3. Fill in project details and create

### 2. Run SQL Schema
1. In your Supabase dashboard, go to SQL Editor
2. Copy the entire contents of `supabase_schema.sql`
3. Paste and run it to create all tables

**Note:** The schema uses `auth.users` (Supabase's built-in auth table) - no custom users table needed!

### 3. Get Your Credentials
1. Go to Project Settings → API
2. Copy your:
   - Project URL
   - anon/public key

### 4. Configure Environment
1. Copy `.env.example` to `.env`
2. Add your Supabase credentials:
```
SUPABASE_URL=your_project_url
SUPABASE_KEY=your_anon_key
```

**No SESSION_SECRET needed** - Supabase Auth handles sessions with JWT!

### 5. Install Dependencies & Run
```bash
npm install
npm run dev
```

## Key Changes in Code:

- **Authentication**: Now using **Supabase Auth** instead of custom bcrypt/sessions
  - Signup/Login endpoints use Supabase Auth API
  - JWT tokens instead of session cookies
  - Frontend must send `Authorization: Bearer <token>` header
- **Database Client**: Using `supabase` from `server/db.ts`
- **Schema Types**: All types defined with Zod (no Drizzle)
- **Queries**: Direct Supabase queries (`.from()`, `.select()`, `.insert()`, etc.)
- **Row Level Security**: Policies use `auth.uid()` for automatic user isolation

## Database Tables:
- ~~`users`~~ - **Managed by Supabase Auth** (`auth.users`)
- `baby_profiles` - Baby information
- `vaccines` - Vaccine tracking
- `growth_records` - Growth measurements
- `chat_messages` - AI chat history

## Authentication Flow:

### Signup:
```javascript
POST /api/auth/signup
Body: { email, password }
Response: { user, session }
```

### Login:
```javascript
POST /api/auth/login  
Body: { email, password }
Response: { user, session }
```

### Authenticated Requests:
```javascript
Headers: { Authorization: 'Bearer <session.access_token>' }
```

### Logout:
```javascript
POST /api/auth/logout
Headers: { Authorization: 'Bearer <token>' }
```

## Supabase Auth Features Available:
- ✅ Email/Password authentication
- ✅ Email verification (configure in Supabase dashboard)
- ✅ Password reset flows
- ✅ Social logins (Google, GitHub, etc.) - just enable in dashboard
- ✅ Magic links
- ✅ JWT tokens with automatic refresh
- ✅ Row Level Security integration

## Next Steps:
- Run the SQL schema in Supabase
- Configure your `.env` file
- Start developing with Supabase!