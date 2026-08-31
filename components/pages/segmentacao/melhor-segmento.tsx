"use client";

import type { Row } from "@/lib/types";
import { byAgeGender, AGE_ORDER } from "@/lib/aggregate";
import { brl, compact, int, pct, GENDER_LABEL } from "@/lib/format";
import { Card, CardTitle, Chip, EmptyState, Meter } from "@/components/ui";
import { VIZ } from "@/components/chart-kit";

/** Gênero segue a identidade do painel: Mulheres=s2 (lilás), Homens=s1 (verde). */
function corGenero(gender: string): string {
  if (gender === "female") return VIZ.s2;
  if (gender === "male") return VIZ.s1;
  return "#8a9083";
}

function rankIdade(age: string): number {
  const i = AGE_ORDER.indexOf(age);
  return i === -1 ? 999 : i;
}

/**
 * Top 3 combinações idade × gênero por impressões, com share, CTR e CPM —
 * a leitura acionável da segmentação: onde a campanha está rendendo.
 */
export function MelhorSegmento({ rows }: { rows: Row[] }) {
  const segmentos = byAgeGender(rows)
    .filter((s) => s.impressions > 0)
    .sort(
      (a, b) =>
        b.impressions - a.impressions ||
        rankIdade(a.age) - rankIdade(b.age) ||
        a.gender.localeCompare(b.gender)
    );

  const totalImpr = segmentos.reduce((s, x) => s + x.impressions, 0);
  const top = segmentos.slice(0, 3);

  return (
    <Card className="p-4 md:p-5">
      <CardTitle
        title="Segmentos que mais respondem"
        subtitle="idade × gênero por impressões, com custo e taxa no recorte atual"
      />
      {top.length === 0 || totalImpr === 0 ? (
        <EmptyState message="Sem impressões no período selecionado — os segmentos aparecem conforme a campanha roda." />
      ) : (
        <ol className="mt-3 flex flex-col gap-3">
          {top.map((s, i) => {
            const share = s.impressions / totalImpr;
            const lider = i === 0;
            return (
              <li
                key={`${s.age}-${s.gender}`}
                className={lider ? "rounded-2xl bg-green-wash p-3 md:p-3.5" : "px-0.5"}
              >
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <span className="inline-flex min-w-0 flex-wrap items-center gap-2">
                    <span className="w-5 shrink-0 text-sm font-bold text-ink-3">{i + 1}º</span>
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: corGenero(s.gender) }}
                      aria-hidden
                    />
                    <span className={`min-w-0 break-words font-bold text-ink ${lider ? "text-base" : "text-sm"}`}>
                      {GENDER_LABEL[s.gender] ?? s.gender} · {s.age === "unknown" ? "idade n/i" : `${s.age} anos`}
                    </span>
                    {lider ? <Chip tone="green">líder</Chip> : null}
                  </span>
                  <span className="text-xs font-bold text-ink-2">
                    {pct(share)} das impressões
                  </span>
                </div>
                <div className="mt-2">
                  <Meter
                    value={share}
                    tone="green"
                    height={lider ? "h-2.5" : "h-1.5"}
                    label={`Share de impressões — ${GENDER_LABEL[s.gender] ?? s.gender} ${s.age}`}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-ink-3">
                  {compact(s.impressions)}{" "}
                  {s.impressions === 1 ? "impressão" : "impressões"} · CTR{" "}
                  {s.impressions > 0 ? pct(s.ctr) : "—"} · CPM{" "}
                  {s.impressions > 0 ? brl(s.cpm, { cents: true }) : "—"}
                  {s.clicks > 0 ? <> · CPC {brl(s.cpc, { cents: true })}</> : null}
                  {s.engagement > 0 ? <> · {int(s.engagement)} engaj.</> : null}
                </p>
              </li>
            );
          })}
        </ol>
      )}
    </Card>
  );
}
