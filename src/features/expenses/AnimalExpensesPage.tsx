import {
  ExpenseManager,
  type ExpenseEntry,
} from "@/features/expenses/components/ExpenseManager";
import {
  ANIMAL_EXPENSE_CATEGORIES,
  toLabelMap,
} from "@/features/expenses/expenseConstants";
import {
  listAnimalExpenses,
  registrarDespesaAnimal,
  type AnimalExpenseCategory,
} from "@/features/expenses/animalExpensesService";

const LABELS = toLabelMap(ANIMAL_EXPENSE_CATEGORIES);

async function load(): Promise<ExpenseEntry[]> {
  const expenses = await listAnimalExpenses();
  return expenses.map((e) => ({
    id: e.id,
    categoriaLabel: LABELS[e.categoria] ?? e.categoria,
    valor: e.valor,
    descricao: e.descricao,
    data: e.dataDespesa,
  }));
}

export function AnimalExpensesPage() {
  return (
    <ExpenseManager
      title="Despesas dos animais"
      dateLabel="Data da despesa"
      categories={ANIMAL_EXPENSE_CATEGORIES}
      addLabel="Registrar despesa"
      emptyTitle="Nenhuma despesa registrada"
      emptyDescription="Registre ração, remédio, veterinário e outros custos dos animais."
      inactivateEntity="despesas_animais"
      load={load}
      submit={async (values) => {
        await registrarDespesaAnimal({
          categoria: values.categoria as AnimalExpenseCategory,
          valor: values.valor,
          descricao: values.descricao,
          dataDespesa: values.data,
          observacao: values.observacao,
        });
      }}
    />
  );
}

export default AnimalExpensesPage;
