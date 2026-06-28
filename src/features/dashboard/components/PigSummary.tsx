import { formatCurrency, formatNumber } from "@/lib/format";
import { Section, StatCard } from "@/features/dashboard/components/StatCard";
import type { DashboardData } from "@/features/dashboard/dashboardService";

/** Dash for averages that are undefined (no animals/kg in the period). */
function orDash(
  value: number | null,
  format: (n: number) => string,
): string {
  return value === null ? "—" : format(value);
}

/** Pig/meat performance indicators for the selected month. */
export function PigSummary({ data }: { data: DashboardData }) {
  return (
    <Section title="Desempenho dos porcos (mês)">
      <StatCard
        label="Kg vendidos"
        value={`${formatNumber(data.totalKgPorcoCarne)} kg`}
      />
      <StatCard
        label="Animais usados"
        value={formatNumber(data.totalAnimaisUtilizados, 0)}
      />
      <StatCard
        label="Kg por cabeça"
        value={orDash(data.mediaKgPorCabeca, (n) => `${formatNumber(n)} kg`)}
      />
      <StatCard
        label="Valor por cabeça"
        value={orDash(data.valorMedioPorCabeca, formatCurrency)}
      />
      <StatCard
        label="Valor por kg"
        value={orDash(data.valorMedioPorKg, formatCurrency)}
      />
    </Section>
  );
}

export default PigSummary;
