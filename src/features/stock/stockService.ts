import { supabase } from "@/lib/supabase/client";
import type { StockUnit } from "@/features/sales/salesService";
import type { StockMovementType } from "@/lib/calculations/stock";

export type { StockUnit, StockMovementType };

/** A stock item with its current quantity. */
export interface StockItem {
  id: string;
  nome: string;
  quantidadeAtual: number;
  unidade: StockUnit;
  estoqueMinimo: number | null;
}

/** Input accepted by the `registrar_movimentacao_estoque` RPC wrapper. */
export interface RegistrarMovimentacaoInput {
  estoqueItemId: string;
  tipoMovimentacao: StockMovementType;
  /** For ajuste this is the NEW absolute quantity; otherwise the delta. */
  quantidade: number;
  motivo: string;
  dataMovimentacao: string; // YYYY-MM-DD
  observacao: string | null;
}

function num(value: unknown): number {
  const n = typeof value === "string" ? Number(value) : (value as number);
  return Number.isFinite(n) ? n : 0;
}

function nullableNum(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === "string" ? Number(value) : (value as number);
  return Number.isFinite(n) ? n : null;
}

interface StockItemRowRaw {
  id: string;
  nome: string;
  quantidade_atual: number | string;
  unidade: StockUnit;
  estoque_minimo: number | string | null;
}

function mapItem(row: StockItemRowRaw): StockItem {
  return {
    id: row.id,
    nome: row.nome,
    quantidadeAtual: num(row.quantidade_atual),
    unidade: row.unidade,
    estoqueMinimo: nullableNum(row.estoque_minimo),
  };
}

const STOCK_SELECT = "id, nome, quantidade_atual, unidade, estoque_minimo";

/** List active stock items, alphabetical. */
export async function listStockItems(): Promise<StockItem[]> {
  const { data, error } = await supabase
    .from("estoque_itens")
    .select(STOCK_SELECT)
    .eq("ativo", true)
    .order("nome", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as unknown as StockItemRowRaw[]).map(mapItem);
}

/**
 * Register a manual stock movement through the atomic
 * `registrar_movimentacao_estoque` RPC (entrada/saida/perda/ajuste).
 */
export async function registrarMovimentacaoEstoque(
  input: RegistrarMovimentacaoInput,
): Promise<string> {
  const { data, error } = await supabase.rpc("registrar_movimentacao_estoque", {
    p_estoque_item_id: input.estoqueItemId,
    p_tipo_movimentacao: input.tipoMovimentacao,
    p_quantidade: input.quantidade,
    p_motivo: input.motivo,
    p_data_movimentacao: input.dataMovimentacao,
    p_observacao: input.observacao,
  });

  if (error) throw new Error(error.message);
  return data as string;
}
