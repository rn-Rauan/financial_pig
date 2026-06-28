import { supabase } from "@/lib/supabase/client";

/** Input accepted by the `registrar_pagamento_venda` RPC wrapper. */
export interface RegistrarPagamentoInput {
  vendaId: string;
  valor: number;
  dataPagamento: string; // YYYY-MM-DD
  observacao: string | null;
}

/**
 * Register a later payment through the atomic `registrar_pagamento_venda` RPC.
 * The database updates the sale's paid/remaining/status and inserts the payment
 * and history rows. On any rule violation it raises a localized message which is
 * surfaced here (e.g. payment exceeding the remaining amount).
 */
export async function registrarPagamentoVenda(
  input: RegistrarPagamentoInput,
): Promise<string> {
  const { data, error } = await supabase.rpc("registrar_pagamento_venda", {
    p_venda_id: input.vendaId,
    p_valor: input.valor,
    p_data_pagamento: input.dataPagamento,
    p_observacao: input.observacao,
  });

  if (error) throw new Error(error.message);
  return data as string;
}
