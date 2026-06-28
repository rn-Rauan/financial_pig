import type { AnimalExpenseCategory } from "@/features/expenses/animalExpensesService";
import type { FixedCostCategory } from "@/features/expenses/fixedCostsService";

export interface CategoryOption<T extends string> {
  value: T;
  label: string;
}

/** Animal expense categories (pt-BR labels), schema enum order. */
export const ANIMAL_EXPENSE_CATEGORIES: CategoryOption<AnimalExpenseCategory>[] = [
  { value: "racao", label: "Ração" },
  { value: "milho_consumo", label: "Milho (consumo)" },
  { value: "remedio", label: "Remédio" },
  { value: "veterinario", label: "Veterinário" },
  { value: "transporte", label: "Transporte" },
  { value: "funcionario", label: "Funcionário" },
  { value: "manutencao", label: "Manutenção" },
  { value: "outros", label: "Outros" },
];

/** Fixed/construction cost categories (pt-BR labels), schema enum order. */
export const FIXED_COST_CATEGORIES: CategoryOption<FixedCostCategory>[] = [
  { value: "construcao", label: "Construção" },
  { value: "reforma", label: "Reforma" },
  { value: "equipamentos", label: "Equipamentos" },
  { value: "ferramentas", label: "Ferramentas" },
  { value: "latas", label: "Latas" },
  { value: "baldes", label: "Baldes" },
  { value: "canos", label: "Canos" },
  { value: "arames", label: "Arames" },
  { value: "madeiras", label: "Madeiras" },
  { value: "telhas", label: "Telhas" },
  { value: "materiais_diversos", label: "Materiais diversos" },
  { value: "outros", label: "Outros" },
];

/** Build a value→label lookup from a category option list. */
export function toLabelMap<T extends string>(
  options: CategoryOption<T>[],
): Record<string, string> {
  return Object.fromEntries(options.map((o) => [o.value, o.label]));
}
