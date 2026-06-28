import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { formatQuantity, todayISODate } from "@/lib/format";
import { parseDecimalInput } from "@/lib/validation";
import { listStockItems, type StockItem } from "@/features/stock/stockService";
import {
  registrarConsumo,
  isConsumable,
} from "@/features/stock/consumptionService";
import {
  validateConsumption,
  isValid,
  type ConsumptionFormValues,
} from "@/features/stock/stockValidation";
import { UNIT_LABELS } from "@/features/sales/saleConstants";

type LoadStatus = "loading" | "error" | "empty" | "ready";

const inputClass =
  "rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

export function ConsumptionPage() {
  const navigate = useNavigate();
  const [loadStatus, setLoadStatus] = useState<LoadStatus>("loading");
  const [items, setItems] = useState<StockItem[]>([]);

  const [values, setValues] = useState<ConsumptionFormValues>({
    estoqueItemId: "",
    quantidade: "",
    motivo: "Consumo dos animais",
    dataMovimentacao: todayISODate(),
    observacao: "",
  });
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function loadItems() {
    setLoadStatus("loading");
    try {
      const list = (await listStockItems()).filter(isConsumable);
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

  const errors = useMemo(() => validateConsumption(values), [values]);
  const selected = items.find((i) => i.id === values.estoqueItemId) ?? null;

  function update<K extends keyof ConsumptionFormValues>(
    key: K,
    value: ConsumptionFormValues[K],
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
      await registrarConsumo({
        estoqueItemId: values.estoqueItemId,
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
          : "Não foi possível registrar o consumo.",
      );
      setSubmitting(false);
    }
  }

  const showError = (key: keyof ConsumptionFormValues) =>
    touched && errors[key] ? (
      <p className="text-xs text-red-600">{errors[key]}</p>
    ) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Link to="/estoque" className="text-sm text-brand">
          ‹ Estoque
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Registrar consumo</h1>
      </div>

      {loadStatus === "loading" ? <LoadingState /> : null}
      {loadStatus === "error" ? (
        <ErrorState onRetry={() => void loadItems()} />
      ) : null}
      {loadStatus === "empty" ? (
        <EmptyState
          title="Nenhum item consumível"
          description="O consumo é permitido apenas para milho ou ração."
        />
      ) : null}

      {loadStatus === "ready" ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">
              Item (milho / ração)
            </span>
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
            <span className="text-sm font-medium text-gray-700">Quantidade</span>
            <input
              type="text"
              inputMode="decimal"
              value={values.quantidade}
              onChange={(e) => update("quantidade", e.target.value)}
              className={inputClass}
            />
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
            {submitting ? "Salvando..." : "Registrar consumo"}
          </button>
        </form>
      ) : null}
    </div>
  );
}

export default ConsumptionPage;
