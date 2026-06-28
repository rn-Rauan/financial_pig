import { useMemo, useState, type FormEvent } from "react";
import { todayISODate } from "@/lib/format";
import type {
  CustomerOption,
  RegistrarVendaInput,
  SaleType,
  StockUnit,
} from "@/features/sales/salesService";
import {
  SALE_TYPES,
  STOCK_UNITS,
  SALE_TYPE_LABELS,
  UNIT_LABELS,
  DEFAULT_UNIT_BY_TYPE,
} from "@/features/sales/saleConstants";
import {
  validateSale,
  isSaleValid,
  parseDecimalInput,
  type SaleFormValues,
  type SaleFormErrors,
} from "@/features/sales/saleValidation";
import { SaleCalculatedFields } from "@/features/sales/components/SaleCalculatedFields";
import {
  CustomerSaleField,
  type CustomerSaleValue,
} from "@/features/sales/components/CustomerSaleField";

interface SaleFormProps {
  customers: CustomerOption[];
  submitting: boolean;
  serverError: string | null;
  onSubmit: (input: RegistrarVendaInput) => void;
}

const INITIAL: SaleFormValues = {
  tipoVenda: "porco_carne",
  produto: "",
  quantidade: "",
  unidade: DEFAULT_UNIT_BY_TYPE.porco_carne,
  precoUnitario: "",
  valorPago: "",
  dataVenda: todayISODate(),
  clienteId: null,
  nomeCliente: "",
  animaisUtilizados: "",
  observacao: "",
};

export function SaleForm({
  customers,
  submitting,
  serverError,
  onSubmit,
}: SaleFormProps) {
  const [values, setValues] = useState<SaleFormValues>(INITIAL);
  const [touched, setTouched] = useState(false);

  const errors: SaleFormErrors = useMemo(() => validateSale(values), [values]);
  const isPork = values.tipoVenda === "porco_carne";

  function update<K extends keyof SaleFormValues>(key: K, value: SaleFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function changeType(tipo: SaleType) {
    setValues((prev) => ({
      ...prev,
      tipoVenda: tipo,
      unidade: DEFAULT_UNIT_BY_TYPE[tipo],
      // Clear animals when leaving pork/meat.
      animaisUtilizados: tipo === "porco_carne" ? prev.animaisUtilizados : "",
    }));
  }

  function setCustomer(next: CustomerSaleValue) {
    setValues((prev) => ({
      ...prev,
      clienteId: next.clienteId,
      nomeCliente: next.nomeCliente,
    }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (!isSaleValid(errors)) return;

    onSubmit({
      tipoVenda: values.tipoVenda,
      produto: values.produto.trim(),
      quantidade: parseDecimalInput(values.quantidade) ?? 0,
      unidade: values.unidade,
      precoUnitario: parseDecimalInput(values.precoUnitario) ?? 0,
      valorPago: parseDecimalInput(values.valorPago) ?? 0,
      dataVenda: values.dataVenda,
      clienteId: values.clienteId,
      nomeCliente: values.clienteId ? null : values.nomeCliente.trim() || null,
      animaisUtilizados: isPork
        ? parseDecimalInput(values.animaisUtilizados)
        : null,
      observacao: values.observacao.trim() || null,
    });
  }

  const showError = (key: keyof SaleFormValues) =>
    touched && errors[key] ? (
      <p className="text-xs text-red-600">{errors[key]}</p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Sale type */}
      <Field label="Tipo de venda">
        <select
          value={values.tipoVenda}
          onChange={(e) => changeType(e.target.value as SaleType)}
          className={inputClass}
        >
          {SALE_TYPES.map((t) => (
            <option key={t} value={t}>
              {SALE_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </Field>

      {/* Product */}
      <Field label="Produto">
        <input
          type="text"
          value={values.produto}
          onChange={(e) => update("produto", e.target.value)}
          className={inputClass}
        />
        {showError("produto")}
      </Field>

      {/* Quantity + unit */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Quantidade">
          <input
            type="text"
            inputMode="decimal"
            value={values.quantidade}
            onChange={(e) => update("quantidade", e.target.value)}
            className={inputClass}
          />
          {showError("quantidade")}
        </Field>
        <Field label="Unidade">
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
        </Field>
      </div>

      {/* Animals used (pork/meat only) */}
      {isPork ? (
        <Field label="Animais utilizados">
          <input
            type="number"
            inputMode="numeric"
            step="1"
            min="0"
            value={values.animaisUtilizados}
            onChange={(e) => update("animaisUtilizados", e.target.value)}
            className={inputClass}
          />
          <p className="text-xs text-gray-400">
            Dá baixa no estoque de porcos por cabeça.
          </p>
          {showError("animaisUtilizados")}
        </Field>
      ) : null}

      {/* Unit price + paid */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Preço unitário (R$)">
          <input
            type="text"
            inputMode="decimal"
            value={values.precoUnitario}
            onChange={(e) => update("precoUnitario", e.target.value)}
            className={inputClass}
          />
          {showError("precoUnitario")}
        </Field>
        <Field label="Valor pago (R$)">
          <input
            type="text"
            inputMode="decimal"
            value={values.valorPago}
            onChange={(e) => update("valorPago", e.target.value)}
            className={inputClass}
          />
          {showError("valorPago")}
        </Field>
      </div>

      {/* Date */}
      <Field label="Data da venda">
        <input
          type="date"
          value={values.dataVenda}
          onChange={(e) => update("dataVenda", e.target.value)}
          className={inputClass}
        />
        {showError("dataVenda")}
      </Field>

      {/* Customer */}
      <CustomerSaleField
        customers={customers}
        value={{ clienteId: values.clienteId, nomeCliente: values.nomeCliente }}
        onChange={setCustomer}
      />

      {/* Observation */}
      <Field label="Observação (opcional)">
        <textarea
          rows={2}
          value={values.observacao}
          onChange={(e) => update("observacao", e.target.value)}
          className={inputClass}
        />
      </Field>

      {/* Calculated preview */}
      <SaleCalculatedFields
        tipoVenda={values.tipoVenda}
        quantidade={values.quantidade}
        precoUnitario={values.precoUnitario}
        valorPago={values.valorPago}
        animaisUtilizados={values.animaisUtilizados}
      />

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
        {submitting ? "Salvando..." : "Registrar venda"}
      </button>
    </form>
  );
}

const inputClass =
  "rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

export default SaleForm;
