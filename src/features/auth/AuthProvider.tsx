import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  getCurrentSession,
  onAuthChange,
  ensureUserData,
  signIn as signInAction,
  signOut as signOutAction,
  type Session,
  type User,
} from "@/features/auth/authService";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  /** True while the initial session is being resolved. */
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [seedRetry, setSeedRetry] = useState(0);
  const seededFor = useRef<string | null>(null);
  const seedingFor = useRef<string | null>(null);
  const seedFailures = useRef<Record<string, number>>({});

  // Seed per-user baseline data (settings + default stock items) once per
  // authenticated user. Idempotent on the server; only mark success after the
  // RPC completes so a failed seed can retry without blocking app access.
  useEffect(() => {
    const userId = session?.user.id ?? null;
    if (!userId) {
      seedingFor.current = null;
      return;
    }
    if (seededFor.current === userId || seedingFor.current === userId) return;

    let active = true;
    let retryTimer: number | undefined;
    seedingFor.current = userId;

    void ensureUserData()
      .then(() => {
        if (!active) return;
        seededFor.current = userId;
        seedFailures.current[userId] = 0;
      })
      .catch(() => {
        if (!active) return;
        const failures = (seedFailures.current[userId] ?? 0) + 1;
        seedFailures.current[userId] = failures;
        if (failures <= 3) {
          retryTimer = window.setTimeout(() => {
            setSeedRetry((value) => value + 1);
          }, 3000);
        }
      })
      .finally(() => {
        if (active && seedingFor.current === userId) {
          seedingFor.current = null;
        }
      });

    return () => {
      active = false;
      if (retryTimer !== undefined) window.clearTimeout(retryTimer);
    };
  }, [session, seedRetry]);

  useEffect(() => {
    let active = true;

    getCurrentSession()
      .then((current) => {
        if (active) setSession(current);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    const unsubscribe = onAuthChange((next) => {
      if (active) setSession(next);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      isAuthenticated: session !== null,
      signIn: signInAction,
      signOut: signOutAction,
    }),
    [session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
