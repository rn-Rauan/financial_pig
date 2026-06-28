import { NavLink } from "react-router-dom";

interface NavItem {
  label: string;
  icon: string;
  to: string;
}

// Navigation Contract (contracts/ui-flows.md). All tabs are now implemented.
const ITEMS: NavItem[] = [
  { label: "Início", icon: "🏠", to: "/" },
  { label: "Vendas", icon: "🧾", to: "/vendas" },
  { label: "Estoque", icon: "📦", to: "/estoque" },
  { label: "Relatórios", icon: "📊", to: "/relatorios" },
  { label: "Perfil", icon: "👤", to: "/perfil" },
];

export function BottomNav() {
  return (
    <ul className="flex items-stretch justify-around">
      {ITEMS.map((item) => (
        <li key={item.label} className="flex-1">
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
        </li>
      ))}
    </ul>
  );
}

export default BottomNav;
