import { useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { ConfirmDialog } from "@/components/ConfirmDialog";

/**
 * Profile screen: shows the signed-in user and provides the logout entry point.
 * Install-prompt UI is added in the PWA story (US8).
 */
export function ProfilePage() {
  const { user, signOut } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await signOut();
    // AuthProvider observes the change and route guards redirect to /login.
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-gray-900">Perfil</h1>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-gray-400">
          Usuário autenticado
        </p>
        <p className="mt-1 break-all text-base font-medium text-gray-900">
          {user?.email ?? "—"}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        disabled={signingOut}
        className="rounded-lg border border-red-200 px-4 py-3 text-base font-semibold text-red-600 active:bg-red-50 disabled:opacity-60"
      >
        {signingOut ? "Saindo..." : "Sair"}
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title="Sair da conta"
        message="Deseja encerrar a sessão atual?"
        confirmLabel="Sair"
        cancelLabel="Cancelar"
        destructive
        onConfirm={() => {
          setConfirmOpen(false);
          void handleSignOut();
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

export default ProfilePage;
