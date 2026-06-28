import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { InactivateButton } from "@/components/InactivateButton";
import type { InactivatableEntity } from "@/lib/supabase/inactivationService";
import { formatCurrency, formatDate, todayISODate } from "@/lib/format";
import { sumMoney } from "@/lib/calculations/financial";
import { parseDecimalInput } from "@/lib/validation";
import {
  validateExpense,
  isExpenseValid,
  type ExpenseFormValues,
  type ExpenseFormErrors,
} from "@/features/expenses/expenseValidation";
import type { CategoryOption } from "@/features/expenses/expenseConstants";

/** A normalized entry for the shared list (built by each page). */
export interface ExpenseEntry {
  id: string;
  categoriaLabel: string;
  valor: number;
  descricao: string;
  data: string;
}

/** Values passed to the page's submit handler (numbers resolved). */
export interface ExpenseSubmit {
  categoria: string;
  valor: number;
  descricao: string;
  data: string;
  observacao: string | null;
}

interface ExpenseManagerProps {
  title: string;
  /** Label for the date field (e.g. "Data da despesa"). */
  dateLabel: string;
  categories: CategoryOption<string>[];
  addLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  /** Entity used to soft-delete a list item via inativar_registro. */
  inactivateEntity: InactivatableEntity;
  load: () => Promise<ExpenseEntry[]>;
  submit: (values: ExpenseSubmit) => Promise<void>;
}

const inputClass =
  "rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

type ListStatus = "loading" | "error" | "ready";

/**
 * Shared screen for animal expenses and fixed/construction costs: an add form on
 * top and a list (with total) below. Both cost types use the same field rules.
 */
export function ExpenseManager({
  title,
  dateLabel,
  categories,
  addLabel,
  emptyTitle,
  emptyDescription,
  inactivateEntity,
  load,
  submit,
}: ExpenseManagerProps) {
  const initial: ExpenseFormValues = {
    categoria: categories[0]?.value ?? "",
    valor: "",
    descricao: "",
    data: todayISODate(),
    observacao: "",
  };

  const [values, setValues] = useState<ExpenseFormValues>(initial);
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [listStatus, setListStatus] = useState<ListStatus>("loading");
  const [entries, setEntries] = useState<ExpenseEntry[]>([]);

  const errors: ExpenseFormErrors = useMemo(() => validateExpense(values), [values]);

  const loadList = useCallback(async () => {
    setListStatus("loading");
    try {
      setEntries(await load());
      setListStatus("ready");
    } catch {
      setListStatus("error");
    }
  }, [load]);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  const total = useMemo(
    () => sumMoney(entries.map((e) => e.valor)),
    [entries],
  );

  function update<K extends keyof ExpenseFormValues>(
    key: K,
    value: ExpenseFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (!isExpenseValid(errors)) return;

    setServerError(null);
    setSubmitting(true);
    try {
      await submit({
        categoria: values.categoria,
        valor: parseDecimalInput(values.valor) ?? 0,
        descricao: values.descricao.trim(),
        data: values.data,
        observacao: values.observacao.trim() || null,
      });
      // Reset the volatile fields, keep category/date for quick entry.
      setValues((prev) => ({ ...prev, valor: "", descricao: "", observacao: "" }));
      setTouched(false);
      await loadList();
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Não foi possível salvar o registro.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const showError = (key: keyof ExpenseFormValues) =>
    touched && errors[key] ? (
      <p className="text-xs text-red-600">{errors[key]}</p>
    ) : null;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Categoria</span>
          <select
            value={values.categoria}
            onChange={(e) => update("categoria", e.target.value)}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {showError("categoria")}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Descrição</span>
          <input
            type="text"
            value={values.descricao}
            onChange={(e) => update("descricao", e.target.value)}
            className={inputClass}
          />
          {showError("descricao")}
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">Valor (R$)</span>
            <input
              type="text"
              inputMode="decimal"
              value={values.valor}
              onChange={(e) => update("valor", e.target.value)}
              className={inputClass}
            />
            {showError("valor")}
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">{dateLabel}</span>
            <input
              type="date"
              value={values.data}
              onChange={(e) => update("data", e.target.value)}
              className={inputClass}
            />
            {showError("data")}
          </label>
        </div>

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
          {submitting ? "Salvando..." : addLabel}
        </button>
      </form>

      {listStatus === "loading" ? <LoadingState /> : null}
      {listStatus === "error" ? (
        <ErrorState onRetry={() => void loadList()} />
      ) : null}

      {listStatus === "ready" && entries.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : null}

      {listStatus === "ready" && entries.length > 0 ? (
        <>
          <div className="flex items-center justify-between rounded-xl bg-brand/10 px-4 py-3">
            <span className="text-sm font-medium text-brand-dark">Total</span>
            <span className="text-lg font-bold text-brand-dark">
              {formatCurrency(total)}
            </span>
          </div>

          <ul className="flex flex-col gap-2">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-white p-3 shadow-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900">
                    {entry.descricao}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {entry.categoriaLabel} · {formatDate(entry.data)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(entry.valor)}
                  </span>
                  <InactivateButton
                    entidade={inactivateEntity}
                    registroId={entry.id}
                    variant="link"
                    onDone={() => void loadList()}
                  />
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

export default ExpenseManager;
