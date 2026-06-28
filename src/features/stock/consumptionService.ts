import { supabase } from "@/lib/supabase/client";
import type { StockItem } from "@/features/stock/stockService";

/** Input accepted by the `registrar_consumo` RPC wrapper. */
export interface RegistrarConsumoInput {
  estoqueItemId: string;
  quantidade: number;
  motivo: string;
  dataMovimentacao: string; // YYYY-MM-DD
  observacao: string | null;
}

/** True when an item is consumable (corn/feed) — matches the RPC restriction. */
export function isConsumable(item: StockItem): boolean {
  const nome = item.nome.toLowerCase();
  return nome.includes("milho") || nome.includes("ração") || nome.includes("racao");
}

/**
 * Register consumption through the atomic `registrar_consumo` RPC. The database
 * restricts consumption to corn/feed and rejects insufficient stock.
 */
export async function registrarConsumo(
  input: RegistrarConsumoInput,
): Promise<string> {
  const { data, error } = await supabase.rpc("registrar_consumo", {
    p_estoque_item_id: input.estoqueItemId,
    p_quantidade: input.quantidade,
    p_motivo: input.motivo,
    p_data_movimentacao: input.dataMovimentacao,
    p_observacao: input.observacao,
  });

  if (error) throw new Error(error.message);
  return data as string;
}
