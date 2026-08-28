"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { useData } from "./data";
import { distinct } from "./aggregate";
import type { DateRange, Preset, Row } from "./types";

function todayISO(): string {
  const now = new Date();
  const brt = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  return brt.toISOString().slice(0, 10);
}

function shiftDay(day: string, delta: number): string {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

export function rangeForPreset(preset: Preset): DateRange {
  const today = todayISO();
  switch (preset) {
    case "hoje":
      return { preset, from: today, to: today };
    case "ontem": {
      const y = shiftDay(today, -1);
      return { preset, from: y, to: y };
    }
    case "7d":
      return { preset, from: shiftDay(today, -6), to: today };
    case "tudo":
    default:
      return { preset: "tudo", from: null, to: null };
  }
}

export const PRESET_LABEL: Record<Preset, string> = {
  hoje: "Hoje",
  ontem: "Ontem",
  "7d": "Últimos 7 dias",
  tudo: "Todo o período",
  custom: "Personalizado",
};

type FiltersContextValue = {
  range: DateRange;
  setRange: (r: DateRange) => void;
  ciclo: string; // "todos" ou valor da base
  setCiclo: (c: string) => void;
  estrategia: string; // "todas" ou valor da base
  setEstrategia: (e: string) => void;
  /** linhas já fatiadas por período + ciclo + estratégia — use isto nas páginas */
  rows: Row[];
  /** linhas fatiadas só pelo período (para selects não colapsarem) */
  allRows: Row[];
  ciclosDisponiveis: string[];
  estrategiasDisponiveis: string[];
};

const FiltersContext = createContext<FiltersContextValue | null>(null);

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const { rows: allRows } = useData();
  const [range, setRange] = useState<DateRange>(rangeForPreset("tudo"));
  const [ciclo, setCiclo] = useState("todos");
  const [estrategia, setEstrategia] = useState("todas");

  const value = useMemo(() => {
    const inRange = allRows.filter((r) => {
      if (range.from && r.date < range.from) return false;
      if (range.to && r.date > range.to) return false;
      return true;
    });
    const rows = inRange.filter(
      (r) =>
        (ciclo === "todos" || r.ciclo === ciclo) &&
        (estrategia === "todas" || r.estrategia === estrategia)
    );
    return {
      range,
      setRange,
      ciclo,
      setCiclo,
      estrategia,
      setEstrategia,
      rows,
      allRows: inRange,
      ciclosDisponiveis: distinct(allRows, (r) => r.ciclo),
      estrategiasDisponiveis: distinct(allRows, (r) => r.estrategia),
    };
  }, [allRows, range, ciclo, estrategia]);

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters(): FiltersContextValue {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters precisa estar dentro de <FiltersProvider>");
  return ctx;
}
