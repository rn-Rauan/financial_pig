import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
}

/**
 * Mobile-first application shell. Provides the centered, phone-width container,
 * a top bar, and a content area. Navigation is added in later phases.
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white shadow-sm">
      <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-gray-100 bg-brand px-4 py-3 text-white">
        <span aria-hidden className="text-xl">
          🐷
        </span>
        <span className="font-semibold">Financial Pig</span>
      </header>
      <main className="flex-1 px-4 py-4">{children}</main>
    </div>
  );
}

export default AppShell;
