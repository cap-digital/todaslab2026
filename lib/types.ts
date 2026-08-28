/** Linha normalizada da base (1 linha = dia × anúncio × idade × gênero). */
export type Row = {
  /** "YYYY-MM-DD" já no fuso da campanha */
  date: string;
  campaign: string;
  adsetName: string;
  adName: string;
  /** "18-24" | "25-34" | ... | "65+" | "unknown" */
  age: string;
  /** "female" | "male" | "unknown" */
  gender: string;
  thumbnailUrl: string;
  permalink: string;
  /** SEMPRE usar investimento (coluna "Investimento"); a coluna spend é ignorada. */
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
  videoP25: number;
  videoP50: number;
  videoP75: number;
  videoP95: number;
  videoP100: number;
  /** "Ciclo 1" ... "Ciclo 4" | "Aftermovies" (como vier da base) */
  ciclo: string;
  /** "Engajamento" | "Alcance" | "Tráfego" | "Tráfego - Lookalike" (como vier da base) */
  estrategia: string;
  /** Dispositivo — a base atual NÃO expõe esta coluna; fica preenchido se um dia existir. */
  device: string | null;
};

export type DataStatus = "loading" | "ready" | "error";

export type Preset = "hoje" | "ontem" | "7d" | "tudo" | "custom";

export type DateRange = {
  preset: Preset;
  /** "YYYY-MM-DD" inclusivo; null = sem limite */
  from: string | null;
  to: string | null;
};
