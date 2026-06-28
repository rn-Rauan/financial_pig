import type { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  /** Optional call to action (e.g. an "Add" button). */
  action?: ReactNode;
}

/** Friendly placeholder shown when a list or screen has no data. */
export function EmptyState({
  title = "Nada por aqui ainda",
  description,
  icon = "🐷",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <span aria-hidden className="text-4xl">
        {icon}
      </span>
      <p className="font-medium text-gray-700">{title}</p>
      {description ? (
        <p className="max-w-xs text-sm text-gray-500">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
