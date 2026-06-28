import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getCurrentSession,
  onAuthChange,
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
