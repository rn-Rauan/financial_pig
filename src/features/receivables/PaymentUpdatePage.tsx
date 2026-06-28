import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { formatCurrency, formatDate, todayISODate } from "@/lib/format";
import { getSale, type Sale } from "@/features/sales/salesService";
import { SALE_TYPE_LABELS } from "@/features/sales/saleConstants";
import { StatusBadge } from "@/features/sales/components/StatusBadge";
import { registrarPagamentoVenda } from "@/features/receivables/paymentService";
import {
  validatePayment,
  isPaymentValid,
  type PaymentFormValues,
  type PaymentFormErrors,
} from "@/features/receivables/paymentValidation";
import { parseDecimalInput } from "@/features/sales/saleValidation";

type LoadStatus = "loading" | "error" | "notfound" | "ready";

const inputClass =
  "rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

export function PaymentUpdatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loadStatus, setLoadStatus] = useState<LoadStatus>("loading");
  const [sale, setSale] = useState<Sale | null>(null);

  const [values, setValues] = useState<PaymentFormValues>({
    valor: "",
    dataPagamento: todayISODate(),
    observacao: "",
  });
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoadStatus("loading");
    try {
      const found = await getSale(id);
      if (!found) {
        setLoadStatus("notfound");
        return;
      }
      setSale(found);
      setLoadStatus("ready");
    } catch {
      setLoadStatus("error");
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const remaining = sale?.valorRestante ?? 0;
  const settled = sale !== null && remaining <= 0;

  const errors: PaymentFormErrors = useMemo(
    () => validatePayment(values, remaining),
    [values, remaining],
  );

  function update<K extends keyof PaymentFormValues>(
    key: K,
    next: PaymentFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: next }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!sale) return;
    setTouched(true);
    if (!isPaymentValid(errors)) return;

    setServerError(null);
    setSubmitting(true);
    try {
      await registrarPagamentoVenda({
        vendaId: sale.id,
        valor: parseDecimalInput(values.valor) ?? 0,
        dataPagamento: values.dataPagamento,
        observacao: values.observacao.trim() || null,
      });
      navigate("/recebiveis", { replace: true });
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Não foi possível registrar o pagamento.",
      );
      setSubmitting(false);
    }
  }

  const showError = (key: keyof PaymentFormValues) =>
    touched && errors[key] ? (
      <p className="text-xs text-red-600">{errors[key]}</p>
    ) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Link to="/recebiveis" className="text-sm text-brand">
          ‹ Contas a receber
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Registrar pagamento</h1>
      </div>

      {loadStatus === "loading" ? <LoadingState /> : null}
      {loadStatus === "error" ? <ErrorState onRetry={() => void load()} /> : null}
      {loadStatus === "notfound" ? (
        <EmptyState
          title="Venda não encontrada"
          description="O registro pode ter sido inativado ou já quitado."
        />
      ) : null}

      {loadStatus === "ready" && sale ? (
        <>
          {/* Sale summary */}
          <section className="flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-gray-900">
                  {sale.clienteNome ?? sale.nomeCliente ?? "Sem cliente"}
                </p>
                <p className="truncate text-sm text-gray-500">
                  {sale.produto} · {SALE_TYPE_LABELS[sale.tipoVenda]} ·{" "}
                  {formatDate(sale.dataVenda)}
                </p>
              </div>
              <StatusBadge status={sale.statusPagamento} />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(sale.valorTotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Pago</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(sale.valorPago)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Restante</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(remaining)}
              </span>
            </div>
          </section>

          {settled ? (
            <EmptyState
              title="Venda já quitada"
              description="Não há valor restante para receber."
            />
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">
                  Valor do pagamento (R$)
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={values.valor}
                  onChange={(e) => update("valor", e.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => update("valor", String(remaining))}
                  className="self-start text-xs text-brand"
                >
                  Pagar restante ({formatCurrency(remaining)})
                </button>
                {showError("valor")}
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">
                  Data do pagamento
                </span>
                <input
                  type="date"
                  value={values.dataPagamento}
                  onChange={(e) => update("dataPagamento", e.target.value)}
                  className={inputClass}
                />
                {showError("dataPagamento")}
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">
                  Observação (opcional)
                </span>
                <textarea
                  rows={2}
                  value={values.observacao}
                  onChange={(e) => update("observacao", e.target.value)}
                  className={inputClass}
                />
              </label>

              {serverError ? (
                <p role="alert" className="text-sm text-red-600">
                  {serverError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-brand px-4 py-3 text-base font-semibold text-white active:bg-brand-dark disabled:opacity-60"
              >
                {submitting ? "Salvando..." : "Registrar pagamento"}
              </button>
            </form>
          )}
        </>
      ) : null}
    </div>
  );
}

export default PaymentUpdatePage;
