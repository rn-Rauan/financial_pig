import { formatCurrency } from "@/lib/format";
import { Section, StatCard } from "@/features/dashboard/components/StatCard";
import type { DashboardData } from "@/features/dashboard/dashboardService";

/** Monthly outgoing values and profit indicators. */
export function ResultCards({ data }: { data: DashboardData }) {
  return (
    <Section title="Saídas e resultado do mês">
      <StatCard label="Compras" value={formatCurrency(data.comprasTotal)} />
      <StatCard
        label="Despesas animais"
        value={formatCurrency(data.despesasAnimaisTotal)}
      />
      <StatCard
        label="Gastos fixos"
        value={formatCurrency(data.gastosFixosTotal)}
        hint="Inclui construção/reforma"
      />
      <StatCard
        label="Lucro bruto"
        value={formatCurrency(data.lucroBruto)}
        tone={data.lucroBruto >= 0 ? "positive" : "negative"}
      />
      <StatCard
        label="Lucro operacional"
        value={formatCurrency(data.lucroOperacional)}
        tone={data.lucroOperacional >= 0 ? "positive" : "negative"}
        hint="Sem gastos fixos"
      />
      <StatCard
        label="Lucro líquido"
        value={formatCurrency(data.lucroLiquido)}
        emphasis
        tone={data.lucroLiquido >= 0 ? "positive" : "negative"}
      />
    </Section>
  );
}

export default ResultCards;
