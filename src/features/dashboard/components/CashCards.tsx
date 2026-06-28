import { formatCurrency } from "@/lib/format";
import { Section, StatCard } from "@/features/dashboard/components/StatCard";
import type { DashboardData } from "@/features/dashboard/dashboardService";

/** Cash balance and receivables. Receivables are kept separate from cash. */
export function CashCards({ data }: { data: DashboardData }) {
  return (
    <Section title="Caixa">
      <StatCard
        label="Saldo atual"
        value={formatCurrency(data.saldoAtual)}
        emphasis
        tone={data.saldoAtual < 0 ? "negative" : "neutral"}
        hint="Capital + recebidos − pagos"
      />
      <StatCard
        label="Contas a receber"
        value={formatCurrency(data.contasAReceber)}
        hint="Fiado e parciais em aberto"
      />
    </Section>
  );
}

export default CashCards;
