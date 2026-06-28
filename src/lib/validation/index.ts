/**
 * Shared input validation helpers for money, quantities, dates, and required
 * fields. Returns a localized error message (pt-BR) or `null` when valid, so
 * forms can show inline feedback. The database re-validates every write.
 */

export type ValidationResult = string | null;

/** Required, non-empty trimmed text. */
export function validateRequired(
  value: string | null | undefined,
  fieldLabel = "Campo",
): ValidationResult {
  if (!value || value.trim().length === 0) {
    return `${fieldLabel} é obrigatório.`;
  }
  return null;
}

/** Positive money value (> 0). */
export function validatePositiveMoney(
  value: number | null | undefined,
  fieldLabel = "Valor",
): ValidationResult {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return `${fieldLabel} é obrigatório.`;
  }
  if (value <= 0) return `${fieldLabel} deve ser maior que zero.`;
  return null;
}

/** Non-negative money value (>= 0). */
export function validateNonNegativeMoney(
  value: number | null | undefined,
  fieldLabel = "Valor",
): ValidationResult {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return `${fieldLabel} é obrigatório.`;
  }
  if (value < 0) return `${fieldLabel} não pode ser negativo.`;
  return null;
}

/** Positive quantity (> 0). */
export function validatePositiveQuantity(
  value: number | null | undefined,
  fieldLabel = "Quantidade",
): ValidationResult {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return `${fieldLabel} é obrigatória.`;
  }
  if (value <= 0) return `${fieldLabel} deve ser maior que zero.`;
  return null;
}

/** Positive integer count, used for animals used in pork/meat sales. */
export function validatePositiveInteger(
  value: number | null | undefined,
  fieldLabel = "Quantidade",
): ValidationResult {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return `${fieldLabel} é obrigatória.`;
  }
  if (!Number.isInteger(value)) return `${fieldLabel} deve ser um número inteiro.`;
  if (value <= 0) return `${fieldLabel} deve ser maior que zero.`;
  return null;
}

/** Valid date (Date or YYYY-MM-DD / ISO string). */
export function validateDate(
  value: Date | string | null | undefined,
  fieldLabel = "Data",
): ValidationResult {
  if (!value) return `${fieldLabel} é obrigatória.`;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return `${fieldLabel} é inválida.`;
  return null;
}

/** Returns the first non-null validation message, or null if all pass. */
export function firstError(...results: ValidationResult[]): ValidationResult {
  return results.find((r) => r !== null) ?? null;
}
