import { NavLink } from "react-router-dom";

const TABS = [
  { to: "/relatorios", label: "Resumo", end: true },
  { to: "/relatorios/porcos", label: "Porcos", end: false },
  { to: "/relatorios/historico", label: "Histórico", end: false },
];

/** Sub-navigation shared by the report screens. */
export function ReportTabs() {
  return (
    <div className="flex gap-2">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            "flex-1 rounded-lg px-3 py-2 text-center text-sm font-medium " +
            (isActive ? "bg-brand text-white" : "bg-white text-gray-600 shadow-sm")
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}

export default ReportTabs;
