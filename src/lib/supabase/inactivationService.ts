import { supabase } from "@/lib/supabase/client";

/** Entities supported by the `inativar_registro` RPC (migration 011). */
export type InactivatableEntity =
  | "vendas"
  | "compras"
  | "despesas_animais"
  | "gastos_fixos"
  | "clientes";

/**
 * Soft-delete a record (ativo = false) through the atomic `inativar_registro`
 * RPC, which also applies compensating stock/financial effects. On a rule
 * violation (e.g. a purchase whose stock was already used) it raises a localized
 * message which is surfaced here.
 */
export async function inativarRegistro(
  entidade: InactivatableEntity,
  registroId: string,
): Promise<void> {
  const { error } = await supabase.rpc("inativar_registro", {
    p_entidade: entidade,
    p_registro_id: registroId,
  });

  if (error) throw new Error(error.message);
}
