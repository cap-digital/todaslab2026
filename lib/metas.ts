import type { Row } from "./types";

/** Métrica contratada de uma estratégia. */
export type MetricKind = "engajamento" | "impressoes" | "cliques";

export const METRIC_LABEL: Record<MetricKind, string> = {
  engajamento: "Engajamento",
  impressoes: "Impressões",
  cliques: "Cliques",
};

/** Sigla do custo unitário que cada métrica compra. */
export const METRIC_COST_LABEL: Record<MetricKind, string> = {
  engajamento: "CPE",
  impressoes: "CPM",
  cliques: "CPC",
};

/**
 * Custo unitário (CPM por mil; CPC/CPE por unidade).
 * null quando não há entrega para dividir.
 */
export function unitCost(metric: MetricKind, invest: number, delivered: number): number | null {
  if (delivered <= 0) return null;
  return metric === "impressoes" ? (invest / delivered) * 1000 : invest / delivered;
}

export type EstrategiaMeta = {
  nome: string;
  investimento: number;
  metric: MetricKind;
  meta: number;
};

export type CicloMeta = {
  ciclo: string;
  valor: number;
  estrategias: EstrategiaMeta[];
};

const CICLO_PADRAO: EstrategiaMeta[] = [
  { nome: "Engajamento", investimento: 500, metric: "engajamento", meta: 556 },
  { nome: "Alcance", investimento: 1000, metric: "impressoes", meta: 86957 },
  { nome: "Tráfego", investimento: 1500, metric: "cliques", meta: 500 },
  { nome: "Tráfego - Lookalike", investimento: 500, metric: "cliques", meta: 143 },
];

/** Metas contratadas — fonte da página Progresso de Meta. */
export const METAS: CicloMeta[] = [
  { ciclo: "Ciclo 1", valor: 3500, estrategias: CICLO_PADRAO },
  { ciclo: "Ciclo 2", valor: 3500, estrategias: CICLO_PADRAO },
  { ciclo: "Ciclo 3", valor: 3500, estrategias: CICLO_PADRAO },
  { ciclo: "Ciclo 4", valor: 3500, estrategias: CICLO_PADRAO },
  {
    ciclo: "Aftermovies",
    valor: 1000,
    estrategias: [{ nome: "Engajamento", investimento: 1000, metric: "engajamento", meta: 1111 }],
  },
];

export const CONTRATO_TOTAL = METAS.reduce((s, c) => s + c.valor, 0); // 15.000

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Casa o "Ciclo" da base com o contratado ("Ciclo 1" ↔ "CICLO 01" etc.). */
export function matchCiclo(rowCiclo: string, metaCiclo: string): boolean {
  const a = norm(rowCiclo);
  const b = norm(metaCiclo);
  // linha sem ciclo ("—" → "") não pode casar com todos os ciclos via includes("")
  if (!a || !b) return false;
  if (a === b) return true;
  const numA = a.match(/ciclo 0?(\d)/)?.[1];
  const numB = b.match(/ciclo 0?(\d)/)?.[1];
  if (numA && numB) return numA === numB;
  return a.includes(b) || b.includes(a);
}

/** Casa a "Estratégia" da base com a contratada (lookalike é distinta de tráfego puro). */
export function matchEstrategia(rowEstrategia: string, metaNome: string): boolean {
  const a = norm(rowEstrategia);
  const b = norm(metaNome);
  // linha sem estratégia ("—" → "") não pode casar com todas as metas via includes("")
  if (!a || !b) return false;
  const aLook = a.includes("lookalike") || a.includes("look alike");
  const bLook = b.includes("lookalike") || b.includes("look alike");
  if (aLook !== bLook) return false;
  if (aLook && bLook) return true;
  return a === b || a.includes(b) || b.includes(a);
}

export function deliveredFor(rows: Row[], metric: MetricKind): number {
  let s = 0;
  for (const r of rows) {
    if (metric === "engajamento") s += r.engagement;
    else if (metric === "impressoes") s += r.impressions;
    else s += r.clicks;
  }
  return s;
}

export type EstrategiaProgress = EstrategiaMeta & {
  investido: number;
  entregue: number;
  /** entregue / meta (fração, pode passar de 1) */
  pctEntrega: number;
  /** investido / investimento contratado */
  pctInvestimento: number;
};

export type CicloProgress = {
  ciclo: string;
  valor: number;
  investido: number;
  pctInvestimento: number;
  estrategias: EstrategiaProgress[];
  /** média simples do % de entrega das estratégias do ciclo (limitado a 100% cada) */
  pctEntregaMedia: number;
};

/**
 * Progresso contratado × realizado. Usa TODAS as linhas (acumulado da campanha) —
 * progresso de contrato não é fatiado por date-picker.
 */
export function computeProgress(allRows: Row[]): CicloProgress[] {
  return METAS.map((ciclo) => {
    const cicloRows = allRows.filter((r) => matchCiclo(r.ciclo, ciclo.ciclo));
    const estrategias = ciclo.estrategias.map((e): EstrategiaProgress => {
      const rows = cicloRows.filter((r) => matchEstrategia(r.estrategia, e.nome));
      const investido = rows.reduce((s, r) => s + r.investimento, 0);
      const entregue = deliveredFor(rows, e.metric);
      return {
        ...e,
        investido,
        entregue,
        pctEntrega: e.meta > 0 ? entregue / e.meta : 0,
        pctInvestimento: e.investimento > 0 ? investido / e.investimento : 0,
      };
    });
    const investido = estrategias.reduce((s, e) => s + e.investido, 0);
    const pctEntregaMedia =
      estrategias.length > 0
        ? estrategias.reduce((s, e) => s + Math.min(1, e.pctEntrega), 0) / estrategias.length
        : 0;
    return {
      ciclo: ciclo.ciclo,
      valor: ciclo.valor,
      investido,
      pctInvestimento: ciclo.valor > 0 ? investido / ciclo.valor : 0,
      estrategias,
      pctEntregaMedia,
    };
  });
}
