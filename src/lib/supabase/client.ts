import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/config/env";

/**
 * Shared Supabase browser client. Supabase is the source of truth; this single
 * instance is reused across the app so the auth session is consistent.
 *
 * A generated `Database` type can be added later and passed as the first type
 * argument to `createClient<Database>` for end-to-end typed queries.
 */
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
