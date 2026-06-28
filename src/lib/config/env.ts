/**
 * Typed, validated access to environment variables.
 *
 * Only `VITE_`-prefixed variables are exposed to the client by Vite. We fail
 * fast with a clear message if a required Supabase value is missing so
 * misconfiguration is caught at startup rather than as an opaque runtime error.
 */

interface AppEnv {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

function requireEnv(key: string, value: string | undefined): string {
  if (!value || value.trim().length === 0) {
    throw new Error(
      `Missing required environment variable "${key}". ` +
        `Copy .env.example to .env.local and fill the Supabase values.`,
    );
  }
  return value;
}

export const env: AppEnv = {
  supabaseUrl: requireEnv("VITE_SUPABASE_URL", import.meta.env.VITE_SUPABASE_URL),
  supabaseAnonKey: requireEnv(
    "VITE_SUPABASE_ANON_KEY",
    import.meta.env.VITE_SUPABASE_ANON_KEY,
  ),
};
