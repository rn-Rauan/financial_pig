import { supabase } from "@/lib/supabase/client";
import type { SaleStatus } from "@/lib/calculations/financial";

/** Enum mirrors of the database types (schema.md). */
export type SaleType = "porco_carne" | "milho" | "racao" | "outros";
export type StockUnit = "cabeca" | "saca" | "kg" | "unidade";
export type { SaleStatus };

/** A sale row as shown in lists and detail. */
export interface Sale {
  id: string;
  clienteId: string | null;
  nomeCliente: string | null;
  clienteNome: string | null; // resolved from the clientes relation
  tipoVenda: SaleType;
  produto: string;
  quantidade: number;
  unidade: StockUnit;
  animaisUtilizados: number | null;
  precoUnitario: number;
  valorTotal: number;
  valorPago: number;
  valorRestante: number;
  statusPagamento: SaleStatus;
  dataVenda: string;
  observacao: string | null;
  createdAt: string;
}

/** A stock movement linked to a sale (for the detail effect summary). */
export interface SaleStockMovement {
  id: string;
  itemNome: string | null;
  unidade: StockUnit | null;
  tipoMovimentacao: string;
  quantidade: number;
  motivo: string;
}

/** Minimal customer option for the sale customer field. */
export interface CustomerOption {
  id: string;
  nome: string;
}

/** Input accepted by the `registrar_venda` RPC wrapper. */
export interface RegistrarVendaInput {
  tipoVenda: SaleType;
  produto: string;
  quantidade: number;
  unidade: StockUnit;
  precoUnitario: number;
  valorPago: number;
  dataVenda: string; // YYYY-MM-DD
  clienteId: string | null;
  nomeCliente: string | null;
  animaisUtilizados: number | null;
  observacao: string | null;
}

function num(value: unknown): number {
  const n = typeof value === "string" ? Number(value) : (value as number);
  return Number.isFinite(n) ? n : 0;
}

function nullableInt(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === "string" ? Number(value) : (value as number);
  return Number.isFinite(n) ? n : null;
}

export interface SaleRowRaw {
  id: string;
  cliente_id: string | null;
  nome_cliente: string | null;
  tipo_venda: SaleType;
  produto: string;
  quantidade: number | string;
  unidade: StockUnit;
  animais_utilizados: number | string | null;
  preco_unitario: number | string;
  valor_total: number | string;
  valor_pago: number | string;
  valor_restante: number | string;
  status_pagamento: SaleStatus;
  data_venda: string;
  observacao: string | null;
  created_at: string;
  clientes: { nome: string } | { nome: string }[] | null;
}

export function mapSale(row: SaleRowRaw): Sale {
  // The embedded relation can arrive as an object or single-element array.
  const cliente = Array.isArray(row.clientes) ? row.clientes[0] : row.clientes;
  return {
    id: row.id,
    clienteId: row.cliente_id,
    nomeCliente: row.nome_cliente,
    clienteNome: cliente?.nome ?? null,
    tipoVenda: row.tipo_venda,
    produto: row.produto,
    quantidade: num(row.quantidade),
    unidade: row.unidade,
    animaisUtilizados: nullableInt(row.animais_utilizados),
    precoUnitario: num(row.preco_unitario),
    valorTotal: num(row.valor_total),
    valorPago: num(row.valor_pago),
    valorRestante: num(row.valor_restante),
    statusPagamento: row.status_pagamento,
    dataVenda: row.data_venda,
    observacao: row.observacao,
    createdAt: row.created_at,
  };
}

export const SALE_SELECT =
  "id, cliente_id, nome_cliente, tipo_venda, produto, quantidade, unidade, " +
  "animais_utilizados, preco_unitario, valor_total, valor_pago, valor_restante, " +
  "status_pagamento, data_venda, observacao, created_at, clientes(nome)";

/** List active sales, newest first. */
export async function listSales(): Promise<Sale[]> {
  const { data, error } = await supabase
    .from("vendas")
    .select(SALE_SELECT)
    .eq("ativo", true)
    .order("data_venda", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as unknown as SaleRowRaw[]).map(mapSale);
}

/** Fetch a single active sale by id. */
export async function getSale(id: string): Promise<Sale | null> {
  const { data, error } = await supabase
    .from("vendas")
    .select(SALE_SELECT)
    .eq("id", id)
    .eq("ativo", true)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapSale(data as unknown as SaleRowRaw) : null;
}

/** Fetch the stock movements created for a sale (effect summary). */
export async function getSaleStockMovements(
  saleId: string,
): Promise<SaleStockMovement[]> {
  const { data, error } = await supabase
    .from("estoque_movimentacoes")
    .select(
      "id, tipo_movimentacao, quantidade, motivo, estoque_itens(nome, unidade)",
    )
    .eq("venda_id", saleId)
    .eq("ativo", true);

  if (error) throw new Error(error.message);

  interface MovRaw {
    id: string;
    tipo_movimentacao: string;
    quantidade: number | string;
    motivo: string;
    estoque_itens:
      | { nome: string; unidade: StockUnit }
      | { nome: string; unidade: StockUnit }[]
      | null;
  }

  return (data as unknown as MovRaw[]).map((m) => {
    const item = Array.isArray(m.estoque_itens) ? m.estoque_itens[0] : m.estoque_itens;
    return {
      id: m.id,
      itemNome: item?.nome ?? null,
      unidade: item?.unidade ?? null,
      tipoMovimentacao: m.tipo_movimentacao,
      quantidade: num(m.quantidade),
      motivo: m.motivo,
    };
  });
}

/** List active customers for the sale customer picker. */
export async function listCustomers(): Promise<CustomerOption[]> {
  const { data, error } = await supabase
    .from("clientes")
    .select("id, nome")
    .eq("ativo", true)
    .order("nome", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as CustomerOption[];
}

/**
 * Register a sale through the atomic `registrar_venda` RPC. The database
 * computes totals/status and applies stock effects; on any rule violation it
 * raises a localized message which is surfaced here.
 */
export async function registrarVenda(input: RegistrarVendaInput): Promise<string> {
  const { data, error } = await supabase.rpc("registrar_venda", {
    p_tipo_venda: input.tipoVenda,
    p_produto: input.produto,
    p_quantidade: input.quantidade,
    p_unidade: input.unidade,
    p_preco_unitario: input.precoUnitario,
    p_valor_pago: input.valorPago,
    p_data_venda: input.dataVenda,
    p_cliente_id: input.clienteId,
    p_nome_cliente: input.nomeCliente,
    p_animais_utilizados: input.animaisUtilizados,
    p_observacao: input.observacao,
  });

  if (error) throw new Error(error.message);
  return data as string;
}
