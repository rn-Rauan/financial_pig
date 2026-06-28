interface MonthSelectorProps {
  year: number;
  /** 1-based month (1 = January). */
  month: number;
  onChange: (year: number, month: number) => void;
}

const MONTH_NAMES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

/** Previous/next month navigation with a readable label. */
export function MonthSelector({ year, month, onChange }: MonthSelectorProps) {
  function shift(delta: number) {
    // month is 1-based; convert to 0-based index math then back.
    const zero = month - 1 + delta;
    const newYear = year + Math.floor(zero / 12);
    const newMonth = ((zero % 12) + 12) % 12; // 0-based, wrapped
    onChange(newYear, newMonth + 1);
  }

  const label = `${MONTH_NAMES[month - 1]} de ${year}`;

  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-2 shadow-sm">
      <button
        type="button"
        aria-label="Mês anterior"
        onClick={() => shift(-1)}
        className="rounded-lg px-3 py-2 text-lg text-gray-600 active:bg-gray-100"
      >
        ‹
      </button>
      <span className="text-sm font-semibold capitalize text-gray-900">
        {label}
      </span>
      <button
        type="button"
        aria-label="Próximo mês"
        onClick={() => shift(1)}
        className="rounded-lg px-3 py-2 text-lg text-gray-600 active:bg-gray-100"
      >
        ›
      </button>
    </div>
  );
}

export default MonthSelector;
