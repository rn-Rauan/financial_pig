import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { formatCurrency, formatDate, formatQuantity } from "@/lib/format";
import { listPurchases, type Purchase } from "@/features/purchases/purchasesService";
import { PURCHASE_TYPE_LABELS } from "@/features/stock/stockConstants";
import { UNIT_LABELS } from "@/features/sales/saleConstants";

type Status = "loading" | "error" | "ready";

export function PurchasesListPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      setPurchases(await listPurchases());
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
        <h1 className="text-xl font-semibold text-gray-900">Compras</h1>
        <Link
          to="/compras/nova"
          className="rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white active:bg-brand-dark"
        >
          + Nova compra
        </Link>
      </div>

      {status === "loading" ? <LoadingState message="Carregando compras..." /> : null}

      {status === "error" ? (
        <ErrorState
          message="Não foi possível carregar as compras."
          onRetry={() => void load()}
        />
      ) : null}

      {status === "ready" && purchases.length === 0 ? (
        <EmptyState
          title="Nenhuma compra registrada"
          description="Toque em “+ Nova compra” para registrar a primeira."
        />
      ) : null}

      {status === "ready" && purchases.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {purchases.map((purchase) => (
            <li key={purchase.id}>
              <div className="flex items-center justify-between gap-3 rounded-xl bg-white p-3 shadow-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900">
                    {purchase.produto}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {PURCHASE_TYPE_LABELS[purchase.tipoCompra]} ·{" "}
                    {formatQuantity(purchase.quantidade)}{" "}
                    {UNIT_LABELS[purchase.unidade]} · {formatDate(purchase.dataCompra)}
                  </p>
                </div>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(purchase.valorTotal)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default PurchasesListPage;
