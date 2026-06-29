import { supabase } from "@/lib/supabase/client";

/**
 * Dashboard read model returned by the `dashboard_mensal` Postgres function
 * (supabase/migrations/003_dashboard_read_model.sql). All values come from real
 * Supabase data; averages are null when there is nothing to average.
 */
export interface DashboardData {
  receitaTotal: number;
  receitaPorcoCarne: number;
  receitaMilho: number;
  receitaRacao: number;
  receitaOutros: number;
  comprasTotal: number;
  comprasPorcos: number;
  comprasMilho: number;
  comprasRacao: number;
  despesasAnimaisTotal: number;
  gastosFixosTotal: number;
  contasAReceber: number;
  saldoAtual: number;
  lucroBruto: number;
  lucroLiquido: number;
  lucroOperacional: number;
  estoquePorcos: number;
  estoqueMilho: number;
  estoqueRacao: number;
  totalKgPorcoCarne: number;
  totalAnimaisUtilizados: number;
  mediaKgPorCabeca: number | null;
  valorMedioPorCabeca: number | null;
  valorMedioPorKg: number | null;
}

/** Raw row shape as returned by the RPC (snake_case, possibly string numerics). */
interface DashboardRow {
  receita_total: number | string | null;
  receita_porco_carne: number | string | null;
  receita_milho: number | string | null;
  receita_racao: number | string | null;
  receita_outros: number | string | null;
  compras_total: number | string | null;
  compras_porcos: number | string | null;
  compras_milho: number | string | null;
  compras_racao: number | string | null;
  despesas_animais_total: number | string | null;
  gastos_fixos_total: number | string | null;
  contas_a_receber: number | string | null;
  saldo_atual: number | string | null;
  lucro_bruto: number | string | null;
  lucro_liquido: number | string | null;
  lucro_operacional: number | string | null;
  estoque_porcos: number | string | null;
  estoque_milho: number | string | null;
  estoque_racao: number | string | null;
  total_kg_porco_carne: number | string | null;
  total_animais_utilizados: number | string | null;
  media_kg_por_cabeca: number | string | null;
  valor_medio_por_cabeca: number | string | null;
  valor_medio_por_kg: number | string | null;
}

function num(value: number | string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  const n = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(n) ? n : 0;
}

function nullableNum(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(n) ? n : null;
}

function mapRow(row: DashboardRow): DashboardData {
  return {
    receitaTotal: num(row.receita_total),
    receitaPorcoCarne: num(row.receita_porco_carne),
    receitaMilho: num(row.receita_milho),
    receitaRacao: num(row.receita_racao),
    receitaOutros: num(row.receita_outros),
    comprasTotal: num(row.compras_total),
    comprasPorcos: num(row.compras_porcos),
    comprasMilho: num(row.compras_milho),
    comprasRacao: num(row.compras_racao),
    despesasAnimaisTotal: num(row.despesas_animais_total),
    gastosFixosTotal: num(row.gastos_fixos_total),
    contasAReceber: num(row.contas_a_receber),
    saldoAtual: num(row.saldo_atual),
    lucroBruto: num(row.lucro_bruto),
    lucroLiquido: num(row.lucro_liquido),
    lucroOperacional: num(row.lucro_operacional),
    estoquePorcos: num(row.estoque_porcos),
    estoqueMilho: num(row.estoque_milho),
    estoqueRacao: num(row.estoque_racao),
    totalKgPorcoCarne: num(row.total_kg_porco_carne),
    totalAnimaisUtilizados: num(row.total_animais_utilizados),
    mediaKgPorCabeca: nullableNum(row.media_kg_por_cabeca),
    valorMedioPorCabeca: nullableNum(row.valor_medio_por_cabeca),
    valorMedioPorKg: nullableNum(row.valor_medio_por_kg),
  };
}

/**
 * Fetch dashboard indicators for a given month (1-based) and year from Supabase.
 * Throws on error so the page can show a retryable error state.
 *
 * Always reads fresh from the `dashboard_mensal` RPC (no client cache), so cash
 * reflects the latest `configuracoes.capital_inicial` set in Profile (US9) as
 * soon as the dashboard is re-opened or refreshed.
 */
export async function fetchDashboard(
  year: number,
  month: number,
): Promise<DashboardData> {
  const { data, error } = await supabase.rpc("dashboard_mensal", {
    p_ano: year,
    p_mes: month,
  });

  if (error) {
    throw new Error(error.message);
  }

  // A set-returning function yields an array; take the single row.
  const row = (Array.isArray(data) ? data[0] : data) as DashboardRow | undefined;
  if (!row) {
    throw new Error("Resposta inesperada do dashboard.");
  }
  return mapRow(row);
}

/**
 * True when the selected month and current balances have no meaningful activity,
 * so the page can show an empty state instead of a grid of zeros.
 */
export function isDashboardEmpty(data: DashboardData): boolean {
  return (
    data.receitaTotal === 0 &&
    data.comprasTotal === 0 &&
    data.despesasAnimaisTotal === 0 &&
    data.gastosFixosTotal === 0 &&
    data.contasAReceber === 0 &&
    data.saldoAtual === 0 &&
    data.estoquePorcos === 0 &&
    data.estoqueMilho === 0 &&
    data.estoqueRacao === 0
  );
}
