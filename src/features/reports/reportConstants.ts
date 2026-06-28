import type { HistoryType } from "@/features/reports/reportsService";

/** Human labels (pt-BR) for history event types. */
export const HISTORY_TYPE_LABELS: Record<HistoryType, string> = {
  venda_registrada: "Venda registrada",
  pagamento_recebido: "Pagamento recebido",
  compra_registrada: "Compra registrada",
  estoque_movimentado: "Estoque movimentado",
  consumo_registrado: "Consumo registrado",
  despesa_registrada: "Despesa registrada",
  gasto_fixo_registrado: "Gasto fixo registrado",
  venda_cancelada: "Venda inativada",
  registro_inativado: "Registro inativado",
};

export const HISTORY_TYPES: HistoryType[] = [
  "venda_registrada",
  "pagamento_recebido",
  "compra_registrada",
  "estoque_movimentado",
  "consumo_registrado",
  "despesa_registrada",
  "gasto_fixo_registrado",
  "venda_cancelada",
  "registro_inativado",
];
