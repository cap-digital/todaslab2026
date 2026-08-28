import { VIZ } from "@/components/chart-kit";

/** Tom de Chip por estratégia — a cor segue a ENTIDADE em todo o painel. */
export type ChipTone = "neutral" | "green" | "purple" | "orange" | "magenta";

export function estrategiaTone(estrategia: string): ChipTone {
  const n = estrategia.toLowerCase();
  if (n.includes("look")) return "magenta"; // Tráfego - Lookalike
  if (n.includes("tráfego") || n.includes("trafego")) return "orange";
  if (n.includes("alcance")) return "purple";
  if (n.includes("engaj")) return "green";
  return "neutral";
}

/** Cor de série (VIZ) da estratégia — para swatches/pontos de identidade. */
export function estrategiaColor(estrategia: string): string {
  const tone = estrategiaTone(estrategia);
  if (tone === "green") return VIZ.s1;
  if (tone === "purple") return VIZ.s2;
  if (tone === "orange") return VIZ.s3;
  if (tone === "magenta") return VIZ.s4;
  return VIZ.ink3;
}

export type MetricaContratada = {
  /** campo de AdSummary/Totals que a estratégia comprou */
  key: "engagement" | "impressions" | "clicks";
  label: string;
  /** custo unitário correspondente */
  custoKey: "cpe" | "cpm" | "cpc";
  custoLabel: "CPE" | "CPM" | "CPC";
};

/**
 * Métrica contratada do anúncio (Engajamento→engajamento, Alcance→impressões,
 * Tráfego/Lookalike→cliques). null quando a estratégia não é reconhecida —
 * o card cai no layout neutro.
 */
export function metricaContratada(estrategias: string[]): MetricaContratada | null {
  const n = (estrategias[0] ?? "").toLowerCase();
  if (n.includes("alcance"))
    return { key: "impressions", label: "Impressões", custoKey: "cpm", custoLabel: "CPM" };
  if (n.includes("look") || n.includes("tráfego") || n.includes("trafego"))
    return { key: "clicks", label: "Cliques", custoKey: "cpc", custoLabel: "CPC" };
  if (n.includes("engaj"))
    return { key: "engagement", label: "Engajamento", custoKey: "cpe", custoLabel: "CPE" };
  return null;
}
