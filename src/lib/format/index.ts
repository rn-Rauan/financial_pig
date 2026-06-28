/**
 * Shared currency, number, and date formatting helpers.
 *
 * Defaults target the MVP locale (pt-BR / BRL). Formatting is presentation-only;
 * business calculations live in `@/lib/calculations`.
 */

const DEFAULT_LOCALE = "pt-BR";
const DEFAULT_CURRENCY = "BRL";

/** Format a monetary amount, e.g. 1234.5 -> "R$ 1.234,50". */
export function formatCurrency(
  value: number | null | undefined,
  currency: string = DEFAULT_CURRENCY,
): string {
  const amount = Number.isFinite(value) ? (value as number) : 0;
  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: "currency",
    currency,
  }).format(amount);
}

/** Format a plain number with up to `maxFractionDigits` decimals. */
export function formatNumber(
  value: number | null | undefined,
  maxFractionDigits = 3,
): string {
  const amount = Number.isFinite(value) ? (value as number) : 0;
  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    maximumFractionDigits: maxFractionDigits,
  }).format(amount);
}

/** Format a quantity (e.g. stock/sale quantities) with up to 3 decimals. */
export function formatQuantity(value: number | null | undefined): string {
  return formatNumber(value, 3);
}

/**
 * Format a date or ISO date string as "dd/mm/aaaa".
 * Accepts `Date`, ISO strings, or `YYYY-MM-DD` (parsed as local date).
 */
export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "";
  const date = parseDate(value);
  if (!date || Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

/** Format a timestamp as "dd/mm/aaaa hh:mm". */
export function formatDateTime(value: Date | string | null | undefined): string {
  if (!value) return "";
  const date = parseDate(value);
  if (!date || Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/** Today's date as `YYYY-MM-DD` in local time (for date input defaults). */
export function todayISODate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(value: Date | string): Date {
  if (value instanceof Date) return value;
  // Treat a bare YYYY-MM-DD as a local date to avoid timezone off-by-one.
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (match) {
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }
  return new Date(value);
}
