import { supabase } from "@/lib/supabase/client";
import {
  fetchDashboard,
  type DashboardData,
} from "@/features/dashboard/dashboardService";

export type { DashboardData };

/**
 * Monthly summary and pig analysis are derived from the same audited read model
 * as the dashboard (`dashboard_mensal`), so the reports never diverge from the
 * dashboard totals. They only present the data differently.
 */
export function fetchMonthlySummary(
  year: number,
  month: number,
): Promise<DashboardData> {
  return fetchDashboard(year, month);
}

export function fetchPigAnalysis(
  year: number,
  month: number,
): Promise<DashboardData> {
  return fetchDashboard(year, month);
}

/** Database history_type enum (schema.md). */
export type HistoryType =
  | "venda_registrada"
  | "pagamento_recebido"
  | "compra_registrada"
  | "estoque_movimentado"
  | "consumo_registrado"
  | "despesa_registrada"
  | "gasto_fixo_registrado"
  | "venda_cancelada"
  | "registro_inativado";

/** A history entry for the history screen. */
export interface HistoryEntry {
  id: string;
  tipo: HistoryType;
  entidade: string;
  descricao: string;
  valor: number | null;
  quantidade: number | null;
  dataEvento: string;
}

function nullableNum(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === "string" ? Number(value) : (value as number);
  return Number.isFinite(n) ? n : null;
}

interface HistoryRowRaw {
  id: string;
  tipo: HistoryType;
  entidade: string;
  descricao: string;
  valor: number | string | null;
  quantidade: number | string | null;
  data_evento: string;
}

/** List recent active history events, newest first. */
export async function listHistory(limit = 200): Promise<HistoryEntry[]> {
  const { data, error } = await supabase
    .from("historico")
    .select("id, tipo, entidade, descricao, valor, quantidade, data_evento")
    .eq("ativo", true)
    .order("data_evento", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return (data as unknown as HistoryRowRaw[]).map((row) => ({
    id: row.id,
    tipo: row.tipo,
    entidade: row.entidade,
    descricao: row.descricao,
    valor: nullableNum(row.valor),
    quantidade: nullableNum(row.quantidade),
    dataEvento: row.data_evento,
  }));
}
