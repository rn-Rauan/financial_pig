import type { SaleType, StockUnit } from "@/features/sales/salesService";

/** Human labels (pt-BR) for sale types. */
export const SALE_TYPE_LABELS: Record<SaleType, string> = {
  porco_carne: "Porco / carne",
  milho: "Milho",
  racao: "Ração",
  outros: "Outros",
};

/** Human labels (pt-BR) for stock units. */
export const UNIT_LABELS: Record<StockUnit, string> = {
  cabeca: "Cabeça",
  saca: "Saca",
  kg: "Kg",
  unidade: "Unidade",
};

/** Default unit suggested for each sale type. */
export const DEFAULT_UNIT_BY_TYPE: Record<SaleType, StockUnit> = {
  porco_carne: "kg",
  milho: "saca",
  racao: "saca",
  outros: "unidade",
};

export const SALE_TYPES: SaleType[] = ["porco_carne", "milho", "racao", "outros"];
export const STOCK_UNITS: StockUnit[] = ["cabeca", "saca", "kg", "unidade"];

/** Labels for payment status badges. */
export const STATUS_LABELS = {
  pago: "Pago",
  parcial: "Parcial",
  fiado: "Fiado",
} as const;
