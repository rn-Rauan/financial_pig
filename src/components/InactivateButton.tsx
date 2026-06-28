import { useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  inativarRegistro,
  type InactivatableEntity,
} from "@/lib/supabase/inactivationService";

interface InactivateButtonProps {
  entidade: InactivatableEntity;
  registroId: string;
  /** Called after a successful inactivation (e.g. reload list or navigate). */
  onDone: () => void;
  label?: string;
  confirmMessage?: string;
  /** Compact variant for list rows. */
  variant?: "button" | "link";
}

/**
 * Confirm + soft-delete a record via `inativar_registro`. Surfaces the RPC's
 * localized error (e.g. a purchase whose stock was already used) inline.
 */
export function InactivateButton({
  entidade,
  registroId,
  onDone,
  label = "Inativar",
  confirmMessage = "Este registro será inativado e deixará de aparecer nas listas. Deseja continuar?",
  variant = "button",
}: InactivateButtonProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setOpen(false);
    setError(null);
    setBusy(true);
    try {
      await inativarRegistro(entidade, registroId);
      onDone();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível inativar o registro.",
      );
    } finally {
      setBusy(false);
    }
  }

  const className =
    variant === "link"
      ? "text-sm font-medium text-red-600 disabled:opacity-60"
      : "rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 active:bg-red-50 disabled:opacity-60";

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={busy}
        onClick={() => setOpen(true)}
        className={className}
      >
        {busy ? "Inativando..." : label}
      </button>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}

      <ConfirmDialog
        open={open}
        title="Inativar registro"
        message={confirmMessage}
        confirmLabel="Inativar"
        cancelLabel="Cancelar"
        destructive
        onConfirm={() => void handleConfirm()}
        onCancel={() => setOpen(false)}
      />
    </div>
  );
}

export default InactivateButton;
