import { VIZ } from "@/components/chart-kit";

/** Tom de Meter/Chip por estratégia — a cor segue a ENTIDADE em todo o painel. */
export type MeterTone = "green" | "purple" | "orange" | "magenta";

export function estrategiaTone(nome: string): MeterTone {
  const n = nome.toLowerCase();
  if (n.includes("lookalike") || n.includes("look alike")) return "magenta";
  if (n.includes("tráfego") || n.includes("trafego")) return "orange";
  if (n.includes("alcance")) return "purple";
  return "green"; // Engajamento
}

/** Cor de série (VIZ) correspondente — para bolinhas/swatches. */
export function estrategiaColor(nome: string): string {
  const map: Record<MeterTone, string> = {
    green: VIZ.s1,
    purple: VIZ.s2,
    orange: VIZ.s3,
    magenta: VIZ.s4,
  };
  return map[estrategiaTone(nome)];
}
