import {
  validatePositiveMoney,
  validatePositiveQuantity,
  validatePositiveInteger,
  validateNonNegativeMoney,
  validateRequired,
  validateDate,
} from "@/lib/validation";
import { calcSaleTotal, roundMoney } from "@/lib/calculations/financial";
import type { SaleType, StockUnit } from "@/features/sales/salesService";

/** Form values keep numeric inputs as text so users can type decimal separators. */
export interface SaleFormValues {
  tipoVenda: SaleType;
  produto: string;
  quantidade: string;
  unidade: StockUnit;
  precoUnitario: string;
  valorPago: string;
  dataVenda: string;
  clienteId: string | null;
  nomeCliente: string;
  animaisUtilizados: string;
  observacao: string;
}

/** Per-field error map; empty object means valid. */
export type SaleFormErrors = Partial<Record<keyof SaleFormValues, string>>;

export function parseDecimalInput(value: string): number | null {
  const normalized = value.trim().replace(",", ".");
  if (normalized === "" || normalized === "." || normalized === "-") return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

/**
 * Validate the sale form. Mirrors the database rules so the user gets immediate
 * feedback; the `registrar_venda` RPC re-validates authoritatively.
 */
export function validateSale(values: SaleFormValues): SaleFormErrors {
  const errors: SaleFormErrors = {};

  const produtoError = validateRequired(values.produto, "Produto");
  if (produtoError) errors.produto = produtoError;

  const quantidade = parseDecimalInput(values.quantidade);
  const qtdError = validatePositiveQuantity(quantidade, "Quantidade");
  if (qtdError) errors.quantidade = qtdError;

  const preco = parseDecimalInput(values.precoUnitario);
  const precoError = validatePositiveMoney(preco, "Preço unitário");
  if (precoError) errors.precoUnitario = precoError;

  const pago = parseDecimalInput(values.valorPago);
  const pagoError = validateNonNegativeMoney(pago, "Valor pago");
  if (pagoError) errors.valorPago = pagoError;

  const dateError = validateDate(values.dataVenda, "Data da venda");
  if (dateError) errors.dataVenda = dateError;

  // Overpayment: paid cannot exceed computed total.
  if (quantidade !== null && preco !== null && pago !== null) {
    const total = calcSaleTotal(quantidade, preco);
    if (roundMoney(pago) > total) {
      errors.valorPago = "Valor pago não pode exceder o total da venda.";
    }
  }

  // Pork/meat requires a positive integer number of animals.
  if (values.tipoVenda === "porco_carne") {
    const animais = parseDecimalInput(values.animaisUtilizados);
    const animaisError = validatePositiveInteger(animais, "Animais utilizados");
    if (animaisError) errors.animaisUtilizados = animaisError;
  }

  return errors;
}

/** True when there are no field errors. */
export function isSaleValid(errors: SaleFormErrors): boolean {
  return Object.keys(errors).length === 0;
}
