import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";

interface LocationState {
  from?: { pathname?: string };
}

/**
 * Login screen for the single app user. There is no registration link
 * (UI Flow Contract / quickstart.md).
 */
export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo =
    (location.state as LocationState | null)?.from?.pathname ?? "/";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await signIn(email, password);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <span aria-hidden className="text-5xl">
            🐷
          </span>
          <h1 className="text-2xl font-bold text-gray-900">Financial Pig</h1>
          <p className="text-sm text-gray-500">Entre para continuar</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm"
        >
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            E-mail
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Senha
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </label>

          {error ? (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-lg bg-brand px-4 py-3 text-base font-semibold text-white active:bg-brand-dark disabled:opacity-60"
          >
            {submitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
