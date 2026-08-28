"use client";

/** Chaves de ordenação da galeria — campos numéricos de AdSummary. */
export type SortKey = "impressions" | "investimento" | "clicks" | "engagement";

export const SORT_OPTIONS: Array<{ key: SortKey; label: string }> = [
  { key: "impressions", label: "Impressões" },
  { key: "investimento", label: "Investimento" },
  { key: "clicks", label: "Cliques" },
  { key: "engagement", label: "Engajamento" },
];

export function SortBar({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (k: SortKey) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Ordenar galeria por"
      className="flex flex-wrap items-center gap-2"
    >
      <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-3">
        Ordenar por
      </span>
      {SORT_OPTIONS.map((o) => {
        const active = o.key === value;
        return (
          <button
            key={o.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.key)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-bold transition ${
              active
                ? "bg-green text-white shadow-card"
                : "bg-surface text-ink-2 ring-1 ring-ink/10 hover:text-ink"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
