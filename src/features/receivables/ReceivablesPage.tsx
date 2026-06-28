import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { formatCurrency, formatDate } from "@/lib/format";
import { sumMoney } from "@/lib/calculations/financial";
import { listReceivables } from "@/features/receivables/receivablesService";
import type { Sale } from "@/features/sales/salesService";
import { SALE_TYPE_LABELS } from "@/features/sales/saleConstants";
import { StatusBadge } from "@/features/sales/components/StatusBadge";
import {
  ReceivablesFilters,
  applyReceivablesFilters,
  EMPTY_RECEIVABLES_FILTERS,
  type ReceivablesFilterValues,
} from "@/features/receivables/components/ReceivablesFilters";

type Status = "loading" | "error" | "ready";

export function ReceivablesPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("loading");
  const [sales, setSales] = useState<Sale[]>([]);
  const [filters, setFilters] = useState<ReceivablesFilterValues>(
    EMPTY_RECEIVABLES_FILTERS,
  );

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      setSales(await listReceivables());
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(
    () => applyReceivablesFilters(sales, filters),
    [sales, filters],
  );

  const totalAReceber = useMemo(
    () => sumMoney(filtered.map((s) => s.valorRestante)),
    [filtered],
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-gray-900">Contas a receber</h1>

      {status === "loading" ? (
        <LoadingState message="Carregando recebíveis..." />
      ) : null}

      {status === "error" ? (
        <ErrorState
          message="Não foi possível carregar os recebíveis."
          onRetry={() => void load()}
        />
      ) : null}

      {status === "ready" && sales.length === 0 ? (
        <EmptyState
          title="Nenhuma conta a receber"
          description="Vendas fiado ou parciais aparecem aqui até serem quitadas."
        />
      ) : null}

      {status === "ready" && sales.length > 0 ? (
        <>
          <ReceivablesFilters value={filters} onChange={setFilters} />

          <div className="flex items-center justify-between rounded-xl bg-brand/10 px-4 py-3">
            <span className="text-sm font-medium text-brand-dark">
              Total a receber
            </span>
            <span className="text-lg font-bold text-brand-dark">
              {formatCurrency(totalAReceber)}
            </span>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              title="Nada encontrado"
              description="Ajuste os filtros para ver outras contas."
            />
          ) : (
            <ul className="flex flex-col gap-2">
              {filtered.map((sale) => (
                <li key={sale.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/recebiveis/${sale.id}/pagar`)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl bg-white p-3 text-left shadow-sm active:bg-gray-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-900">
                        {sale.clienteNome ?? sale.nomeCliente ?? "Sem cliente"}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {sale.produto} · {SALE_TYPE_LABELS[sale.tipoVenda]} ·{" "}
                        {formatDate(sale.dataVenda)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(sale.valorRestante)}
                      </span>
                      <StatusBadge status={sale.statusPagamento} />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}
    </div>
  );
}

export default ReceivablesPage;
