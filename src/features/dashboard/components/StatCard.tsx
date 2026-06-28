import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  /** Visual emphasis for primary numbers (e.g. cash balance). */
  emphasis?: boolean;
  /** Tone for result values. */
  tone?: "neutral" | "positive" | "negative";
}

/** Compact metric card used across the dashboard sections. */
export function StatCard({
  label,
  value,
  hint,
  emphasis = false,
  tone = "neutral",
}: StatCardProps) {
  const toneClass =
    tone === "positive"
      ? "text-emerald-600"
      : tone === "negative"
        ? "text-red-600"
        : "text-gray-900";

  return (
    <div className="rounded-xl bg-white p-3 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p
        className={
          (emphasis ? "text-xl font-bold " : "text-base font-semibold ") + toneClass
        }
      >
        {value}
      </p>
      {hint ? <p className="mt-0.5 text-[11px] text-gray-400">{hint}</p> : null}
    </div>
  );
}

interface SectionProps {
  title: string;
  children: ReactNode;
}

/** Titled section wrapper grouping a set of cards. */
export function Section({ title, children }: SectionProps) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
      <div className="grid grid-cols-2 gap-2">{children}</div>
    </section>
  );
}
