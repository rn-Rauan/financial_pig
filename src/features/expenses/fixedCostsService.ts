import { supabase } from "@/lib/supabase/client";

/** Enum mirror of the database `fixed_cost_category` (schema.md). */
export type FixedCostCategory =
  | "construcao"
  | "reforma"
  | "equipamentos"
  | "ferramentas"
  | "latas"
  | "baldes"
  | "canos"
  | "arames"
  | "madeiras"
  | "telhas"
  | "materiais_diversos"
  | "outros";

/** A fixed/construction cost row. */
export interface FixedCost {
  id: string;
  categoria: FixedCostCategory;
  valor: number;
  descricao: string;
  dataGasto: string;
  observacao: string | null;
}

/** Input accepted by the `registrar_gasto_fixo` RPC wrapper. */
export interface RegistrarGastoFixoInput {
  categoria: FixedCostCategory;
  valor: number;
  descricao: string;
  dataGasto: string; // YYYY-MM-DD
  observacao: string | null;
}

function num(value: unknown): number {
  const n = typeof value === "string" ? Number(value) : (value as number);
  return Number.isFinite(n) ? n : 0;
}

interface FixedCostRowRaw {
  id: string;
  categoria: FixedCostCategory;
  valor: number | string;
  descricao: string;
  data_gasto: string;
  observacao: string | null;
}

function mapFixedCost(row: FixedCostRowRaw): FixedCost {
  return {
    id: row.id,
    categoria: row.categoria,
    valor: num(row.valor),
    descricao: row.descricao,
    dataGasto: row.data_gasto,
    observacao: row.observacao,
  };
}

/** List active fixed/construction costs, newest first. */
export async function listFixedCosts(): Promise<FixedCost[]> {
  const { data, error } = await supabase
    .from("gastos_fixos")
    .select("id, categoria, valor, descricao, data_gasto, observacao")
    .eq("ativo", true)
    .order("data_gasto", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as unknown as FixedCostRowRaw[]).map(mapFixedCost);
}

/** Register a fixed/construction cost through the atomic `registrar_gasto_fixo` RPC. */
export async function registrarGastoFixo(
  input: RegistrarGastoFixoInput,
): Promise<string> {
  const { data, error } = await supabase.rpc("registrar_gasto_fixo", {
    p_categoria: input.categoria,
    p_valor: input.valor,
    p_descricao: input.descricao,
    p_data_gasto: input.dataGasto,
    p_observacao: input.observacao,
  });

  if (error) throw new Error(error.message);
  return data as string;
}
