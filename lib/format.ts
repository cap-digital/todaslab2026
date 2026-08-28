/** Formatação pt-BR usada em todo o painel. */

export function brl(n: number, opts?: { cents?: boolean }): string {
  const cents = opts?.cents ?? n < 100;
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });
}

/** 1234 → "1.234" */
export function int(n: number): string {
  return Math.round(n).toLocaleString("pt-BR");
}

/** 12934 → "12,9 mil" · 1200000 → "1,2 mi" */
export function compact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${(n / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mi`;
  if (abs >= 10_000) return `${(n / 1_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil`;
  return int(n);
}

/** 0.1234 → "12,3%" (recebe fração) */
export function pct(fraction: number, digits = 1): string {
  return `${(fraction * 100).toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

/** "2026-08-28" → "28/08" */
export function dayLabel(day: string): string {
  const [, m, d] = day.split("-");
  return `${d}/${m}`;
}

/** "2026-08-28" → "28 ago" */
export function dayLong(day: string): string {
  const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const [, m, d] = day.split("-");
  return `${d} ${months[Number(m) - 1] ?? m}`;
}

/** ISO → "28/08, 12:57" no fuso de São Paulo */
export function timestampLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}

export const GENDER_LABEL: Record<string, string> = {
  female: "Mulheres",
  male: "Homens",
  unknown: "Não informado",
};
