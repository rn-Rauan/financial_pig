import type { CustomerOption } from "@/features/sales/salesService";

export interface CustomerSaleValue {
  clienteId: string | null;
  nomeCliente: string;
}

interface CustomerSaleFieldProps {
  customers: CustomerOption[];
  value: CustomerSaleValue;
  onChange: (value: CustomerSaleValue) => void;
}

/**
 * Customer field with two modes:
 *  - pick a registered customer (clienteId), or
 *  - type a free name (nomeCliente) when the customer is not registered.
 * The customer is optional (a sale can have no customer).
 */
export function CustomerSaleField({
  customers,
  value,
  onChange,
}: CustomerSaleFieldProps) {
  const mode: "registrado" | "avulso" = value.clienteId ? "registrado" : "avulso";

  function setMode(next: "registrado" | "avulso") {
    if (next === mode) return;
    // Reset the other mode's value when switching.
    onChange({ clienteId: null, nomeCliente: "" });
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700">Cliente (opcional)</span>

      <div className="flex gap-2">
        <ModeButton
          active={mode === "registrado"}
          disabled={customers.length === 0}
          onClick={() => setMode("registrado")}
          label="Cadastrado"
        />
        <ModeButton
          active={mode === "avulso"}
          onClick={() => setMode("avulso")}
          label="Nome avulso"
        />
      </div>

      {mode === "registrado" ? (
        <select
          value={value.clienteId ?? ""}
          onChange={(e) =>
            onChange({ clienteId: e.target.value || null, nomeCliente: "" })
          }
          className="rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        >
          <option value="">Sem cliente</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          placeholder="Nome do cliente (opcional)"
          value={value.nomeCliente}
          onChange={(e) =>
            onChange({ clienteId: null, nomeCliente: e.target.value })
          }
          className="rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      )}
    </div>
  );
}

function ModeButton({
  active,
  disabled = false,
  onClick,
  label,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={
        "rounded-lg px-3 py-1.5 text-sm font-medium " +
        (active
          ? "bg-brand text-white"
          : "border border-gray-300 text-gray-600 disabled:opacity-50")
      }
    >
      {label}
    </button>
  );
}

export default CustomerSaleField;
