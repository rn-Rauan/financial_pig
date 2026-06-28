import { Link } from "react-router-dom";

// Dashboard shortcuts (contracts/ui-flows.md: + Venda, + Compra, + Despesa).
// Gasto fixo is added so fixed/construction costs are reachable too.
const SHORTCUTS = [
  { to: "/vendas/nova", icon: "🧾", label: "Venda" },
  { to: "/compras/nova", icon: "🛒", label: "Compra" },
  { to: "/despesas", icon: "💊", label: "Despesa" },
  { to: "/gastos-fixos", icon: "🧱", label: "Gasto fixo" },
];

/** Quick-add shortcuts shown at the top of the dashboard. */
export function DashboardShortcuts() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {SHORTCUTS.map((s) => (
        <Link
          key={s.to}
          to={s.to}
          className="flex flex-col items-center gap-1 rounded-xl bg-white p-2 text-center text-[11px] font-medium text-gray-700 shadow-sm active:bg-gray-50"
        >
          <span aria-hidden className="text-lg">
            {s.icon}
          </span>
          {s.label}
        </Link>
      ))}
    </div>
  );
}

export default DashboardShortcuts;
