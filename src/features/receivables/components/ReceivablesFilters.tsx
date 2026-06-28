import type { Sale, SaleStatus, SaleType } from "@/features/sales/salesService";
import {
  SALE_TYPE_LABELS,
  SALE_TYPES,
  STATUS_LABELS,
} from "@/features/sales/saleConstants";

/** Filter state for the receivables list. */
export interface ReceivablesFilterValues {
  /** Matches customer name or product (case-insensitive). */
  busca: string;
  /** "" = all open statuses (partial + credit). */
  status: SaleStatus | "";
  tipo: SaleType | "";
  dataInicio: string; // YYYY-MM-DD or ""
  dataFim: string; // YYYY-MM-DD or ""
}

export const EMPTY_RECEIVABLES_FILTERS: ReceivablesFilterValues = {
  busca: "",
  status: "",
  tipo: "",
  dataInicio: "",
  dataFim: "",
};

/** Apply the filters to a list of receivables (client-side, MVP scale). */
export function applyReceivablesFilters(
  sales: Sale[],
  filters: ReceivablesFilterValues,
): Sale[] {
  const term = filters.busca.trim().toLowerCase();
  return sales.filter((sale) => {
    if (filters.status && sale.statusPagamento !== filters.status) return false;
    if (filters.tipo && sale.tipoVenda !== filters.tipo) return false;
    if (filters.dataInicio && sale.dataVenda < filters.dataInicio) return false;
    if (filters.dataFim && sale.dataVenda > filters.dataFim) return false;
    if (term) {
      const nome = (sale.clienteNome ?? sale.nomeCliente ?? "").toLowerCase();
      const produto = sale.produto.toLowerCase();
      if (!nome.includes(term) && !produto.includes(term)) return false;
    }
    return true;
  });
}

interface ReceivablesFiltersProps {
  value: ReceivablesFilterValues;
  onChange: (value: ReceivablesFilterValues) => void;
}

const inputClass =
  "rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

/** Filter controls for receivables (customer/name, status, type, date range). */
export function ReceivablesFilters({ value, onChange }: ReceivablesFiltersProps) {
  function update<K extends keyof ReceivablesFilterValues>(
    key: K,
    next: ReceivablesFilterValues[K],
  ) {
    onChange({ ...value, [key]: next });
  }

  const hasFilters =
    value.busca !== "" ||
    value.status !== "" ||
    value.tipo !== "" ||
    value.dataInicio !== "" ||
    value.dataFim !== "";

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-white p-3 shadow-sm">
      <input
        type="text"
        placeholder="Buscar por cliente ou produto"
        value={value.busca}
        onChange={(e) => update("busca", e.target.value)}
        className={inputClass}
      />

      <div className="grid grid-cols-2 gap-2">
        <select
          value={value.status}
          onChange={(e) => update("status", e.target.value as SaleStatus | "")}
          className={inputClass}
        >
          <option value="">Todos os status</option>
          <option value="parcial">{STATUS_LABELS.parcial}</option>
          <option value="fiado">{STATUS_LABELS.fiado}</option>
        </select>

        <select
          value={value.tipo}
          onChange={(e) => update("tipo", e.target.value as SaleType | "")}
          className={inputClass}
        >
          <option value="">Todos os tipos</option>
          {SALE_TYPES.map((t) => (
            <option key={t} value={t}>
              {SALE_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

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
          onClick={() => onChange(EMPTY_RECEIVABLES_FILTERS)}
          className="self-start text-sm text-brand"
        >
          Limpar filtros
        </button>
      ) : null}
    </div>
  );
}

export default ReceivablesFilters;
