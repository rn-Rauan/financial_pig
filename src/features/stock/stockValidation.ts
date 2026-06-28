import {
  validateRequired,
  validateDate,
  validatePositiveQuantity,
  parseDecimalInput,
} from "@/lib/validation";
import type { StockMovementType } from "@/lib/calculations/stock";

/** Stock movement form values (quantity kept as text for decimal input). */
export interface StockMovementFormValues {
  estoqueItemId: string;
  tipoMovimentacao: StockMovementType;
  quantidade: string;
  motivo: string;
  dataMovimentacao: string;
  observacao: string;
}

export type StockMovementFormErrors = Partial<
  Record<keyof StockMovementFormValues, string>
>;

/**
 * Validate a stock movement. Mirrors `registrar_movimentacao_estoque`:
 *  - entrada/saida/perda require quantity > 0
 *  - ajuste requires the new quantity >= 0 (it is an absolute value)
 */
export function validateStockMovement(
  values: StockMovementFormValues,
): StockMovementFormErrors {
  const errors: StockMovementFormErrors = {};

  const itemError = validateRequired(values.estoqueItemId, "Item");
  if (itemError) errors.estoqueItemId = itemError;

  const quantidade = parseDecimalInput(values.quantidade);
  if (values.tipoMovimentacao === "ajuste") {
    if (quantidade === null) {
      errors.quantidade = "Nova quantidade é obrigatória.";
    } else if (quantidade < 0) {
      errors.quantidade = "Nova quantidade não pode ser negativa.";
    }
  } else {
    const qtdError = validatePositiveQuantity(quantidade, "Quantidade");
    if (qtdError) errors.quantidade = qtdError;
  }

  const motivoError = validateRequired(values.motivo, "Motivo");
  if (motivoError) errors.motivo = motivoError;

  const dateError = validateDate(values.dataMovimentacao, "Data");
  if (dateError) errors.dataMovimentacao = dateError;

  return errors;
}

/** Consumption form values. */
export interface ConsumptionFormValues {
  estoqueItemId: string;
  quantidade: string;
  motivo: string;
  dataMovimentacao: string;
  observacao: string;
}

export type ConsumptionFormErrors = Partial<
  Record<keyof ConsumptionFormValues, string>
>;

/** Validate a consumption record (corn/feed exit). */
export function validateConsumption(
  values: ConsumptionFormValues,
): ConsumptionFormErrors {
  const errors: ConsumptionFormErrors = {};

  const itemError = validateRequired(values.estoqueItemId, "Item");
  if (itemError) errors.estoqueItemId = itemError;

  const quantidade = parseDecimalInput(values.quantidade);
  const qtdError = validatePositiveQuantity(quantidade, "Quantidade");
  if (qtdError) errors.quantidade = qtdError;

  const motivoError = validateRequired(values.motivo, "Motivo");
  if (motivoError) errors.motivo = motivoError;

  const dateError = validateDate(values.dataMovimentacao, "Data");
  if (dateError) errors.dataMovimentacao = dateError;

  return errors;
}

/** True when there are no field errors. */
export function isValid(errors: Record<string, string | undefined>): boolean {
  return Object.keys(errors).length === 0;
}
