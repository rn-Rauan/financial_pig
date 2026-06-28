import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Shared route guard utilities.
 *
 * The concrete auth state hook is provided by the auth feature (US1). To keep
 * this module independent of that not-yet-built provider, guards accept the
 * auth status as props. AppRoutes will wire them to the real AuthProvider.
 */

export interface GuardAuthState {
  /** True while the session is still being resolved. */
  loading: boolean;
  /** True when there is an authenticated session. */
  isAuthenticated: boolean;
}

interface RequireAuthProps extends GuardAuthState {
  children: ReactNode;
  /** Where to send unauthenticated users. */
  redirectTo?: string;
  /** Optional element shown while auth is resolving. */
  fallback?: ReactNode;
}

/** Renders children only when authenticated; otherwise redirects to login. */
export function RequireAuth({
  loading,
  isAuthenticated,
  children,
  redirectTo = "/login",
  fallback = null,
}: RequireAuthProps) {
  const location = useLocation();
  if (loading) return <>{fallback}</>;
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }
  return <>{children}</>;
}

interface RequireGuestProps extends GuardAuthState {
  children: ReactNode;
  /** Where to send already-authenticated users (e.g. the dashboard). */
  redirectTo?: string;
  fallback?: ReactNode;
}

/** Renders children only when NOT authenticated (e.g. the login page). */
export function RequireGuest({
  loading,
  isAuthenticated,
  children,
  redirectTo = "/",
  fallback = null,
}: RequireGuestProps) {
  if (loading) return <>{fallback}</>;
  if (isAuthenticated) return <Navigate to={redirectTo} replace />;
  return <>{children}</>;
}
