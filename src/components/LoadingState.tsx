interface LoadingStateProps {
  message?: string;
}

/** Centered loading indicator for page and section data fetches. */
export function LoadingState({ message = "Carregando..." }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 py-12 text-gray-500"
    >
      <span
        aria-hidden
        className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand"
      />
      <span className="text-sm">{message}</span>
    </div>
  );
}

export default LoadingState;
