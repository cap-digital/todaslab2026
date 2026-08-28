"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Dropdown com a linguagem do painel (mesma pílula/popover do DatePicker),
 * no lugar do <select> nativo que destoa da identidade visual.
 */
export function SelectPill({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = options.find((o) => o.value === value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        className="flex items-center gap-2 rounded-full bg-surface px-3.5 py-1.5 text-sm font-bold text-ink shadow-card ring-1 ring-ink/5 transition hover:ring-ink/10"
      >
        <span className="max-w-[180px] truncate">{active?.label ?? label}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`h-3.5 w-3.5 shrink-0 text-ink-3 transition ${open ? "rotate-180" : ""}`} aria-hidden>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <div className="absolute left-0 z-50 mt-2 w-max min-w-full max-w-[min(280px,calc(100vw-2rem))] rounded-3xl bg-surface p-2 shadow-pop ring-1 ring-ink/10">
          <ul role="listbox" aria-label={label}>
            {options.map((o) => {
              const selected = o.value === value;
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-2xl px-3.5 py-2.5 text-left text-sm transition hover:bg-sunken ${
                      selected ? "font-bold text-ink" : "font-medium text-ink-2"
                    }`}
                  >
                    <span className="truncate">{o.label}</span>
                    {selected ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-4 w-4 shrink-0 text-green-dark" aria-hidden>
                        <path d="m5 13 4 4L19 7" />
                      </svg>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
