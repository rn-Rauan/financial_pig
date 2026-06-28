import type { SaleStatus } from "@/features/sales/salesService";
import { STATUS_LABELS } from "@/features/sales/saleConstants";

const TONE: Record<SaleStatus, string> = {
  pago: "bg-emerald-100 text-emerald-700",
  parcial: "bg-amber-100 text-amber-700",
  fiado: "bg-red-100 text-red-700",
};

/** Colored payment-status badge. */
export function StatusBadge({ status }: { status: SaleStatus }) {
  return (
    <span
      className={
        "inline-block rounded-full px-2 py-0.5 text-xs font-medium " + TONE[status]
      }
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export default StatusBadge;
