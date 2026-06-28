import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { RequireAuth, RequireGuest } from "@/routes/guards";
import { LoadingState } from "@/components/LoadingState";
import { ProtectedLayout } from "@/app/ProtectedLayout";
import { LoginPage } from "@/features/auth/LoginPage";
import { ProfilePage } from "@/features/profile/ProfilePage";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { SalesListPage } from "@/features/sales/SalesListPage";
import { SaleFormPage } from "@/features/sales/SaleFormPage";
import { SaleDetailPage } from "@/features/sales/SaleDetailPage";

const sessionFallback = (
  <div className="flex min-h-screen items-center justify-center">
    <LoadingState message="Carregando sessão..." />
  </div>
);

/** Wraps the shared guards with live auth state from the AuthProvider. */
function Protected({ children }: { children: ReactNode }) {
  const { loading, isAuthenticated } = useAuth();
  return (
    <RequireAuth
      loading={loading}
      isAuthenticated={isAuthenticated}
      fallback={sessionFallback}
    >
      {children}
    </RequireAuth>
  );
}

function GuestOnly({ children }: { children: ReactNode }) {
  const { loading, isAuthenticated } = useAuth();
  return (
    <RequireGuest
      loading={loading}
      isAuthenticated={isAuthenticated}
      fallback={sessionFallback}
    >
      {children}
    </RequireGuest>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestOnly>
            <LoginPage />
          </GuestOnly>
        }
      />

      <Route
        element={
          <Protected>
            <ProtectedLayout />
          </Protected>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="vendas" element={<SalesListPage />} />
        <Route path="vendas/nova" element={<SaleFormPage />} />
        <Route path="vendas/:id" element={<SaleDetailPage />} />
        <Route path="perfil" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
