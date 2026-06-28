import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoadingState } from "@/components/LoadingState";
import {
  listCustomers,
  registrarVenda,
  type CustomerOption,
  type RegistrarVendaInput,
} from "@/features/sales/salesService";
import { SaleForm } from "@/features/sales/components/SaleForm";

type LoadStatus = "loading" | "error" | "ready";

export function SaleFormPage() {
  const navigate = useNavigate();
  const [loadStatus, setLoadStatus] = useState<LoadStatus>("loading");
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function loadCustomers() {
    setLoadStatus("loading");
    listCustomers()
      .then((list) => {
        setCustomers(list);
        setLoadStatus("ready");
      })
      .catch(() => {
        setCustomers([]);
        setLoadStatus("error");
      });
  }

  useEffect(() => {
    let active = true;
    listCustomers()
      .then((list) => {
        if (active) {
          setCustomers(list);
          setLoadStatus("ready");
        }
      })
      .catch(() => {
        if (active) setLoadStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(input: RegistrarVendaInput) {
    setServerError(null);
    setSubmitting(true);
    try {
      const id = await registrarVenda(input);
      navigate(`/vendas/${id}`, { replace: true });
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Não foi possível registrar a venda.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Link to="/vendas" className="text-sm text-brand">
          ‹ Vendas
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Nova venda</h1>
      </div>

      {loadStatus === "loading" ? <LoadingState /> : null}

      {loadStatus === "error" ? (
        <div
          role="status"
          className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
        >
          <p>
            Não foi possível carregar os clientes. A venda ainda pode ser
            registrada com nome avulso.
          </p>
          <button
            type="button"
            onClick={loadCustomers}
            className="mt-2 text-sm font-semibold text-amber-900 underline"
          >
            Tentar carregar clientes novamente
          </button>
        </div>
      ) : null}

      {loadStatus !== "loading" ? (
        <SaleForm
          customers={customers}
          submitting={submitting}
          serverError={serverError}
          onSubmit={(input) => void handleSubmit(input)}
        />
      ) : null}
    </div>
  );
}

export default SaleFormPage;
