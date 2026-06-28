import { validatePositiveMoney, validateDate } from "@/lib/validation";
import { roundMoney } from "@/lib/calculations/financial";
import { parseDecimalInput } from "@/features/sales/saleValidation";

/** Payment form values keep the amount as text so users can type decimals. */
export interface PaymentFormValues {
  valor: string;
  dataPagamento: string;
  observacao: string;
}

/** Per-field error map; empty object means valid. */
export type PaymentFormErrors = Partial<Record<keyof PaymentFormValues, string>>;

/**
 * Validate a later payment against the sale's remaining amount. Mirrors the
 * `registrar_pagamento_venda` rules so the user gets immediate feedback; the RPC
 * re-validates authoritatively.
 */
export function validatePayment(
  values: PaymentFormValues,
  remaining: number,
): PaymentFormErrors {
  const errors: PaymentFormErrors = {};

  const valor = parseDecimalInput(values.valor);
  const valorError = validatePositiveMoney(valor, "Valor do pagamento");
  if (valorError) {
    errors.valor = valorError;
  } else if (valor !== null && roundMoney(valor) > roundMoney(remaining)) {
    errors.valor = "Pagamento não pode exceder o valor restante.";
  }

  const dateError = validateDate(values.dataPagamento, "Data do pagamento");
  if (dateError) errors.dataPagamento = dateError;

  return errors;
}

/** True when there are no field errors. */
export function isPaymentValid(errors: PaymentFormErrors): boolean {
  return Object.keys(errors).length === 0;
}
