import { METAS, matchCiclo, matchEstrategia } from "./metas";
import type { Row } from "./types";

/**
 * Ajuste contratual do investimento.
 *
 * A base traz o gasto bruto da conta de anúncios, que estourou o contratado nos
 * ciclos fechados. O painel mostra o contrato, não o gasto bruto:
 *
 * 1. o investimento de cada estratégia é limitado ao contratado (teto, nunca piso —
 *    ciclo em andamento continua subindo até 100%);
 * 2. o excedente dos ciclos já encerrados é transferido para o Ciclo 3, diluído em
 *    parcelas iguais pelos dias da janela do ciclo e somado ao gasto que aparecer
 *    na base naquele dia.
 *
 * Tudo isso roda uma única vez sobre as linhas cruas, então o painel inteiro
 * (metas, desempenho, criativos, segmentação) enxerga o valor já ajustado — e com
 * ele CPM, CPC e CPE também.
 */

/** Janela do Ciclo 3 — inclusiva nas duas pontas. */
export const CICLO_3_INICIO = "2026-09-24";
export const CICLO_3_FIM = "2026-10-05";

/** Ciclos encerrados cujo excedente é transferido. */
const CICLOS_DOADORES = ["Ciclo 1", "Ciclo 2"];
const CICLO_RECEPTOR = "Ciclo 3";

function proximoDia(day: string): string {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

/** Dias corridos da janela do Ciclo 3 (12 dias: 24/09 → 05/10). */
export function diasCiclo3(): string[] {
  const dias: string[] = [];
  for (let d = CICLO_3_INICIO; d <= CICLO_3_FIM; d = proximoDia(d)) dias.push(d);
  return dias;
}

/** Célula contratada (ciclo × estratégia) à qual uma linha pertence. */
type Celula = { ciclo: string; estrategia: string; contratado: number };

function celulaDe(row: Row): Celula | null {
  for (const ciclo of METAS) {
    if (!matchCiclo(row.ciclo, ciclo.ciclo)) continue;
    for (const e of ciclo.estrategias) {
      if (matchEstrategia(row.estrategia, e.nome)) {
        return { ciclo: ciclo.ciclo, estrategia: e.nome, contratado: e.investimento };
      }
    }
    return null;
  }
  return null;
}

function chave(c: Celula): string {
  return `${c.ciclo}|${c.estrategia}`;
}

export type AjusteContrato = {
  /** quanto cada ciclo doador gastou a mais que o contratado */
  excedentePorCiclo: Record<string, number>;
  /** soma dos excedentes, transferida para o Ciclo 3 */
  excedenteTotal: number;
  /** excedenteTotal ÷ dias da janela do Ciclo 3 */
  bonusDiario: number;
  /** dias da janela do Ciclo 3 */
  dias: number;
};

/**
 * Aplica o ajuste e devolve linhas novas (não muta as originais) junto com o
 * resumo da transferência.
 */
export function aplicarContrato(rows: Row[]): { rows: Row[]; ajuste: AjusteContrato } {
  // célula de cada linha, calculada uma vez só
  const celulas = rows.map(celulaDe);

  // --- 1. excedente bruto dos ciclos doadores, por célula contratada ---
  const brutoPorCelula = new Map<string, number>();
  const contratadoPorCelula = new Map<string, number>();
  rows.forEach((r, i) => {
    const c = celulas[i];
    if (!c) return;
    const k = chave(c);
    brutoPorCelula.set(k, (brutoPorCelula.get(k) ?? 0) + r.investimento);
    contratadoPorCelula.set(k, c.contratado);
  });

  const excedentePorCiclo: Record<string, number> = {};
  for (const [k, bruto] of Array.from(brutoPorCelula.entries())) {
    const cicloNome = k.split("|")[0];
    if (!CICLOS_DOADORES.includes(cicloNome)) continue;
    const sobra = bruto - (contratadoPorCelula.get(k) ?? 0);
    if (sobra > 0) {
      excedentePorCiclo[cicloNome] = (excedentePorCiclo[cicloNome] ?? 0) + sobra;
    }
  }
  const excedenteTotal = Object.values(excedentePorCiclo).reduce((s, v) => s + v, 0);

  const dias = diasCiclo3();
  const bonusDiario = dias.length > 0 ? excedenteTotal / dias.length : 0;

  // --- 2. dilui o excedente nos dias do Ciclo 3 ---
  // o bônus do dia é rateado entre as linhas daquele dia na proporção do gasto real
  const ajustado = rows.map((r) => ({ ...r }));

  const janela = new Set(dias);
  const gastoPorDia = new Map<string, number>();
  const linhasPorDia = new Map<string, number[]>();
  ajustado.forEach((r, i) => {
    const c = celulas[i];
    if (!c || c.ciclo !== CICLO_RECEPTOR || !janela.has(r.date)) return;
    gastoPorDia.set(r.date, (gastoPorDia.get(r.date) ?? 0) + r.investimento);
    const lista = linhasPorDia.get(r.date);
    if (lista) lista.push(i);
    else linhasPorDia.set(r.date, [i]);
  });

  for (const [dia, indices] of Array.from(linhasPorDia.entries())) {
    const gasto = gastoPorDia.get(dia) ?? 0;
    // sem gasto no dia não há proporção para ratear — o bônus daquele dia não entra
    if (gasto <= 0) continue;
    for (const i of indices) {
      ajustado[i].investimento += bonusDiario * (ajustado[i].investimento / gasto);
    }
  }

  // --- 3. teto: nenhuma célula passa do investimento contratado ---
  const totalPorCelula = new Map<string, number>();
  ajustado.forEach((r, i) => {
    const c = celulas[i];
    if (!c) return;
    const k = chave(c);
    totalPorCelula.set(k, (totalPorCelula.get(k) ?? 0) + r.investimento);
  });

  const fator = new Map<string, number>();
  for (const [k, total] of Array.from(totalPorCelula.entries())) {
    const contratado = contratadoPorCelula.get(k) ?? 0;
    fator.set(k, total > contratado && total > 0 ? contratado / total : 1);
  }

  ajustado.forEach((r, i) => {
    const c = celulas[i];
    if (!c) return;
    const f = fator.get(chave(c)) ?? 1;
    if (f !== 1) r.investimento *= f;
  });

  return {
    rows: ajustado,
    ajuste: { excedentePorCiclo, excedenteTotal, bonusDiario, dias: dias.length },
  };
}
