"use client";

import { useEffect, useRef, useState } from "react";
import { PRESET_LABEL, rangeForPreset, useFilters } from "@/lib/filters";
import { dayLong } from "@/lib/format";
import type { Preset } from "@/lib/types";

const PRESETS: Preset[] = ["hoje", "ontem", "7d", "tudo"];

export function DatePicker() {
  const { range, setRange } = useFilters();
  const [open, setOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState(range.from ?? "");
  const [customTo, setCustomTo] = useState(range.to ?? "");
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

  const summary =
    range.preset === "custom" && range.from && range.to
      ? `${dayLong(range.from)} – ${dayLong(range.to)}`
      : PRESET_LABEL[range.preset];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full bg-surface px-3.5 py-1.5 text-sm font-bold text-ink shadow-card ring-1 ring-ink/5 transition hover:ring-ink/10"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-green-dark" aria-hidden>
          <rect x="3" y="5" width="18" height="16" rx="3" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
        {summary}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`h-3.5 w-3.5 text-ink-3 transition ${open ? "rotate-180" : ""}`} aria-hidden>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <div className="fixed inset-x-4 z-50 mt-2 rounded-3xl bg-surface p-2 shadow-pop ring-1 ring-ink/10 sm:absolute sm:left-auto sm:right-0 sm:w-72">
          <ul role="listbox" aria-label="Período">
            {PRESETS.map((p) => {
              const selected = range.preset === p;
              return (
                <li key={p}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      setRange(rangeForPreset(p));
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-left text-sm transition hover:bg-sunken ${
                      selected ? "font-bold text-ink" : "font-medium text-ink-2"
                    }`}
                  >
                    {PRESET_LABEL[p]}
                    {selected ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-4 w-4 text-green-dark" aria-hidden>
                        <path d="m5 13 4 4L19 7" />
                      </svg>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-1 border-t border-grid px-3.5 py-3">
            <p className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-ink-3">
              Personalizado
              {range.preset === "custom" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-4 w-4 shrink-0 text-green-dark" aria-hidden>
                  <path d="m5 13 4 4L19 7" />
                </svg>
              ) : null}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                aria-label="De"
                className="min-w-0 flex-1 rounded-xl bg-sunken px-2.5 py-2 text-xs font-semibold text-ink accent-green [color-scheme:light]"
              />
              <span className="shrink-0 text-xs font-medium text-ink-3">até</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                aria-label="Até"
                className="min-w-0 flex-1 rounded-xl bg-sunken px-2.5 py-2 text-xs font-semibold text-ink accent-green [color-scheme:light]"
              />
            </div>
            <button
              type="button"
              disabled={!customFrom || !customTo || customFrom > customTo}
              onClick={() => {
                setRange({ preset: "custom", from: customFrom, to: customTo });
                setOpen(false);
              }}
              className="mt-2.5 w-full rounded-xl px-3 py-2 text-xs font-bold transition enabled:bg-green enabled:text-white enabled:hover:bg-green-dark disabled:cursor-not-allowed disabled:bg-sunken disabled:text-ink-3"
            >
              Aplicar
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
