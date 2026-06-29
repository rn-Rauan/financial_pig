import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatCurrency, todayISODate } from "@/lib/format";
import {
  validateRequired,
  validatePositiveQuantity,
  validatePositiveMoney,
  validateDate,
  parseDecimalInput,
} from "@/lib/validation";
import { roundMoney } from "@/lib/calculations/financial";
import {
  registrarCompra,
  type PurchaseType,
  type StockUnit,
} from "@/features/purchases/purchasesService";
import {
  PURCHASE_TYPES,
  PURCHASE_TYPE_LABELS,
  DEFAULT_PURCHASE_UNIT_BY_TYPE,
} from "@/features/stock/stockConstants";
import { STOCK_UNITS, UNIT_LABELS } from "@/features/sales/saleConstants";

interface FormValues {
  tipoCompra: PurchaseType;
  produto: string;
  quantidade: string;
  unidade: StockUnit;
  valorTotal: string;
  fornecedor: string;
  dataCompra: string;
  observacao: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const INITIAL: FormValues = {
  tipoCompra: "porcos_leitoes",
  produto: "",
  quantidade: "",
  unidade: DEFAULT_PURCHASE_UNIT_BY_TYPE.porcos_leitoes,
  valorTotal: "",
  fornecedor: "",
  dataCompra: todayISODate(),
  observacao: "",
};

const inputClass =
  "rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const produtoError = validateRequired(values.produto, "Produto");
  if (produtoError) errors.produto = produtoError;
  const qtdError = validatePositiveQuantity(
    parseDecimalInput(values.quantidade),
    "Quantidade",
  );
  if (qtdError) errors.quantidade = qtdError;
  const totalError = validatePositiveMoney(
    parseDecimalInput(values.valorTotal),
    "Valor total",
  );
  if (totalError) errors.valorTotal = totalError;
  const dateError = validateDate(values.dataCompra, "Data da compra");
  if (dateError) errors.dataCompra = dateError;
  return errors;
}

export function PurchaseFormPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState<FormValues>(INITIAL);
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const errors = useMemo(() => validate(values), [values]);

  const mediaUnitaria = useMemo(() => {
    const q = parseDecimalInput(values.quantidade) ?? 0;
    const total = parseDecimalInput(values.valorTotal) ?? 0;
    return q > 0 && total > 0 ? roundMoney(total / q) : 0;
  }, [values.quantidade, values.valorTotal]);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function changeType(tipo: PurchaseType) {
    setValues((prev) => ({
      ...prev,
      tipoCompra: tipo,
      unidade: DEFAULT_PURCHASE_UNIT_BY_TYPE[tipo],
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (Object.keys(errors).length > 0) return;

    setServerError(null);
    setSubmitting(true);
    try {
      await registrarCompra({
        tipoCompra: values.tipoCompra,
        produto: values.produto.trim(),
        quantidade: parseDecimalInput(values.quantidade) ?? 0,
        unidade: values.unidade,
        valorTotal: parseDecimalInput(values.valorTotal) ?? 0,
        dataCompra: values.dataCompra,
        fornecedor: values.fornecedor.trim() || null,
        observacao: values.observacao.trim() || null,
      });
      navigate("/compras", { replace: true });
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Não foi possível registrar a compra.",
      );
      setSubmitting(false);
    }
  }

  const showError = (key: keyof FormValues) =>
    touched && errors[key] ? (
      <p className="text-xs text-red-600">{errors[key]}</p>
    ) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Link to="/compras" className="text-sm text-brand">
          ‹ Compras
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Nova compra</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Tipo de compra</span>
          <select
            value={values.tipoCompra}
            onChange={(e) => changeType(e.target.value as PurchaseType)}
            className={inputClass}
          >
            {PURCHASE_TYPES.map((t) => (
              <option key={t} value={t}>
                {PURCHASE_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Produto</span>
          <input
            type="text"
            value={values.produto}
            onChange={(e) => update("produto", e.target.value)}
            className={inputClass}
          />
          {showError("produto")}
        </label>

        <div className="grid grid-cols-2 gap-3">
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
            <span className="text-sm font-medium text-gray-700">Unidade</span>
            <select
              value={values.unidade}
              onChange={(e) => update("unidade", e.target.value as StockUnit)}
              className={inputClass}
            >
              {STOCK_UNITS.map((u) => (
                <option key={u} value={u}>
                  {UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">
            Valor total da compra (R$)
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={values.valorTotal}
            onChange={(e) => update("valorTotal", e.target.value)}
            className={inputClass}
          />
          {showError("valorTotal")}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">
            Fornecedor (opcional)
          </span>
          <input
            type="text"
            value={values.fornecedor}
            onChange={(e) => update("fornecedor", e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Data da compra</span>
          <input
            type="date"
            value={values.dataCompra}
            onChange={(e) => update("dataCompra", e.target.value)}
            className={inputClass}
          />
          {showError("dataCompra")}
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

        <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
          <span className="text-sm text-gray-500">
            Média por {UNIT_LABELS[values.unidade].toLowerCase()}
          </span>
          <span className="text-base font-semibold text-gray-900">
            {formatCurrency(mediaUnitaria)}
          </span>
        </div>

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
          {submitting ? "Salvando..." : "Registrar compra"}
        </button>
      </form>
    </div>
  );
}

export default PurchaseFormPage;
