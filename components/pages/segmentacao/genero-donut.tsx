"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { Row } from "@/lib/types";
import { byGender } from "@/lib/aggregate";
import { brl, int, pct, GENDER_LABEL } from "@/lib/format";
import { Card, CardTitle, EmptyState, Flower, Legend, StatValue, TableToggle } from "@/components/ui";
import { RechartsTooltip, VIZ } from "@/components/chart-kit";

/** A cor segue a ENTIDADE em todo o painel. */
const GENDER_COLOR: Record<string, string> = {
  female: VIZ.s2,
  male: VIZ.s1,
  unknown: "#8a9083",
};

const RADIAN = Math.PI / 180;

type PieLabelProps = {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
};

/**
 * Porcentagem DENTRO da fatia (branco bold sobre as fatias escuras),
 * só quando o share é >= 10% — fatias menores ficam com a Legend.
 */
function rotuloFatia(p: unknown) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = p as PieLabelProps;
  if (cx == null || cy == null || midAngle == null) return null;
  if (innerRadius == null || outerRadius == null || percent == null) return null;
  if (!Number.isFinite(percent) || percent < 0.1) return null;
  const r = (Number(innerRadius) + Number(outerRadius)) / 2;
  const x = Number(cx) + r * Math.cos(-Number(midAngle) * RADIAN);
  const y = Number(cy) + r * Math.sin(-Number(midAngle) * RADIAN);
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      fill="#ffffff"
      fontSize={12}
      fontWeight={700}
    >
      {pct(percent, 0)}
    </text>
  );
}

export function GeneroDonut({ rows }: { rows: Row[] }) {
  const genders = byGender(rows);
  const totalImpr = genders.reduce((s, g) => s + g.impressions, 0);
  const femaleImpr = genders.find((g) => g.gender === "female")?.impressions ?? 0;
  const femaleShare = totalImpr > 0 ? femaleImpr / totalImpr : 0;

  const slices = genders
    .filter((g) => g.impressions > 0)
    .map((g) => ({
      gender: g.gender,
      label: GENDER_LABEL[g.gender] ?? g.gender,
      impressions: g.impressions,
    }));

  return (
    <Card tone="purple" className="relative h-full overflow-hidden p-4 md:p-5">
      <Flower className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 text-purple/15 animate-spin-slow" />
      <CardTitle
        title="Quem a campanha alcança"
        subtitle="share de impressões por gênero"
      />
      {rows.length === 0 ? (
        <EmptyState message="Sem dados de público no período selecionado — ajuste os filtros ou volte amanhã." />
      ) : totalImpr === 0 || slices.length === 0 ? (
        <EmptyState message="As impressões ainda estão zeradas — o donut acende com os primeiros números da campanha." />
      ) : (
        <div className="mt-3">
          <TableToggle
            chart={
              <div>
                <div className="relative h-44 md:h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                      <Pie
                        data={slices}
                        dataKey="impressions"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        innerRadius="62%"
                        outerRadius="88%"
                        stroke="#fffdfb"
                        strokeWidth={2}
                        label={rotuloFatia}
                        labelLine={false}
                      >
                        {slices.map((s) => (
                          <Cell key={s.gender} fill={GENDER_COLOR[s.gender] ?? "#8a9083"} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={
                          <RechartsTooltip
                            shape="rect"
                            format={(_k, v) => {
                              const hits = slices.filter((s) => s.impressions === v);
                              return {
                                name:
                                  hits.length === 1
                                    ? `impressões · ${hits[0].label.toLowerCase()}`
                                    : "impressões",
                                value: int(v),
                              };
                            }}
                          />
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* número-herói da marca: TODAS as mulheres */}
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1">
                    <StatValue value={pct(femaleShare)} size="md" />
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: GENDER_COLOR.female }}
                        aria-hidden
                      />
                      mulheres
                    </span>
                  </div>
                </div>
                <div className="mt-3">
                  <Legend
                    items={slices.map((s) => ({
                      label: `${s.label} · ${int(s.impressions)}`,
                      color: GENDER_COLOR[s.gender] ?? "#8a9083",
                      shape: "rect" as const,
                    }))}
                  />
                </div>
              </div>
            }
            table={{
              columns: ["Gênero", "Impressões", "Cliques", "Investimento", "Share"],
              rows: genders.map((g) => [
                GENDER_LABEL[g.gender] ?? g.gender,
                int(g.impressions),
                int(g.clicks),
                brl(g.investimento),
                totalImpr > 0 ? pct(g.impressions / totalImpr) : pct(0),
              ]),
            }}
          />
        </div>
      )}
    </Card>
  );
}
