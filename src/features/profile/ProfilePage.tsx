import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { formatCurrency } from "@/lib/format";
import { parseDecimalInput, validateNonNegativeMoney } from "@/lib/validation";
import {
  getCapitalInicial,
  atualizarCapitalInicial,
} from "@/features/profile/profileService";

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

  // Initial cash (capital_inicial)
  const [capitalStatus, setCapitalStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [capitalAtual, setCapitalAtual] = useState(0);
  const [capitalInput, setCapitalInput] = useState("");
  const [savingCapital, setSavingCapital] = useState(false);
  const [capitalSaved, setCapitalSaved] = useState(false);
  const [capitalError, setCapitalError] = useState<string | null>(null);

  const loadCapital = useCallback(async () => {
    setCapitalStatus("loading");
    try {
      const value = await getCapitalInicial();
      setCapitalAtual(value);
      setCapitalInput(value ? String(value) : "");
      setCapitalStatus("ready");
    } catch {
      setCapitalStatus("error");
    }
  }, []);

  useEffect(() => {
    void loadCapital();
  }, [loadCapital]);

  async function handleSaveCapital(event: FormEvent) {
    event.preventDefault();
    setCapitalSaved(false);
    const parsed = parseDecimalInput(capitalInput);
    const validationError = validateNonNegativeMoney(parsed, "Capital inicial");
    if (validationError || parsed === null) {
      setCapitalError(validationError ?? "Capital inicial é obrigatório.");
      return;
    }
    setCapitalError(null);
    setSavingCapital(true);
    try {
      const saved = await atualizarCapitalInicial(parsed);
      setCapitalAtual(saved);
      setCapitalInput(String(saved));
      setCapitalSaved(true);
    } catch (err) {
      setCapitalError(
        err instanceof Error ? err.message : "Não foi possível salvar o capital.",
      );
    } finally {
      setSavingCapital(false);
    }
  }

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

      {/* Initial cash (capital_inicial) */}
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-gray-400">
          Começou com quanto?
        </p>
        <p className="mb-2 mt-0.5 text-xs text-gray-500">
          Capital/caixa inicial usado como ponto de partida do saldo.
        </p>

        {capitalStatus === "loading" ? (
          <LoadingState />
        ) : capitalStatus === "error" ? (
          <ErrorState
            message="Não foi possível carregar o capital inicial."
            onRetry={() => void loadCapital()}
          />
        ) : (
          <form onSubmit={handleSaveCapital} className="flex flex-col gap-2">
            <p className="text-sm text-gray-600">
              Atual:{" "}
              <span className="font-semibold text-gray-900">
                {formatCurrency(capitalAtual)}
              </span>
            </p>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">
                Novo capital inicial (R$)
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={capitalInput}
                onChange={(e) => {
                  setCapitalInput(e.target.value);
                  setCapitalSaved(false);
                  setCapitalError(null);
                }}
                className="rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </label>

            {capitalError ? (
              <p role="alert" className="text-xs text-red-600">
                {capitalError}
              </p>
            ) : null}
            {capitalSaved ? (
              <p className="text-xs text-emerald-600">✓ Capital inicial salvo.</p>
            ) : null}

            <button
              type="submit"
              disabled={savingCapital}
              className="mt-1 self-start rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white active:bg-brand-dark disabled:opacity-60"
            >
              {savingCapital ? "Salvando..." : "Salvar capital"}
            </button>
          </form>
        )}
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
