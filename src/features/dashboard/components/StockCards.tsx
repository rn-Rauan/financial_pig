import { formatQuantity } from "@/lib/format";
import { Section, StatCard } from "@/features/dashboard/components/StatCard";
import type { DashboardData } from "@/features/dashboard/dashboardService";

/** Current stock summary for the seeded items. */
export function StockCards({ data }: { data: DashboardData }) {
  return (
    <Section title="Estoque atual">
      <StatCard
        label="Porcos / leitões"
        value={`${formatQuantity(data.estoquePorcos)} cab.`}
      />
      <StatCard label="Milho" value={`${formatQuantity(data.estoqueMilho)} sc.`} />
      <StatCard label="Ração" value={`${formatQuantity(data.estoqueRacao)} sc.`} />
    </Section>
  );
}

export default StockCards;
