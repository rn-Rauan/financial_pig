import type { StockUnit } from "@/features/sales/salesService";
import type { StockMovementType } from "@/lib/calculations/stock";
import type { PurchaseType } from "@/features/purchases/purchasesService";

/** Human labels (pt-BR) for purchase types. */
export const PURCHASE_TYPE_LABELS: Record<PurchaseType, string> = {
  porcos_leitoes: "Porcos / leitões",
  milho: "Milho",
  racao: "Ração",
  outros: "Outros",
};

export const PURCHASE_TYPES: PurchaseType[] = [
  "porcos_leitoes",
  "milho",
  "racao",
  "outros",
];

/** Default unit suggested for each purchase type. */
export const DEFAULT_PURCHASE_UNIT_BY_TYPE: Record<PurchaseType, StockUnit> = {
  porcos_leitoes: "cabeca",
  milho: "saca",
  racao: "saca",
  outros: "unidade",
};

/** Human labels (pt-BR) for stock movement types. */
export const MOVEMENT_TYPE_LABELS: Record<StockMovementType, string> = {
  entrada: "Entrada",
  saida: "Saída",
  consumo: "Consumo",
  perda: "Perda",
  ajuste: "Ajuste (definir quantidade)",
};

/** Movement types offered in the manual stock movement form (consumo has its
 * own dedicated screen). */
export const MOVEMENT_TYPES: StockMovementType[] = [
  "entrada",
  "saida",
  "perda",
  "ajuste",
];
