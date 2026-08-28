"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import type { Row } from "@/lib/types";
import { byAge, byAgeGender } from "@/lib/aggregate";
import { compact, int } from "@/lib/format";
import { Card, CardTitle, EmptyState, Legend, TableToggle } from "@/components/ui";
import { AXIS_TICK, BAR_H, RechartsTooltip, VIZ } from "@/components/chart-kit";

function ageLabel(age: string): string {
  return age === "unknown" ? "Não inf." : age;
}

type LabelContentProps = {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  value?: number | string;
};

/** Rótulo direto na ponta de cada barra (texto em tinta; omite zeros). */
function RotuloPonta(p: unknown) {
  const { x, y, width, height, value } = p as LabelContentProps;
  const v = Number(value ?? 0);
  if (!Number.isFinite(v) || v <= 0) return null;
  if (x == null || y == null || width == null || height == null) return null;
  return (
    <text
      x={Number(x) + Number(width) + 6}
      y={Number(y) + Number(height) / 2}
      dominantBaseline="central"
      textAnchor="start"
      fill={VIZ.ink2}
      fontSize={10}
      fontWeight={700}
    >
      {int(v)}
    </text>
  );
}

export function IdadeGeneroBarras({ rows }: { rows: Row[] }) {
  const ages = byAge(rows);
  const grid = byAgeGender(rows);

  const data = ages.map((a) => ({
    age: a.age,
    female:
      grid.find((c) => c.age === a.age && c.gender === "female")?.impressions ?? 0,
    male: grid.find((c) => c.age === a.age && c.gender === "male")?.impressions ?? 0,
  }));

  const hasFemale = data.some((d) => d.female > 0);
  const hasMale = data.some((d) => d.male > 0);
  const seriesCount = (hasFemale ? 1 : 0) + (hasMale ? 1 : 0);
  // altura explícita que inclui a faixa do eixo x (sem scroll interno)
  const chartHeight = data.length * (seriesCount > 1 ? 48 : 36) + 40;

  return (
    <Card className="h-full p-4 md:p-5">
      <CardTitle title="Idade × gênero" subtitle="impressões por faixa etária" />
      {rows.length === 0 ? (
        <EmptyState message="Sem dados de público no período selecionado — ajuste os filtros ou volte amanhã." />
      ) : seriesCount === 0 ? (
        <EmptyState message="Ainda não há impressões com gênero identificado — este gráfico acende com os primeiros números." />
      ) : (
        <div className="mt-3">
          <TableToggle
            chart={
              <div>
                {seriesCount > 1 ? (
                  <div className="mb-2">
                    <Legend
                      items={[
                        ...(hasFemale ? [{ label: "Mulheres", color: VIZ.s2 }] : []),
                        ...(hasMale ? [{ label: "Homens", color: VIZ.s1 }] : []),
                      ]}
                    />
                  </div>
                ) : null}
                <div style={{ height: chartHeight }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data}
                      layout="vertical"
                      margin={{ top: 4, right: 48, bottom: 4, left: 0 }}
                      barGap={3}
                      barCategoryGap="24%"
                    >
                      <CartesianGrid horizontal={false} stroke={VIZ.grid} />
                      <XAxis
                        type="number"
                        tick={AXIS_TICK}
                        axisLine={{ stroke: VIZ.axis }}
                        tickLine={false}
                        allowDecimals={false}
                        tickFormatter={(v: number) => compact(v)}
                      />
                      <YAxis
                        type="category"
                        dataKey="age"
                        width={56}
                        tick={AXIS_TICK}
                        axisLine={{ stroke: VIZ.axis }}
                        tickLine={false}
                        tickFormatter={(v: string) => ageLabel(v)}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(28,36,23,0.05)" }}
                        content={
                          <RechartsTooltip
                            shape="rect"
                            labelFormat={(l) => ageLabel(String(l))}
                            format={(k, v) =>
                              k === "female"
                                ? { name: "Mulheres", value: int(v) }
                                : k === "male"
                                  ? { name: "Homens", value: int(v) }
                                  : null
                            }
                          />
                        }
                      />
                      {hasFemale ? (
                        <Bar dataKey="female" fill={VIZ.s2} {...BAR_H}>
                          <LabelList dataKey="female" content={RotuloPonta} />
                        </Bar>
                      ) : null}
                      {hasMale ? (
                        <Bar dataKey="male" fill={VIZ.s1} {...BAR_H}>
                          <LabelList dataKey="male" content={RotuloPonta} />
                        </Bar>
                      ) : null}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            }
            table={{
              columns: [
                "Faixa",
                ...(hasFemale ? ["Mulheres"] : []),
                ...(hasMale ? ["Homens"] : []),
                "Total",
              ],
              rows: data.map((d) => [
                d.age === "unknown" ? "Não informado" : d.age,
                ...(hasFemale ? [int(d.female)] : []),
                ...(hasMale ? [int(d.male)] : []),
                int(d.female + d.male),
              ]),
            }}
          />
        </div>
      )}
    </Card>
  );
}
