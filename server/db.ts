import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "SUPABASE_URL and SUPABASE_KEY must be set. Did you forget to provision a Supabase database?",
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Create admin client with service role key (bypasses RLS)
console.log("🔑 Service Role Key status:", supabaseServiceRoleKey ? "SET" : "NOT SET");
if (supabaseServiceRoleKey) {
  console.log("🔑 Service Role Key length:", supabaseServiceRoleKey.length);
  console.log("🔑 Service Role Key starts with:", supabaseServiceRoleKey.substring(0, 20) + "...");
}

export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : supabase; // Fallback to regular client if service role key not set

// Create a client with a specific user's auth token for RLS
export function createUserSupabaseClient(accessToken: string): SupabaseClient {
  return createClient(supabaseUrl!, supabaseKey!, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}