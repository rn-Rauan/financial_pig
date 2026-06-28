import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { ConfirmDialog } from "@/components/ConfirmDialog";

/** Minimal type for the (non-standard) beforeinstallprompt event. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

/**
 * Profile screen: signed-in user, PWA install/status, and logout.
 */
export function ProfilePage() {
  const { user, signOut } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [installed, setInstalled] = useState(isStandalone());

  useEffect(() => {
    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    }
    function onInstalled() {
      setInstalled(true);
      setInstallPrompt(null);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    // Whether accepted or dismissed, the prompt can only be used once.
    setInstallPrompt(null);
  }

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

      {/* PWA install / status */}
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-gray-400">Aplicativo</p>
        {installed ? (
          <p className="mt-1 text-sm text-emerald-600">
            ✓ Instalado — rodando como aplicativo.
          </p>
        ) : installPrompt ? (
          <>
            <p className="mt-1 text-sm text-gray-600">
              Instale o Financial Pig na tela inicial para abrir como app.
            </p>
            <button
              type="button"
              onClick={() => void handleInstall()}
              className="mt-3 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white active:bg-brand-dark"
            >
              Instalar app
            </button>
          </>
        ) : (
          <p className="mt-1 text-sm text-gray-500">
            Para instalar, use o menu do navegador (“Adicionar à tela inicial”).
          </p>
        )}
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
