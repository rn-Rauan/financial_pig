import { AppShell } from "@/app/AppShell";

// Routing and providers are wired in later phases (US1 auth, US2 dashboard).
// For now App renders the shell with a placeholder so the skeleton runs.
export default function App() {
  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <p className="text-4xl">🐷</p>
        <h1 className="text-xl font-semibold">Financial Pig</h1>
        <p className="text-sm text-gray-500">
          Estrutura base pronta. As telas serão adicionadas nas próximas fases.
        </p>
      </div>
    </AppShell>
  );
}
