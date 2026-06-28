import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { formatQuantity } from "@/lib/format";
import { isBelowMinimum } from "@/lib/calculations/stock";
import { listStockItems, type StockItem } from "@/features/stock/stockService";
import { UNIT_LABELS } from "@/features/sales/saleConstants";

type Status = "loading" | "error" | "ready";

export function StockPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [items, setItems] = useState<StockItem[]>([]);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      setItems(await listStockItems());
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
      <h1 className="text-xl font-semibold text-gray-900">Estoque</h1>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-2">
        <ActionLink to="/compras/nova" icon="🛒" label="Nova compra" />
        <ActionLink to="/estoque/movimentar" icon="🔁" label="Movimentar" />
        <ActionLink to="/estoque/consumo" icon="🌽" label="Consumo" />
      </div>
      <Link to="/compras" className="text-sm text-brand">
        Ver compras registradas ›
      </Link>

      {status === "loading" ? <LoadingState message="Carregando estoque..." /> : null}

      {status === "error" ? (
        <ErrorState
          message="Não foi possível carregar o estoque."
          onRetry={() => void load()}
        />
      ) : null}

      {status === "ready" && items.length === 0 ? (
        <EmptyState
          title="Nenhum item de estoque"
          description="Os itens são criados no Supabase (porcos, milho, ração)."
        />
      ) : null}

      {status === "ready" && items.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {items.map((item) => {
            const low = isBelowMinimum(item.quantidadeAtual, item.estoqueMinimo);
            return (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-white p-3 shadow-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900">{item.nome}</p>
                  {low ? (
                    <span className="inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                      Abaixo do mínimo
                    </span>
                  ) : null}
                </div>
                <span className="font-semibold text-gray-900">
                  {formatQuantity(item.quantidadeAtual)} {UNIT_LABELS[item.unidade]}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function ActionLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: string;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-1 rounded-xl bg-white p-3 text-center text-xs font-medium text-gray-700 shadow-sm active:bg-gray-50"
    >
      <span aria-hidden className="text-xl">
        {icon}
      </span>
      {label}
    </Link>
  );
}

export default StockPage;
