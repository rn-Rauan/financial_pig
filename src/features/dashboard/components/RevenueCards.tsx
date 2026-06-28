import { formatCurrency } from "@/lib/format";
import { Section, StatCard } from "@/features/dashboard/components/StatCard";
import type { DashboardData } from "@/features/dashboard/dashboardService";

/** Monthly revenue total and breakdown by sale type. */
export function RevenueCards({ data }: { data: DashboardData }) {
  return (
    <Section title="Receita do mês">
      <StatCard
        label="Receita total"
        value={formatCurrency(data.receitaTotal)}
        emphasis
        tone={data.receitaTotal > 0 ? "positive" : "neutral"}
      />
      <StatCard label="Porco / carne" value={formatCurrency(data.receitaPorcoCarne)} />
      <StatCard label="Milho" value={formatCurrency(data.receitaMilho)} />
      <StatCard label="Ração" value={formatCurrency(data.receitaRacao)} />
      <StatCard label="Outros" value={formatCurrency(data.receitaOutros)} />
    </Section>
  );
}

export default RevenueCards;
