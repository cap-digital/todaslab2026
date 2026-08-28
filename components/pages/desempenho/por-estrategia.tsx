"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from "recharts";
import type { Row } from "@/lib/types";
import { byEstrategia, type Totals } from "@/lib/aggregate";
import { brl, int } from "@/lib/format";
import { METRIC_COST_LABEL, unitCost, type MetricKind } from "@/lib/metas";
import { Card, CardTitle, EmptyState, TableToggle } from "@/components/ui";
import { AXIS_TICK, BAR_H, RechartsTooltip, VIZ } from "@/components/chart-kit";

/**
 * A cor segue a ENTIDADE em todo o painel:
 * Engajamento=s1 · Alcance=s2 · Tráfego=s3 · Tráfego - Lookalike=s4.
 */
function corEstrategia(nome: string): string {
  const n = nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (n.includes("lookalike") || n.includes("look alike")) return VIZ.s4;
  if (n.includes("trafego")) return VIZ.s3;
  if (n.includes("alcance")) return VIZ.s2;
  if (n.includes("engaj")) return VIZ.s1;
  return "#8a9083";
}

/** Métrica que cada estratégia compra (Alcance→CPM, Tráfego→CPC, Engajamento→CPE). */
function metricaEstrategia(nome: string): MetricKind {
  const n = nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (n.includes("trafego") || n.includes("lookalike") || n.includes("look alike")) return "cliques";
  if (n.includes("alcance")) return "impressoes";
  return "engajamento";
}

/** "CPM R$ 2,10" · "—" quando ainda não há entrega para dividir. */
function custoPorResultado(nome: string, t: Totals): { sigla: string; valor: string } {
  const metric = metricaEstrategia(nome);
  const entregue =
    metric === "impressoes" ? t.impressions : metric === "cliques" ? t.clicks : t.engagement;
  const custo = unitCost(metric, t.investimento, entregue);
  return {
    sigla: METRIC_COST_LABEL[metric],
    valor: custo === null ? "—" : brl(custo, { cents: true }),
  };
}

type LabelContentProps = {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  value?: number | string;
};

/** Rótulo direto na ponta de cada barra (são no máximo 4; texto em tinta). */
function RotuloPonta(p: unknown) {
  const { x, y, width, height, value } = p as LabelContentProps;
  if (x == null || y == null || width == null || height == null) return null;
  return (
    <text
      x={Number(x) + Number(width) + 8}
      y={Number(y) + Number(height) / 2}
      dominantBaseline="central"
      textAnchor="start"
      fill={VIZ.ink2}
      fontSize={11}
      fontWeight={700}
    >
      {brl(Number(value ?? 0))}
    </text>
  );
}

export function PorEstrategia({ rows }: { rows: Row[] }) {
  const est = byEstrategia(rows);

  return (
    <Card className="h-full p-4 md:p-5">
      <CardTitle title="Por estratégia" subtitle="investimento no período filtrado" />
      {est.length === 0 ? (
        <EmptyState message="Nenhuma estratégia com dados no período selecionado." />
      ) : (
        <div className="mt-3">
          <TableToggle
            chart={
              <div className="h-40 md:h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={est}
                    layout="vertical"
                    margin={{ top: 4, right: 72, bottom: 4, left: 0 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="estrategia"
                      width={96}
                      tick={AXIS_TICK}
                      tickLine={false}
                      axisLine={{ stroke: VIZ.axis }}
                      tickFormatter={(v: string) =>
                        v === "Tráfego - Lookalike" ? "Lookalike" : v
                      }
                    />
                    <Tooltip
                      content={
                        <RechartsTooltip
                          shape="rect"
                          format={(k, v) =>
                            k === "investimento"
                              ? { name: "Investimento", value: brl(v) }
                              : null
                          }
                        />
                      }
                      cursor={{ fill: "rgba(28,36,23,0.04)" }}
                    />
                    <Bar dataKey="investimento" {...BAR_H}>
                      {est.map((e) => (
                        <Cell key={e.estrategia} fill={corEstrategia(e.estrategia)} />
                      ))}
                      <LabelList dataKey="investimento" content={RotuloPonta} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            }
            table={{
              columns: [
                "Estratégia",
                "Investimento",
                "Impressões",
                "Cliques",
                "Engajamento",
                "Custo/resultado",
              ],
              rows: est.map((e) => {
                const c = custoPorResultado(e.estrategia, e);
                return [
                  e.estrategia,
                  brl(e.investimento),
                  int(e.impressions),
                  int(e.clicks),
                  int(e.engagement),
                  `${c.sigla} ${c.valor}`,
                ];
              }),
            }}
          />

          {/* custo pelo resultado que cada estratégia compra */}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t border-grid pt-3">
            {est.map((e) => {
              const c = custoPorResultado(e.estrategia, e);
              return (
                <span
                  key={e.estrategia}
                  className="inline-flex items-center gap-1.5 text-[11px] text-ink-3"
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: corEstrategia(e.estrategia) }}
                    aria-hidden
                  />
                  {c.sigla}
                  <span className="font-bold text-ink-2">{c.valor}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
