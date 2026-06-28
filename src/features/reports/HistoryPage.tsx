import { useCallback, useEffect, useMemo, useState } from "react";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { formatCurrency, formatDateTime, formatQuantity } from "@/lib/format";
import { listHistory, type HistoryEntry } from "@/features/reports/reportsService";
import { HISTORY_TYPE_LABELS } from "@/features/reports/reportConstants";
import { ReportTabs } from "@/features/reports/components/ReportTabs";
import {
  ReportFilters,
  applyHistoryFilters,
  EMPTY_HISTORY_FILTERS,
  type HistoryFilterValues,
} from "@/features/reports/components/ReportFilters";

type Status = "loading" | "error" | "ready";

export function HistoryPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [filters, setFilters] = useState<HistoryFilterValues>(EMPTY_HISTORY_FILTERS);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      setEntries(await listHistory());
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(
    () => applyHistoryFilters(entries, filters),
    [entries, filters],
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-gray-900">Relatórios</h1>
      <ReportTabs />

      {status === "loading" ? <LoadingState message="Carregando histórico..." /> : null}
      {status === "error" ? <ErrorState onRetry={() => void load()} /> : null}

      {status === "ready" && entries.length === 0 ? (
        <EmptyState
          title="Sem histórico ainda"
          description="As operações registradas aparecem aqui."
        />
      ) : null}

      {status === "ready" && entries.length > 0 ? (
        <>
          <ReportFilters value={filters} onChange={setFilters} />

          {filtered.length === 0 ? (
            <EmptyState
              title="Nada encontrado"
              description="Ajuste os filtros para ver outros eventos."
            />
          ) : (
            <ul className="flex flex-col gap-2">
              {filtered.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-start justify-between gap-3 rounded-xl bg-white p-3 shadow-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {entry.descricao}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {HISTORY_TYPE_LABELS[entry.tipo]} ·{" "}
                      {formatDateTime(entry.dataEvento)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    {entry.valor !== null ? (
                      <span className="block text-sm font-semibold text-gray-900">
                        {formatCurrency(entry.valor)}
                      </span>
                    ) : null}
                    {entry.quantidade !== null ? (
                      <span className="block text-xs text-gray-500">
                        {formatQuantity(entry.quantidade)}
                      </span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}
    </div>
  );
}

export default HistoryPage;
