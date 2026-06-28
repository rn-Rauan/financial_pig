import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { formatCurrency, formatDate } from "@/lib/format";
import { listSales, type Sale } from "@/features/sales/salesService";
import { SALE_TYPE_LABELS } from "@/features/sales/saleConstants";
import { StatusBadge } from "@/features/sales/components/StatusBadge";

type Status = "loading" | "error" | "ready";

export function SalesListPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("loading");
  const [sales, setSales] = useState<Sale[]>([]);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      setSales(await listSales());
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Vendas</h1>
        <Link
          to="/vendas/nova"
          className="rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white active:bg-brand-dark"
        >
          + Nova venda
        </Link>
      </div>

      <Link
        to="/recebiveis"
        className="flex items-center justify-between rounded-xl bg-white p-3 text-sm font-medium text-brand-dark shadow-sm active:bg-gray-50"
      >
        Contas a receber
        <span aria-hidden>›</span>
      </Link>

      {status === "loading" ? <LoadingState message="Carregando vendas..." /> : null}

      {status === "error" ? (
        <ErrorState
          message="Não foi possível carregar as vendas."
          onRetry={() => void load()}
        />
      ) : null}

      {status === "ready" && sales.length === 0 ? (
        <EmptyState
          title="Nenhuma venda registrada"
          description="Toque em “+ Nova venda” para registrar a primeira."
        />
      ) : null}

      {status === "ready" && sales.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {sales.map((sale) => (
            <li key={sale.id}>
              <button
                type="button"
                onClick={() => navigate(`/vendas/${sale.id}`)}
                className="flex w-full items-center justify-between gap-3 rounded-xl bg-white p-3 text-left shadow-sm active:bg-gray-50"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900">
                    {sale.produto}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {SALE_TYPE_LABELS[sale.tipoVenda]} ·{" "}
                    {sale.clienteNome ?? sale.nomeCliente ?? "Sem cliente"} ·{" "}
                    {formatDate(sale.dataVenda)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(sale.valorTotal)}
                  </span>
                  <StatusBadge status={sale.statusPagamento} />
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default SalesListPage;
