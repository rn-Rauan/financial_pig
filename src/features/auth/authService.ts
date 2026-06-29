import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

/**
 * Auth actions built directly on supabase-js.
 *
 * There is intentionally no sign-up: the single app user is created manually in
 * Supabase Auth (see CLAUDE.md / quickstart.md).
 */

export interface SignInResult {
  /** Localized, user-safe error message; null on success. */
  error: string | null;
}

/** Sign in with email + password. Returns a clean message on failure. */
export async function signIn(email: string, password: string): Promise<SignInResult> {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) {
    // Do not expose internal details (UI Flow Contract: clear error only).
    return { error: "E-mail ou senha inválidos." };
  }
  return { error: null };
}

/** Sign out the current session. */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

/**
 * Ensure the authenticated user's baseline data exists (settings row + default
 * stock items) by calling the idempotent `inicializar_dados` RPC. Safe to call on
 * every login. The caller decides whether a failure should block the UI.
 */
export async function ensureUserData(): Promise<void> {
  const { error } = await supabase.rpc("inicializar_dados");
  if (error) throw new Error(error.message);
}

/** Read the current session once (used to bootstrap auth state). */
export async function getCurrentSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/**
 * Subscribe to auth state changes. Returns an unsubscribe function.
 */
export function onAuthChange(
  callback: (session: Session | null) => void,
): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return () => data.subscription.unsubscribe();
}

export type { Session, User };
