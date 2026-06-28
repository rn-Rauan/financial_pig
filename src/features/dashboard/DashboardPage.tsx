import { useCallback, useEffect, useState } from "react";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { MonthSelector } from "@/features/dashboard/components/MonthSelector";
import { CashCards } from "@/features/dashboard/components/CashCards";
import { RevenueCards } from "@/features/dashboard/components/RevenueCards";
import { ResultCards } from "@/features/dashboard/components/ResultCards";
import { StockCards } from "@/features/dashboard/components/StockCards";
import { PigSummary } from "@/features/dashboard/components/PigSummary";
import {
  fetchDashboard,
  isDashboardEmpty,
  type DashboardData,
} from "@/features/dashboard/dashboardService";

type Status = "loading" | "error" | "ready";

export function DashboardPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-based

  const [status, setStatus] = useState<Status>("loading");
  const [data, setData] = useState<DashboardData | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const result = await fetchDashboard(year, month);
      setData(result);
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
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-gray-900">Início</h1>
        <p className="text-sm text-gray-500">Resumo do negócio no mês</p>
      </div>

      <MonthSelector
        year={year}
        month={month}
        onChange={(y, m) => {
          setYear(y);
          setMonth(m);
        }}
      />

      {status === "loading" ? <LoadingState message="Carregando indicadores..." /> : null}

      {status === "error" ? (
        <ErrorState
          message="Não foi possível carregar o dashboard."
          onRetry={() => void load()}
        />
      ) : null}

      {status === "ready" && data ? (
        isDashboardEmpty(data) ? (
          <EmptyState
            title="Sem movimentos neste mês"
            description="Registre vendas, compras e despesas para ver os indicadores aqui."
          />
        ) : (
          <div className="flex flex-col gap-5">
            <CashCards data={data} />
            <RevenueCards data={data} />
            <ResultCards data={data} />
            <StockCards data={data} />
            <PigSummary data={data} />
          </div>
        )
      ) : null}
    </div>
  );
}

export default DashboardPage;
