/**
 * Stock calculation helpers (business rules, UI-independent).
 *
 * Mirrors schema.md: entrada/compra increase stock; saida/venda/consumo/perda
 * decrease stock; ajuste sets a corrective delta. Stock must never go negative.
 */

export type StockMovementType = "entrada" | "saida" | "consumo" | "perda" | "ajuste";

/** Movement types that increase stock. */
const INCREASING: StockMovementType[] = ["entrada"];
/** Movement types that decrease stock. */
const DECREASING: StockMovementType[] = ["saida", "consumo", "perda"];

/** Round to 3 decimals (quantities). */
export function roundQuantity(value: number): number {
  return Math.round((value + Number.EPSILON) * 1000) / 1000;
}

/**
 * Resulting stock after applying a movement of `quantity` (always positive).
 * For 'ajuste', `quantity` is treated as the signed delta provided by caller
 * intent; callers that need an absolute set should compute the delta first.
 */
export function applyMovement(
  current: number,
  type: StockMovementType,
  quantity: number,
): number {
  if (INCREASING.includes(type)) {
    return roundQuantity(current + Math.abs(quantity));
  }
  if (DECREASING.includes(type)) {
    return roundQuantity(current - Math.abs(quantity));
  }
  // ajuste: signed delta
  return roundQuantity(current + quantity);
}

/** True when applying a movement would drive stock below zero. */
export function wouldGoNegative(
  current: number,
  type: StockMovementType,
  quantity: number,
): boolean {
  return applyMovement(current, type, quantity) < 0;
}

/** True when current stock is at or below the configured minimum. */
export function isBelowMinimum(
  current: number,
  minimum: number | null | undefined,
): boolean {
  if (minimum === null || minimum === undefined) return false;
  return roundQuantity(current) <= roundQuantity(minimum);
}
