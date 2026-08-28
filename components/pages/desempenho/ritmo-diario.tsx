"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";
import type { Row } from "@/lib/types";
import { byDay } from "@/lib/aggregate";
import { brl, compact, dayLabel, dayLong, int } from "@/lib/format";
import { Card, CardTitle, EmptyState, Legend, TableToggle } from "@/components/ui";
import { AXIS_TICK, BAR, RechartsTooltip, VIZ } from "@/components/chart-kit";

/** Métricas disponíveis na linha de baixo — cor segue a entidade no painel. */
type MetricaKey = "impressions" | "clicks" | "engagement";

const METRICAS: Record<MetricaKey, { label: string; color: string; wash: string }> = {
  impressions: { label: "Impressões", color: VIZ.s2, wash: VIZ.purpleWash },
  clicks: { label: "Cliques", color: VIZ.s3, wash: VIZ.orangeWash },
  engagement: { label: "Engajamento", color: VIZ.s1, wash: VIZ.greenWash },
};

const METRICA_ORDEM: MetricaKey[] = ["impressions", "clicks", "engagement"];

type LabelContentProps = {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  value?: number | string;
  index?: number;
};

/**
 * Rótulo direto no topo das barras (texto em tinta, nunca na cor da série).
 * `permitidos` null → rotula todas; Set → rotula só os índices listados
 * (regra de densidade: com muitos dias, só máximo e último).
 */
function rotuloBarras(permitidos: ReadonlySet<number> | null) {
  return function BarraLabel(p: unknown) {
    const { x, y, width, value, index } = p as LabelContentProps;
    const v = Number(value ?? 0);
    if (!Number.isFinite(v) || v <= 0 || x == null || y == null) return null;
    if (permitidos && (index == null || !permitidos.has(index))) return null;
    const cx = Number(x) + Number(width) / 2;
    return (
      <text
        x={cx}
        y={Number(y) - 7}
        textAnchor="middle"
        fill={VIZ.ink2}
        fontSize={10}
        fontWeight={700}
      >
        {brl(v)}
      </text>
    );
  };
}

/** Rótulo direto acima dos pontos da linha — mesma regra de densidade das barras. */
function rotuloPontos(permitidos: ReadonlySet<number> | null) {
  return function PontoLabel(p: unknown) {
    const { x, y, value, index } = p as LabelContentProps;
    const v = Number(value ?? 0);
    if (!Number.isFinite(v) || v <= 0 || x == null || y == null) return null;
    if (permitidos && (index == null || !permitidos.has(index))) return null;
    return (
      <text
        x={Number(x)}
        y={Number(y) - 12}
        textAnchor="middle"
        fill={VIZ.ink2}
        fontSize={10}
        fontWeight={700}
      >
        {compact(v)}
      </text>
    );
  };
}

/**
 * Dois mini-gráficos EMPILHADOS compartilhando o mesmo domínio x — nunca dual-axis.
 * Investimento (barras, verde) em cima; Impressões (linha + wash, lilás) embaixo.
 */
export function RitmoDiario({ rows }: { rows: Row[] }) {
  const days = byDay(rows);
  const [metrica, setMetrica] = useState<MetricaKey>("impressions");
  const m = METRICAS[metrica];

  if (days.length === 0) {
    return (
      <Card className="p-4 md:p-5">
        <CardTitle title="Ritmo diário" subtitle="investimento e impressões, dia a dia" />
        <EmptyState message="Sem entrega registrada no período selecionado — o ritmo diário aparece assim que a campanha rodar." />
      </Card>
    );
  }

  const lastIdx = days.length - 1;
  // base pequena → rotula tudo; com mais de 10 dias, só o máximo de cada série e o último
  const muitosDias = days.length > 10;
  const maxInvIdx = days.reduce(
    (best, d, i) => (d.investimento > days[best].investimento ? i : best),
    0
  );
  const maxMetricaIdx = days.reduce(
    (best, d, i) => (d[metrica] > days[best][metrica] ? i : best),
    0
  );
  const barrasPermitidas = muitosDias ? new Set([maxInvIdx, lastIdx]) : null;
  const pontosPermitidos = muitosDias ? new Set([maxMetricaIdx, lastIdx]) : null;
  // mesmas margens e mesma largura de eixo y nos dois plots = mesmo domínio x na tela
  // (top maior para o rótulo do valor máximo não ser cortado)
  const margem = { top: 26, right: 28, left: 0, bottom: 0 };
  const eixoYLargura = 56;

  return (
    <Card className="p-4 md:p-5">
      <CardTitle
        title="Ritmo diário"
        subtitle={
          days.length === 1
            ? "1 dia com entrega até agora"
            : `${days.length} dias com entrega`
        }
        right={
          <div className="flex flex-wrap justify-end gap-1" role="group" aria-label="Métrica da linha">
            {METRICA_ORDEM.map((key) => {
              const ativa = key === metrica;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={ativa}
                  onClick={() => setMetrica(key)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
                    ativa ? "bg-ink text-white" : "bg-sunken text-ink-2 hover:text-ink"
                  }`}
                >
                  {METRICAS[key].label}
                </button>
              );
            })}
          </div>
        }
      />
      <div className="mt-3">
        <TableToggle
          chart={
            <div>
              <Legend
                items={[
                  { label: "Investimento", color: VIZ.s1, shape: "rect" },
                  { label: m.label, color: m.color, shape: "line" },
                ]}
              />
              <div className="mt-2.5 h-36 md:h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={days} margin={margem}>
                    <CartesianGrid vertical={false} stroke={VIZ.grid} />
                    <XAxis dataKey="day" hide />
                    <YAxis
                      width={eixoYLargura}
                      tick={AXIS_TICK}
                      tickLine={false}
                      axisLine={false}
                      tickCount={3}
                      tickFormatter={(v) => `R$ ${compact(Number(v))}`}
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
                          labelFormat={(l) => dayLong(String(l))}
                        />
                      }
                      cursor={{ fill: "rgba(28,36,23,0.05)" }}
                    />
                    <Bar dataKey="investimento" fill={VIZ.s1} {...BAR}>
                      <LabelList dataKey="investimento" content={rotuloBarras(barrasPermitidas)} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-1 h-40 md:h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={days} margin={margem}>
                    <CartesianGrid vertical={false} stroke={VIZ.grid} />
                    <XAxis
                      dataKey="day"
                      scale="band"
                      tick={AXIS_TICK}
                      tickLine={false}
                      axisLine={{ stroke: VIZ.axis }}
                      tickFormatter={(v) => dayLabel(String(v))}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      width={eixoYLargura}
                      tick={AXIS_TICK}
                      tickLine={false}
                      axisLine={false}
                      tickCount={3}
                      tickFormatter={(v) => compact(Number(v))}
                    />
                    <Tooltip
                      content={
                        <RechartsTooltip
                          shape="line"
                          format={(k, v) =>
                            k === metrica ? { name: m.label, value: int(v) } : null
                          }
                          labelFormat={(l) => dayLong(String(l))}
                        />
                      }
                      cursor={{ stroke: VIZ.axis, strokeWidth: 1 }}
                    />
                    <Area
                      key={metrica}
                      type="monotone"
                      dataKey={metrica}
                      stroke={m.color}
                      strokeWidth={2}
                      fill={m.wash}
                      fillOpacity={1}
                      dot={{ r: 4, fill: m.color, stroke: "#fffdfb", strokeWidth: 2 }}
                      activeDot={{ r: 5, fill: m.color, stroke: "#fffdfb", strokeWidth: 2 }}
                    >
                      <LabelList dataKey={metrica} content={rotuloPontos(pontosPermitidos)} />
                    </Area>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          }
          table={{
            columns: ["Dia", "Investimento", "Impressões", "Cliques", "Engajamento"],
            rows: days.map((d) => [
              dayLong(d.day),
              brl(d.investimento),
              int(d.impressions),
              int(d.clicks),
              int(d.engagement),
            ]),
          }}
        />
      </div>
    </Card>
  );
}
