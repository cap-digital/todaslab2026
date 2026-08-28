import type { Row } from "./types";

/** Totais + métricas derivadas de um conjunto de linhas. */
export type Totals = {
  investimento: number;
  impressions: number;
  clicks: number;
  linkClicks: number;
  engagement: number;
  reactions: number;
  comments: number;
  saves: number;
  shares: number;
  videoViews: number;
  thruplays: number;
  videoP100: number;
  /** cliques / impressões (fração) */
  ctr: number;
  /** custo por mil impressões */
  cpm: number;
  /** custo por clique */
  cpc: number;
  /** custo por engajamento */
  cpe: number;
};

export function totals(rows: Row[]): Totals {
  const t = {
    investimento: 0,
    impressions: 0,
    clicks: 0,
    linkClicks: 0,
    engagement: 0,
    reactions: 0,
    comments: 0,
    saves: 0,
    shares: 0,
    videoViews: 0,
    thruplays: 0,
    videoP100: 0,
  };
  for (const r of rows) {
    t.investimento += r.investimento;
    t.impressions += r.impressions;
    t.clicks += r.clicks;
    t.linkClicks += r.linkClicks;
    t.engagement += r.engagement;
    t.reactions += r.reactions;
    t.comments += r.comments;
    t.saves += r.saves;
    t.shares += r.shares;
    t.videoViews += r.videoViews;
    t.thruplays += r.thruplays;
    t.videoP100 += r.videoP100;
  }
  return {
    ...t,
    ctr: t.impressions > 0 ? t.clicks / t.impressions : 0,
    cpm: t.impressions > 0 ? (t.investimento / t.impressions) * 1000 : 0,
    cpc: t.clicks > 0 ? t.investimento / t.clicks : 0,
    cpe: t.engagement > 0 ? t.investimento / t.engagement : 0,
  };
}

/** Agrupa por uma chave e devolve totais por grupo, ordenados como pedido. */
export function groupBy(
  rows: Row[],
  key: (r: Row) => string
): Array<{ key: string; rows: Row[]; totals: Totals }> {
  const map = new Map<string, Row[]>();
  for (const r of rows) {
    const k = key(r);
    const list = map.get(k);
    if (list) list.push(r);
    else map.set(k, [r]);
  }
  return Array.from(map.entries()).map(([k, groupRows]) => ({
    key: k,
    rows: groupRows,
    totals: totals(groupRows),
  }));
}

/** Série diária ordenada (dias presentes na base). */
export function byDay(rows: Row[]): Array<{ day: string } & Totals> {
  return groupBy(rows, (r) => r.date)
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((g) => ({ day: g.key, ...g.totals }));
}

/** Ordem canônica de faixas etárias. */
export const AGE_ORDER = ["13-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"];

export function byAge(rows: Row[]): Array<{ age: string } & Totals> {
  // faixas fora da ordem canônica (ex.: "unknown") vão para o fim
  const rank = (k: string) => {
    const i = AGE_ORDER.indexOf(k);
    return i === -1 ? 999 : i;
  };
  return groupBy(rows, (r) => r.age)
    .sort((a, b) => rank(a.key) - rank(b.key) || a.key.localeCompare(b.key))
    .map((g) => ({ age: g.key, ...g.totals }));
}

export function byGender(rows: Row[]): Array<{ gender: string } & Totals> {
  const order = ["female", "male", "unknown"];
  return groupBy(rows, (r) => r.gender)
    .sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key))
    .map((g) => ({ gender: g.key, ...g.totals }));
}

/** Grade idade × gênero (para heatmap). */
export function byAgeGender(
  rows: Row[]
): Array<{ age: string; gender: string } & Totals> {
  return groupBy(rows, (r) => `${r.age}|${r.gender}`).map((g) => {
    const [age, gender] = g.key.split("|");
    return { age, gender, ...g.totals };
  });
}

export type AdSummary = {
  adName: string;
  thumbnailUrl: string;
  permalink: string;
  ciclos: string[];
  estrategias: string[];
  days: string[];
} & Totals;

/** Consolida por anúncio (as linhas vêm quebradas por dia/idade/gênero). */
export function byAd(rows: Row[]): AdSummary[] {
  return groupBy(rows, (r) => r.adName).map((g) => {
    // pega o thumbnail/permalink mais recente que exista
    const withThumb = [...g.rows].reverse().find((r) => r.thumbnailUrl);
    const withLink = [...g.rows].reverse().find((r) => r.permalink);
    return {
      adName: g.key,
      thumbnailUrl: withThumb?.thumbnailUrl ?? "",
      permalink: withLink?.permalink ?? "",
      ciclos: Array.from(new Set(g.rows.map((r) => r.ciclo))).sort(),
      estrategias: Array.from(new Set(g.rows.map((r) => r.estrategia))).sort(),
      days: Array.from(new Set(g.rows.map((r) => r.date))).sort(),
      ...g.totals,
    };
  });
}

export function byEstrategia(rows: Row[]): Array<{ estrategia: string } & Totals> {
  const order = ["Engajamento", "Alcance", "Tráfego", "Tráfego - Lookalike"];
  return groupBy(rows, (r) => r.estrategia)
    .sort((a, b) => {
      const ia = order.indexOf(a.key);
      const ib = order.indexOf(b.key);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.key.localeCompare(b.key);
    })
    .map((g) => ({ estrategia: g.key, ...g.totals }));
}

export function byCiclo(rows: Row[]): Array<{ ciclo: string } & Totals> {
  return groupBy(rows, (r) => r.ciclo)
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((g) => ({ ciclo: g.key, ...g.totals }));
}

/** Valores únicos (para selects de filtro), na ordem natural da base. */
export function distinct(rows: Row[], key: (r: Row) => string): string[] {
  return Array.from(new Set(rows.map(key).filter(Boolean))).sort();
}
