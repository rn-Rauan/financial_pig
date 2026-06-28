import { supabase } from "@/lib/supabase/client";

/** Enum mirror of the database `animal_expense_category` (schema.md). */
export type AnimalExpenseCategory =
  | "racao"
  | "milho_consumo"
  | "remedio"
  | "veterinario"
  | "transporte"
  | "funcionario"
  | "manutencao"
  | "outros";

/** An animal expense row. */
export interface AnimalExpense {
  id: string;
  categoria: AnimalExpenseCategory;
  valor: number;
  descricao: string;
  dataDespesa: string;
  observacao: string | null;
}

/** Input accepted by the `registrar_despesa_animal` RPC wrapper. */
export interface RegistrarDespesaInput {
  categoria: AnimalExpenseCategory;
  valor: number;
  descricao: string;
  dataDespesa: string; // YYYY-MM-DD
  observacao: string | null;
}

function num(value: unknown): number {
  const n = typeof value === "string" ? Number(value) : (value as number);
  return Number.isFinite(n) ? n : 0;
}

interface AnimalExpenseRowRaw {
  id: string;
  categoria: AnimalExpenseCategory;
  valor: number | string;
  descricao: string;
  data_despesa: string;
  observacao: string | null;
}

function mapExpense(row: AnimalExpenseRowRaw): AnimalExpense {
  return {
    id: row.id,
    categoria: row.categoria,
    valor: num(row.valor),
    descricao: row.descricao,
    dataDespesa: row.data_despesa,
    observacao: row.observacao,
  };
}

/** List active animal expenses, newest first. */
export async function listAnimalExpenses(): Promise<AnimalExpense[]> {
  const { data, error } = await supabase
    .from("despesas_animais")
    .select("id, categoria, valor, descricao, data_despesa, observacao")
    .eq("ativo", true)
    .order("data_despesa", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as unknown as AnimalExpenseRowRaw[]).map(mapExpense);
}

/** Register an animal expense through the atomic `registrar_despesa_animal` RPC. */
export async function registrarDespesaAnimal(
  input: RegistrarDespesaInput,
): Promise<string> {
  const { data, error } = await supabase.rpc("registrar_despesa_animal", {
    p_categoria: input.categoria,
    p_valor: input.valor,
    p_descricao: input.descricao,
    p_data_despesa: input.dataDespesa,
    p_observacao: input.observacao,
  });

  if (error) throw new Error(error.message);
  return data as string;
}
