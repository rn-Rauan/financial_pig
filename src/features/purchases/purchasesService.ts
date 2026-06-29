import { supabase } from "@/lib/supabase/client";
import type { StockUnit } from "@/features/sales/salesService";

/** Enum mirror of the database `purchase_type` (schema.md). */
export type PurchaseType = "porcos_leitoes" | "milho" | "racao" | "outros";
export type { StockUnit };

/** A purchase row as shown in lists. */
export interface Purchase {
  id: string;
  tipoCompra: PurchaseType;
  produto: string;
  quantidade: number;
  unidade: StockUnit;
  valorUnitario: number;
  valorTotal: number;
  fornecedor: string | null;
  dataCompra: string;
  observacao: string | null;
  createdAt: string;
}

/** Input accepted by the `registrar_compra` RPC wrapper. */
export interface RegistrarCompraInput {
  tipoCompra: PurchaseType;
  produto: string;
  quantidade: number;
  unidade: StockUnit;
  /** Total paid for the purchase/lote. The RPC stores unit value as an average. */
  valorTotal: number;
  dataCompra: string; // YYYY-MM-DD
  fornecedor: string | null;
  observacao: string | null;
}

function num(value: unknown): number {
  const n = typeof value === "string" ? Number(value) : (value as number);
  return Number.isFinite(n) ? n : 0;
}

interface PurchaseRowRaw {
  id: string;
  tipo_compra: PurchaseType;
  produto: string;
  quantidade: number | string;
  unidade: StockUnit;
  valor_unitario: number | string;
  valor_total: number | string;
  fornecedor: string | null;
  data_compra: string;
  observacao: string | null;
  created_at: string;
}

function mapPurchase(row: PurchaseRowRaw): Purchase {
  return {
    id: row.id,
    tipoCompra: row.tipo_compra,
    produto: row.produto,
    quantidade: num(row.quantidade),
    unidade: row.unidade,
    valorUnitario: num(row.valor_unitario),
    valorTotal: num(row.valor_total),
    fornecedor: row.fornecedor,
    dataCompra: row.data_compra,
    observacao: row.observacao,
    createdAt: row.created_at,
  };
}

const PURCHASE_SELECT =
  "id, tipo_compra, produto, quantidade, unidade, valor_unitario, valor_total, " +
  "fornecedor, data_compra, observacao, created_at";

/** List active purchases, newest first. */
export async function listPurchases(): Promise<Purchase[]> {
  const { data, error } = await supabase
    .from("compras")
    .select(PURCHASE_SELECT)
    .eq("ativo", true)
    .order("data_compra", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as unknown as PurchaseRowRaw[]).map(mapPurchase);
}

/**
 * Register a purchase through the atomic `registrar_compra` RPC. The database
 * stores the provided total and computes the average unit cost for display.
 */
export async function registrarCompra(input: RegistrarCompraInput): Promise<string> {
  const { data, error } = await supabase.rpc("registrar_compra", {
    p_tipo_compra: input.tipoCompra,
    p_produto: input.produto,
    p_quantidade: input.quantidade,
    p_unidade: input.unidade,
    p_valor_total: input.valorTotal,
    p_data_compra: input.dataCompra,
    p_fornecedor: input.fornecedor,
    p_observacao: input.observacao,
  });

  if (error) throw new Error(error.message);
  return data as string;
}
