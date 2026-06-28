import { supabase } from "@/lib/supabase/client";
import {
  SALE_SELECT,
  mapSale,
  type Sale,
  type SaleRowRaw,
} from "@/features/sales/salesService";

/**
 * Receivables are active sales whose payment is still open (partial or credit).
 * They reuse the sale shape from salesService so the remaining amount, status,
 * and customer are consistent across screens.
 */
export async function listReceivables(): Promise<Sale[]> {
  const { data, error } = await supabase
    .from("vendas")
    .select(SALE_SELECT)
    .eq("ativo", true)
    .in("status_pagamento", ["parcial", "fiado"])
    .order("data_venda", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as unknown as SaleRowRaw[]).map(mapSale);
}
