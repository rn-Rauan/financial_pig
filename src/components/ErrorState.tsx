interface ErrorStateProps {
  title?: string;
  message?: string;
  /** Optional retry handler; shows a retry button when provided. */
  onRetry?: () => void;
}

/** Error placeholder with an optional retry action. */
export function ErrorState({
  title = "Algo deu errado",
  message = "Não foi possível carregar os dados. Tente novamente.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-2 py-12 text-center"
    >
      <span aria-hidden className="text-4xl">
        ⚠️
      </span>
      <p className="font-medium text-gray-800">{title}</p>
      <p className="max-w-xs text-sm text-gray-500">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white active:bg-brand-dark"
        >
          Tentar novamente
        </button>
      ) : null}
    </div>
  );
}

export default ErrorState;
