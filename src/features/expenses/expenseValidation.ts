import {
  validateRequired,
  validatePositiveMoney,
  validateDate,
  parseDecimalInput,
} from "@/lib/validation";

/**
 * Shared form values for animal expenses and fixed/construction costs. They have
 * different category enums but the same field rules, so one validator serves both
 * (T076). `categoria` is the selected enum value as text.
 */
export interface ExpenseFormValues {
  categoria: string;
  valor: string;
  descricao: string;
  data: string;
  observacao: string;
}

export type ExpenseFormErrors = Partial<Record<keyof ExpenseFormValues, string>>;

/** Validate an expense/fixed-cost form. The RPC re-validates authoritatively. */
export function validateExpense(values: ExpenseFormValues): ExpenseFormErrors {
  const errors: ExpenseFormErrors = {};

  const categoriaError = validateRequired(values.categoria, "Categoria");
  if (categoriaError) errors.categoria = categoriaError;

  const valorError = validatePositiveMoney(
    parseDecimalInput(values.valor),
    "Valor",
  );
  if (valorError) errors.valor = valorError;

  const descricaoError = validateRequired(values.descricao, "Descrição");
  if (descricaoError) errors.descricao = descricaoError;

  const dateError = validateDate(values.data, "Data");
  if (dateError) errors.data = dateError;

  return errors;
}

/** True when there are no field errors. */
export function isExpenseValid(errors: ExpenseFormErrors): boolean {
  return Object.keys(errors).length === 0;
}
