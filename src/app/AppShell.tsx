import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
  /** Optional sticky bottom navigation rendered below the content area. */
  nav?: ReactNode;
}

/**
 * Mobile-first application shell. Provides the centered, phone-width container,
 * a top bar, a content area, and an optional sticky bottom navigation.
 */
export function AppShell({ children, nav }: AppShellProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white shadow-sm">
      <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-gray-100 bg-brand px-4 py-3 text-white">
        <span aria-hidden className="text-xl">
          🐷
        </span>
        <span className="font-semibold">Financial Pig</span>
      </header>
      <main className={"flex-1 px-4 py-4" + (nav ? " pb-20" : "")}>{children}</main>
      {nav ? (
        <nav className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-md border-t border-gray-100 bg-white">
          {nav}
        </nav>
      ) : null}
    </div>
  );
}

export default AppShell;
