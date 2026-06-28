import type { HistoryEntry, HistoryType } from "@/features/reports/reportsService";
import {
  HISTORY_TYPES,
  HISTORY_TYPE_LABELS,
} from "@/features/reports/reportConstants";

/** Filter state for the history screen. */
export interface HistoryFilterValues {
  busca: string;
  tipo: HistoryType | "";
  dataInicio: string; // YYYY-MM-DD or ""
  dataFim: string; // YYYY-MM-DD or ""
}

export const EMPTY_HISTORY_FILTERS: HistoryFilterValues = {
  busca: "",
  tipo: "",
  dataInicio: "",
  dataFim: "",
};

/** Apply the filters to history entries (client-side, MVP scale). */
export function applyHistoryFilters(
  entries: HistoryEntry[],
  filters: HistoryFilterValues,
): HistoryEntry[] {
  const term = filters.busca.trim().toLowerCase();
  return entries.filter((entry) => {
    if (filters.tipo && entry.tipo !== filters.tipo) return false;
    // data_evento is a timestamp; compare on its date prefix.
    const day = entry.dataEvento.slice(0, 10);
    if (filters.dataInicio && day < filters.dataInicio) return false;
    if (filters.dataFim && day > filters.dataFim) return false;
    if (term && !entry.descricao.toLowerCase().includes(term)) return false;
    return true;
  });
}

interface ReportFiltersProps {
  value: HistoryFilterValues;
  onChange: (value: HistoryFilterValues) => void;
}

const inputClass =
  "rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

/** Cross-module search/filter UI for history (text, type, date range). */
export function ReportFilters({ value, onChange }: ReportFiltersProps) {
  function update<K extends keyof HistoryFilterValues>(
    key: K,
    next: HistoryFilterValues[K],
  ) {
    onChange({ ...value, [key]: next });
  }

  const hasFilters =
    value.busca !== "" ||
    value.tipo !== "" ||
    value.dataInicio !== "" ||
    value.dataFim !== "";

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-white p-3 shadow-sm">
      <input
        type="text"
        placeholder="Buscar na descrição"
        value={value.busca}
        onChange={(e) => update("busca", e.target.value)}
        className={inputClass}
      />

      <select
        value={value.tipo}
        onChange={(e) => update("tipo", e.target.value as HistoryType | "")}
        className={inputClass}
      >
        <option value="">Todos os tipos</option>
        {HISTORY_TYPES.map((t) => (
          <option key={t} value={t}>
            {HISTORY_TYPE_LABELS[t]}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1 text-xs text-gray-500">
          De
          <input
            type="date"
            value={value.dataInicio}
            onChange={(e) => update("dataInicio", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-gray-500">
          Até
          <input
            type="date"
            value={value.dataFim}
            onChange={(e) => update("dataFim", e.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      {hasFilters ? (
        <button
          type="button"
          onClick={() => onChange(EMPTY_HISTORY_FILTERS)}
          className="self-start text-sm text-brand"
        >
          Limpar filtros
        </button>
      ) : null}
    </div>
  );
}

export default ReportFilters;
