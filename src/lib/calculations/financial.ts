/**
 * Financial calculation helpers (business rules, UI-independent).
 *
 * These mirror the database rules in schema.md so the UI can preview totals,
 * remaining amounts, and payment status before calling the atomic RPCs. The
 * database remains the source of truth and re-validates every write.
 */

export type SaleStatus = "pago" | "parcial" | "fiado";

/** Round to 2 decimal places (money), avoiding floating point artifacts. */
export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Sale total = quantity * unit price, rounded to 2 decimals. */
export function calcSaleTotal(quantity: number, unitPrice: number): number {
  return roundMoney(quantity * unitPrice);
}

/** Remaining = total - paid, never negative. */
export function calcRemaining(total: number, paid: number): number {
  return roundMoney(Math.max(0, total - paid));
}

/**
 * Payment status derived from total and paid amounts:
 *  - paid === 0           -> 'fiado'  (credit)
 *  - paid >= total        -> 'pago'   (paid)
 *  - 0 < paid < total     -> 'parcial' (partial)
 */
export function calcSaleStatus(total: number, paid: number): SaleStatus {
  const roundedTotal = roundMoney(total);
  const roundedPaid = roundMoney(paid);
  if (roundedPaid <= 0) return "fiado";
  if (roundedPaid >= roundedTotal) return "pago";
  return "parcial";
}

/** True when a payment would exceed the remaining amount (overpayment). */
export function isOverpayment(remaining: number, payment: number): boolean {
  return roundMoney(payment) > roundMoney(remaining);
}

/** Sum a list of monetary values, rounded to 2 decimals. */
export function sumMoney(values: Array<number | null | undefined>): number {
  return roundMoney(
    values.reduce<number>((acc, v) => acc + (Number.isFinite(v) ? (v as number) : 0), 0),
  );
}

/**
 * Cash balance = capital + received sale money + later payments + other income
 *              - paid purchases - paid expenses - paid fixed costs.
 * Receivables (unpaid sale amounts) are intentionally NOT included here.
 */
export function calcCashBalance(input: {
  capitalInicial: number;
  recebido: number;
  saidasPagas: number;
}): number {
  return roundMoney(input.capitalInicial + input.recebido - input.saidasPagas);
}
