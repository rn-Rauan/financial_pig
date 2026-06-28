import {
  ExpenseManager,
  type ExpenseEntry,
} from "@/features/expenses/components/ExpenseManager";
import {
  FIXED_COST_CATEGORIES,
  toLabelMap,
} from "@/features/expenses/expenseConstants";
import {
  listFixedCosts,
  registrarGastoFixo,
  type FixedCostCategory,
} from "@/features/expenses/fixedCostsService";

const LABELS = toLabelMap(FIXED_COST_CATEGORIES);

async function load(): Promise<ExpenseEntry[]> {
  const costs = await listFixedCosts();
  return costs.map((c) => ({
    id: c.id,
    categoriaLabel: LABELS[c.categoria] ?? c.categoria,
    valor: c.valor,
    descricao: c.descricao,
    data: c.dataGasto,
  }));
}

export function FixedCostsPage() {
  return (
    <ExpenseManager
      title="Gastos fixos / construção"
      dateLabel="Data do gasto"
      categories={FIXED_COST_CATEGORIES}
      addLabel="Registrar gasto"
      emptyTitle="Nenhum gasto fixo registrado"
      emptyDescription="Registre construção, reforma, equipamentos e materiais."
      inactivateEntity="gastos_fixos"
      load={load}
      submit={async (values) => {
        await registrarGastoFixo({
          categoria: values.categoria as FixedCostCategory,
          valor: values.valor,
          descricao: values.descricao,
          dataGasto: values.data,
          observacao: values.observacao,
        });
      }}
    />
  );
}

export default FixedCostsPage;
