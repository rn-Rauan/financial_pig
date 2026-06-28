import { formatCurrency, formatNumber } from "@/lib/format";
import {
  calcSaleTotal,
  calcRemaining,
  calcSaleStatus,
} from "@/lib/calculations/financial";
import { StatusBadge } from "@/features/sales/components/StatusBadge";
import type { SaleType } from "@/features/sales/salesService";

interface SaleCalculatedFieldsProps {
  tipoVenda: SaleType;
  quantidade: number | "";
  precoUnitario: number | "";
  valorPago: number | "";
  animaisUtilizados: number | "";
}

function n(value: number | ""): number {
  return value === "" ? 0 : value;
}

/**
 * Read-only preview of the values the database will compute: total, remaining,
 * status, and pork/meat indicators (kg/head, value/head, value/kg).
 */
export function SaleCalculatedFields({
  tipoVenda,
  quantidade,
  precoUnitario,
  valorPago,
  animaisUtilizados,
}: SaleCalculatedFieldsProps) {
  const qtd = n(quantidade);
  const preco = n(precoUnitario);
  const pago = n(valorPago);
  const animais = n(animaisUtilizados);

  const total = calcSaleTotal(qtd, preco);
  const restante = calcRemaining(total, pago);
  const status = calcSaleStatus(total, pago);

  const isPork = tipoVenda === "porco_carne";
  const kgPorCabeca = isPork && animais > 0 ? qtd / animais : null;
  const valorPorCabeca = isPork && animais > 0 ? total / animais : null;
  const valorPorKg = isPork && qtd > 0 ? total / qtd : null;

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-gray-50 p-3">
      <Row label="Total" value={formatCurrency(total)} strong />
      <Row label="Restante" value={formatCurrency(restante)} />
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Status</span>
        <StatusBadge status={status} />
      </div>

      {isPork ? (
        <>
          <div className="mt-1 border-t border-gray-200 pt-2" />
          <Row
            label="Kg por cabeça"
            value={kgPorCabeca === null ? "—" : `${formatNumber(kgPorCabeca)} kg`}
          />
          <Row
            label="Valor por cabeça"
            value={valorPorCabeca === null ? "—" : formatCurrency(valorPorCabeca)}
          />
          <Row
            label="Valor por kg"
            value={valorPorKg === null ? "—" : formatCurrency(valorPorKg)}
          />
        </>
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

export default SaleCalculatedFields;
