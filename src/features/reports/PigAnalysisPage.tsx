import { useCallback, useEffect, useState } from "react";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { formatCurrency, formatNumber } from "@/lib/format";
import {
  fetchPigAnalysis,
  type DashboardData,
} from "@/features/reports/reportsService";
import { PeriodSelector } from "@/features/reports/components/PeriodSelector";
import { ReportTabs } from "@/features/reports/components/ReportTabs";

type Status = "loading" | "error" | "ready";

function orDash(value: number | null, format: (n: number) => string): string {
  return value === null ? "—" : format(value);
}

export function PigAnalysisPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [status, setStatus] = useState<Status>("loading");
  const [data, setData] = useState<DashboardData | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      setData(await fetchPigAnalysis(year, month));
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [year, month]);

  useEffect(() => {
    void load();
  }, [load]);

  // No pig sales in the period: avoid showing a grid of zeros.
  const noPigSales =
    data !== null &&
    data.totalAnimaisUtilizados === 0 &&
    data.totalKgPorcoCarne === 0 &&
    data.receitaPorcoCarne === 0;
  const resultadoPorcos = data ? data.receitaPorcoCarne - data.comprasPorcos : 0;
  const receitaSobreCompra =
    data && data.comprasPorcos > 0
      ? data.receitaPorcoCarne / data.comprasPorcos
      : null;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-gray-900">Relatórios</h1>
      <ReportTabs />
      <PeriodSelector
        year={year}
        month={month}
        onChange={(y, m) => {
          setYear(y);
          setMonth(m);
        }}
      />

      {status === "loading" ? <LoadingState message="Carregando análise..." /> : null}
      {status === "error" ? <ErrorState onRetry={() => void load()} /> : null}

      {status === "ready" && data ? (
        noPigSales ? (
          <EmptyState
            title="Sem vendas de porco/carne no mês"
            description="Os indicadores de porcos aparecem após registrar vendas do tipo porco/carne."
          />
        ) : (
          <section className="flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm">
            <Row label="Receita porco / carne" value={formatCurrency(data.receitaPorcoCarne)} strong />
            <Row label="Compra de porcos / leitÃµes" value={formatCurrency(data.comprasPorcos)} />
            <Row
              label="Receita - compra de porcos"
              value={formatCurrency(resultadoPorcos)}
              strong
            />
            <Row
              label="Receita / custo de compra"
              value={orDash(receitaSobreCompra, (n) => `${formatNumber(n)}x`)}
            />
            <Row label="Kg vendidos" value={`${formatNumber(data.totalKgPorcoCarne)} kg`} />
            <Row
              label="Animais utilizados"
              value={formatNumber(data.totalAnimaisUtilizados, 0)}
            />
            <Row
              label="Kg por cabeça"
              value={orDash(data.mediaKgPorCabeca, (n) => `${formatNumber(n)} kg`)}
            />
            <Row
              label="Valor por cabeça"
              value={orDash(data.valorMedioPorCabeca, formatCurrency)}
            />
            <Row
              label="Valor por kg"
              value={orDash(data.valorMedioPorKg, formatCurrency)}
            />
          </section>
        )
      ) : null}
    </div>
  );
}

function Row({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span
        className={"text-sm " + (strong ? "font-semibold text-gray-900" : "text-gray-800")}
      >
        {value}
      </span>
    </div>
  );
}

export default PigAnalysisPage;
