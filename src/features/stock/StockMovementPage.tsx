import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { formatQuantity, todayISODate } from "@/lib/format";
import { parseDecimalInput } from "@/lib/validation";
import {
  listStockItems,
  registrarMovimentacaoEstoque,
  type StockItem,
  type StockMovementType,
} from "@/features/stock/stockService";
import {
  validateStockMovement,
  isValid,
  type StockMovementFormValues,
} from "@/features/stock/stockValidation";
import {
  MOVEMENT_TYPES,
  MOVEMENT_TYPE_LABELS,
} from "@/features/stock/stockConstants";
import { UNIT_LABELS } from "@/features/sales/saleConstants";

type LoadStatus = "loading" | "error" | "empty" | "ready";

const inputClass =
  "rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

export function StockMovementPage() {
  const navigate = useNavigate();
  const [loadStatus, setLoadStatus] = useState<LoadStatus>("loading");
  const [items, setItems] = useState<StockItem[]>([]);

  const [values, setValues] = useState<StockMovementFormValues>({
    estoqueItemId: "",
    tipoMovimentacao: "entrada",
    quantidade: "",
    motivo: "",
    dataMovimentacao: todayISODate(),
    observacao: "",
  });
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function loadItems() {
    setLoadStatus("loading");
    try {
      const list = await listStockItems();
      setItems(list);
      setLoadStatus(list.length === 0 ? "empty" : "ready");
      if (list.length > 0) {
        setValues((prev) => ({
          ...prev,
          estoqueItemId: prev.estoqueItemId || list[0].id,
        }));
      }
    } catch {
      setLoadStatus("error");
    }
  }

  useEffect(() => {
    void loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const errors = useMemo(() => validateStockMovement(values), [values]);
  const selected = items.find((i) => i.id === values.estoqueItemId) ?? null;
  const isAjuste = values.tipoMovimentacao === "ajuste";

  function update<K extends keyof StockMovementFormValues>(
    key: K,
    value: StockMovementFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (!isValid(errors)) return;

    setServerError(null);
    setSubmitting(true);
    try {
      await registrarMovimentacaoEstoque({
        estoqueItemId: values.estoqueItemId,
        tipoMovimentacao: values.tipoMovimentacao,
        quantidade: parseDecimalInput(values.quantidade) ?? 0,
        motivo: values.motivo.trim(),
        dataMovimentacao: values.dataMovimentacao,
        observacao: values.observacao.trim() || null,
      });
      navigate("/estoque", { replace: true });
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Não foi possível registrar a movimentação.",
      );
      setSubmitting(false);
    }
  }

  const showError = (key: keyof StockMovementFormValues) =>
    touched && errors[key] ? (
      <p className="text-xs text-red-600">{errors[key]}</p>
    ) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Link to="/estoque" className="text-sm text-brand">
          ‹ Estoque
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Movimentar estoque</h1>
      </div>

      {loadStatus === "loading" ? <LoadingState /> : null}
      {loadStatus === "error" ? (
        <ErrorState onRetry={() => void loadItems()} />
      ) : null}
      {loadStatus === "empty" ? (
        <EmptyState
          title="Nenhum item de estoque"
          description="Crie os itens no Supabase antes de movimentar."
        />
      ) : null}

      {loadStatus === "ready" ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">Item</span>
            <select
              value={values.estoqueItemId}
              onChange={(e) => update("estoqueItemId", e.target.value)}
              className={inputClass}
            >
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>
            {selected ? (
              <span className="text-xs text-gray-400">
                Atual: {formatQuantity(selected.quantidadeAtual)}{" "}
                {UNIT_LABELS[selected.unidade]}
              </span>
            ) : null}
            {showError("estoqueItemId")}
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">Tipo</span>
            <select
              value={values.tipoMovimentacao}
              onChange={(e) =>
                update("tipoMovimentacao", e.target.value as StockMovementType)
              }
              className={inputClass}
            >
              {MOVEMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {MOVEMENT_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">
              {isAjuste ? "Nova quantidade (contagem)" : "Quantidade"}
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={values.quantidade}
              onChange={(e) => update("quantidade", e.target.value)}
              className={inputClass}
            />
            {isAjuste ? (
              <span className="text-xs text-gray-400">
                Define o estoque para este valor absoluto.
              </span>
            ) : null}
            {showError("quantidade")}
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">Motivo</span>
            <input
              type="text"
              value={values.motivo}
              onChange={(e) => update("motivo", e.target.value)}
              className={inputClass}
            />
            {showError("motivo")}
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">Data</span>
            <input
              type="date"
              value={values.dataMovimentacao}
              onChange={(e) => update("dataMovimentacao", e.target.value)}
              className={inputClass}
            />
            {showError("dataMovimentacao")}
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
            {submitting ? "Salvando..." : "Registrar movimentação"}
          </button>
        </form>
      ) : null}
    </div>
  );
}

export default StockMovementPage;
