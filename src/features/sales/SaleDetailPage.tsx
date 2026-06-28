import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { InactivateButton } from "@/components/InactivateButton";
import { formatCurrency, formatDate, formatNumber, formatQuantity } from "@/lib/format";
import {
  getSale,
  getSaleStockMovements,
  type Sale,
  type SaleStockMovement,
} from "@/features/sales/salesService";
import { SALE_TYPE_LABELS, UNIT_LABELS } from "@/features/sales/saleConstants";
import { StatusBadge } from "@/features/sales/components/StatusBadge";

type Status = "loading" | "error" | "notfound" | "ready";

export function SaleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("loading");
  const [sale, setSale] = useState<Sale | null>(null);
  const [movements, setMovements] = useState<SaleStockMovement[]>([]);

  const load = useCallback(async () => {
    if (!id) return;
    setStatus("loading");
    try {
      const found = await getSale(id);
      if (!found) {
        setStatus("notfound");
        return;
      }
      setSale(found);
      setMovements(await getSaleStockMovements(id));
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Link to="/vendas" className="text-sm text-brand">
          ‹ Vendas
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Detalhe da venda</h1>
      </div>

      {status === "loading" ? <LoadingState /> : null}
      {status === "error" ? (
        <ErrorState onRetry={() => void load()} />
      ) : null}
      {status === "notfound" ? (
        <EmptyState
          title="Venda não encontrada"
          description="O registro pode ter sido inativado."
        />
      ) : null}

      {status === "ready" && sale ? (
        <>
          {/* Header */}
          <section className="flex flex-col gap-1 rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <p className="text-lg font-semibold text-gray-900">{sale.produto}</p>
              <StatusBadge status={sale.statusPagamento} />
            </div>
            <p className="text-sm text-gray-500">
              {SALE_TYPE_LABELS[sale.tipoVenda]} · {formatDate(sale.dataVenda)}
            </p>
            <p className="text-sm text-gray-500">
              Cliente: {sale.clienteNome ?? sale.nomeCliente ?? "Sem cliente"}
            </p>
          </section>

          {/* Items */}
          <Section title="Itens">
            <Row label="Quantidade">
              {formatQuantity(sale.quantidade)} {UNIT_LABELS[sale.unidade]}
            </Row>
            <Row label="Preço unitário">{formatCurrency(sale.precoUnitario)}</Row>
            {sale.tipoVenda === "porco_carne" ? (
              <Row label="Animais utilizados">
                {sale.animaisUtilizados ?? "—"}
              </Row>
            ) : null}
          </Section>

          {/* Financial effect */}
          <Section title="Efeito financeiro">
            <Row label="Total">{formatCurrency(sale.valorTotal)}</Row>
            <Row label="Pago">{formatCurrency(sale.valorPago)}</Row>
            <Row label="Restante (a receber)">
              {formatCurrency(sale.valorRestante)}
            </Row>
            {sale.tipoVenda === "porco_carne" && (sale.animaisUtilizados ?? 0) > 0 ? (
              <>
                <Row label="Kg por cabeça">
                  {formatNumber(sale.quantidade / (sale.animaisUtilizados as number))} kg
                </Row>
                <Row label="Valor por cabeça">
                  {formatCurrency(
                    sale.valorTotal / (sale.animaisUtilizados as number),
                  )}
                </Row>
              </>
            ) : null}
          </Section>

          {/* Stock effect */}
          <Section title="Efeito no estoque">
            {movements.length === 0 ? (
              <p className="text-sm text-gray-500">
                Esta venda não movimentou estoque.
              </p>
            ) : (
              movements.map((m) => (
                <Row key={m.id} label={m.itemNome ?? "Item"}>
                  − {formatQuantity(m.quantidade)}{" "}
                  {m.unidade ? UNIT_LABELS[m.unidade] : ""} ({m.tipoMovimentacao})
                </Row>
              ))
            )}
          </Section>

          {sale.observacao ? (
            <Section title="Observação">
              <p className="text-sm text-gray-700">{sale.observacao}</p>
            </Section>
          ) : null}

          <div className="flex justify-end pt-2">
            <InactivateButton
              entidade="vendas"
              registroId={sale.id}
              label="Inativar venda"
              confirmMessage="A venda será inativada e o estoque baixado será devolvido. Pagamentos vinculados também serão inativados. Deseja continuar?"
              onDone={() => navigate("/vendas", { replace: true })}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{children}</span>
    </div>
  );
}

export default SaleDetailPage;
