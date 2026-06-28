import { useCallback, useEffect, useState } from "react";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { formatCurrency } from "@/lib/format";
import {
  fetchMonthlySummary,
  type DashboardData,
} from "@/features/reports/reportsService";
import { PeriodSelector } from "@/features/reports/components/PeriodSelector";
import { ReportTabs } from "@/features/reports/components/ReportTabs";

type Status = "loading" | "error" | "ready";

export function MonthlySummaryPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [status, setStatus] = useState<Status>("loading");
  const [data, setData] = useState<DashboardData | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      setData(await fetchMonthlySummary(year, month));
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [year, month]);

  useEffect(() => {
    void load();
  }, [load]);

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

      {status === "loading" ? <LoadingState message="Carregando resumo..." /> : null}
      {status === "error" ? <ErrorState onRetry={() => void load()} /> : null}

      {status === "ready" && data ? (
        <div className="flex flex-col gap-4">
          <Group title="Receitas">
            <Row label="Total" value={formatCurrency(data.receitaTotal)} strong />
            <Row label="Porco / carne" value={formatCurrency(data.receitaPorcoCarne)} />
            <Row label="Milho" value={formatCurrency(data.receitaMilho)} />
            <Row label="Ração" value={formatCurrency(data.receitaRacao)} />
            <Row label="Outros" value={formatCurrency(data.receitaOutros)} />
          </Group>

          <Group title="Compras">
            <Row label="Total" value={formatCurrency(data.comprasTotal)} strong />
            <Row label="Porcos" value={formatCurrency(data.comprasPorcos)} />
            <Row label="Milho" value={formatCurrency(data.comprasMilho)} />
            <Row label="Ração" value={formatCurrency(data.comprasRacao)} />
          </Group>

          <Group title="Custos">
            <Row
              label="Despesas animais"
              value={formatCurrency(data.despesasAnimaisTotal)}
            />
            <Row
              label="Gastos fixos / construção"
              value={formatCurrency(data.gastosFixosTotal)}
            />
          </Group>

          <Group title="Resultado">
            <Row label="Lucro bruto" value={formatCurrency(data.lucroBruto)} />
            <Row
              label="Lucro operacional"
              value={formatCurrency(data.lucroOperacional)}
            />
            <Row label="Lucro líquido" value={formatCurrency(data.lucroLiquido)} strong />
          </Group>

          <Group title="Caixa">
            <Row label="Saldo atual" value={formatCurrency(data.saldoAtual)} strong />
            <Row label="Contas a receber" value={formatCurrency(data.contasAReceber)} />
          </Group>
        </div>
      ) : null}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
      {children}
    </section>
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

export default MonthlySummaryPage;
