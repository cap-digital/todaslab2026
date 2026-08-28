"use client";

import { useState } from "react";

/* ---------- cartões e seções ---------- */

export function Card({
  children,
  className = "",
  tone = "surface",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "surface" | "green" | "purple" | "sunken";
}) {
  const tones: Record<string, string> = {
    surface: "bg-surface",
    green: "bg-green-wash",
    purple: "bg-purple-wash",
    sunken: "bg-sunken",
  };
  return (
    <section
      className={`rounded-blob shadow-card ring-1 ring-ink/5 ${tones[tone]} ${className}`}
    >
      {children}
    </section>
  );
}

export function CardTitle({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-sm font-bold leading-tight text-ink">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-xs text-ink-3">{subtitle}</p> : null}
      </div>
      {right}
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  right,
}: {
  kicker: string;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-green-dark">
          {kicker}
        </p>
        <h1 className="font-display text-xl font-bold text-ink md:text-2xl">{title}</h1>
      </div>
      {right}
    </div>
  );
}

/* ---------- números ---------- */

export function StatValue({
  value,
  size = "md",
  className = "",
}: {
  value: string;
  size?: "md" | "lg" | "hero";
  className?: string;
}) {
  const sizes = { md: "text-xl", lg: "text-2xl md:text-3xl", hero: "text-3xl md:text-4xl 2xl:text-5xl" };
  // números grandes ficam na sans, algarismos proporcionais (nunca tabular aqui)
  return (
    <div className={`font-sans font-bold leading-none tracking-tight text-ink ${sizes[size]} ${className}`}>
      {value}
    </div>
  );
}

export function StatTile({
  label,
  value,
  hint,
  accent = "green",
  size = "md",
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: "green" | "purple" | "orange" | "magenta" | "none";
  size?: "md" | "lg";
}) {
  const dots: Record<string, string> = {
    green: "bg-green",
    purple: "bg-purple",
    orange: "bg-orange",
    magenta: "bg-magenta",
    none: "hidden",
  };
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <span className={`h-2 w-2 rounded-full ${dots[accent]}`} aria-hidden />
        <span className="text-xs font-semibold text-ink-2">{label}</span>
      </div>
      <StatValue value={value} size={size} />
      {hint ? <p className="text-[11px] text-ink-3">{hint}</p> : null}
    </div>
  );
}

/* ---------- medidores ---------- */

export function Meter({
  value,
  label,
  tone = "green",
  height = "h-2.5",
}: {
  /** fração 0..1 (acima de 1 satura o preenchimento) */
  value: number;
  label?: string;
  tone?: "green" | "purple" | "orange" | "magenta";
  height?: string;
}) {
  const fills: Record<string, string> = {
    green: "bg-green",
    purple: "bg-purple",
    orange: "bg-orange",
    magenta: "bg-magenta",
  };
  const tracks: Record<string, string> = {
    green: "bg-green-soft",
    purple: "bg-purple-soft",
    orange: "bg-orange-soft",
    magenta: "bg-magenta-soft",
  };
  const w = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      aria-label={label}
      className={`w-full overflow-hidden rounded-full ${tracks[tone]} ${height}`}
    >
      <div
        className={`${height} rounded-full ${fills[tone]} transition-[width] duration-700 ease-out`}
        style={{ width: `${w}%` }}
      />
    </div>
  );
}

/* ---------- chips e avisos ---------- */

export function Chip({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "green" | "purple" | "orange" | "magenta";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-sunken text-ink-2",
    green: "bg-green-soft text-green-deep",
    purple: "bg-purple-soft text-purple-dark",
    orange: "bg-orange-soft text-orange",
    magenta: "bg-magenta-soft text-magenta",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-sunken px-4 py-3 text-xs leading-relaxed text-ink-2">
      {children}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-6 text-center">
      <Sparkle className="h-6 w-6 text-orange-bright" />
      <p className="max-w-xs text-sm text-ink-3">{message}</p>
    </div>
  );
}

/* ---------- legenda (identidade nunca é só cor) ---------- */

export function Legend({
  items,
}: {
  items: Array<{ label: string; color: string; shape?: "rect" | "line" }>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {items.map((it) => (
        <span key={it.label} className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-2">
          {it.shape === "line" ? (
            <span className="h-0.5 w-4 rounded-full" style={{ background: it.color }} aria-hidden />
          ) : (
            <span className="h-2.5 w-2.5 rounded-[4px]" style={{ background: it.color }} aria-hidden />
          )}
          {it.label}
        </span>
      ))}
    </div>
  );
}

/* ---------- alternador gráfico ⇄ tabela (a tabela é o par acessível) ---------- */

export function TableToggle({
  chart,
  table,
}: {
  chart: React.ReactNode;
  table: { columns: string[]; rows: Array<Array<string | number>> };
}) {
  const [showTable, setShowTable] = useState(false);
  return (
    <div>
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          className="rounded-full px-2.5 py-1 text-[11px] font-bold text-ink-3 transition hover:bg-sunken hover:text-ink-2"
        >
          {showTable ? "ver gráfico" : "ver tabela"}
        </button>
      </div>
      {showTable ? (
        <div className="overflow-x-auto scroll-thin">
          <table className="w-full min-w-[360px] text-left text-xs">
            <thead>
              <tr className="border-b border-grid text-ink-3">
                {table.columns.map((c) => (
                  <th key={c} className="py-2 pr-4 font-semibold">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((r, i) => (
                <tr key={i} className="border-b border-grid/60 last:border-0">
                  {r.map((cell, j) => (
                    <td key={j} className={`py-2 pr-4 ${j === 0 ? "font-semibold text-ink" : "tnum text-ink-2"}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        chart
      )}
    </div>
  );
}

/* ---------- formas decorativas da marca ---------- */

export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 0c1.2 6.8 4 9.6 12 12-8 2.4-10.8 5.2-12 12-1.2-6.8-4-9.6-12-12C8 9.6 10.8 6.8 12 0Z" />
    </svg>
  );
}

export function Flower({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} aria-hidden>
      <path d="M50 6c8 0 14 5 15 12 6-4 14-3 19 2s6 13 2 19c7 1 12 7 12 15s-5 14-12 15c4 6 3 14-2 19s-13 6-19 2c-1 7-7 12-15 12s-14-5-15-12c-6 4-14 3-19-2s-6-13-2-19C7 68 2 62 2 54s5-14 12-15c-4-6-3-14 2-19s13-6 19-2c1-7 7-12 15-12Z" />
    </svg>
  );
}

export function Globe({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <path d="M3.5 9h17M3.5 15h17" />
    </svg>
  );
}
