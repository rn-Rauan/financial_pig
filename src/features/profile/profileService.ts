import { supabase } from "@/lib/supabase/client";

function num(value: unknown): number {
  const n = typeof value === "string" ? Number(value) : (value as number);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Read the authenticated user's initial cash/capital from `configuracoes`.
 * Returns 0 when no settings row exists yet.
 */
export async function getCapitalInicial(): Promise<number> {
  const { data, error } = await supabase
    .from("configuracoes")
    .select("capital_inicial")
    .eq("ativo", true)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return num(data?.capital_inicial);
}

/**
 * Update the initial cash via the atomic `atualizar_capital_inicial` RPC and
 * return the stored value. The RPC rejects negative amounts.
 */
export async function atualizarCapitalInicial(valor: number): Promise<number> {
  const { data, error } = await supabase.rpc("atualizar_capital_inicial", {
    p_capital_inicial: valor,
  });

  if (error) throw new Error(error.message);
  return num(data);
}
