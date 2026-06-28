import { Outlet } from "react-router-dom";
import { AppShell } from "@/app/AppShell";
import { BottomNav } from "@/app/BottomNav";

/** Layout for authenticated routes: shell + bottom navigation + nested route. */
export function ProtectedLayout() {
  return (
    <AppShell nav={<BottomNav />}>
      <Outlet />
    </AppShell>
  );
}

export default ProtectedLayout;
