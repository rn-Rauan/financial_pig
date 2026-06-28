import { NavLink } from "react-router-dom";

interface NavItem {
  label: string;
  icon: string;
  to?: string;
  /** Disabled tabs are shown for the navigation contract but not yet built. */
  disabled?: boolean;
}

// Navigation Contract (contracts/ui-flows.md). Vendas / Estoque / Relatorios
// arrive in later phases (US3, US5, US7); they are shown disabled for now so the
// tab bar matches the contract without dead links or fabricated screens.
const ITEMS: NavItem[] = [
  { label: "Início", icon: "🏠", to: "/" },
  { label: "Vendas", icon: "🧾", disabled: true },
  { label: "Estoque", icon: "📦", disabled: true },
  { label: "Relatórios", icon: "📊", disabled: true },
  { label: "Perfil", icon: "👤", to: "/perfil" },
];

export function BottomNav() {
  return (
    <ul className="flex items-stretch justify-around">
      {ITEMS.map((item) => (
        <li key={item.label} className="flex-1">
          {item.disabled || !item.to ? (
            <span
              aria-disabled
              title="Em breve"
              className="flex flex-col items-center gap-0.5 py-2 text-[11px] text-gray-300"
            >
              <span aria-hidden className="text-lg">
                {item.icon}
              </span>
              {item.label}
            </span>
          ) : (
            <NavLink
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                "flex flex-col items-center gap-0.5 py-2 text-[11px] " +
                (isActive ? "text-brand" : "text-gray-500")
              }
            >
              <span aria-hidden className="text-lg">
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          )}
        </li>
      ))}
    </ul>
  );
}

export default BottomNav;
