"use client";

import type { Row } from "@/lib/types";
import { byAge, byAgeGender, byGender } from "@/lib/aggregate";
import { int, pct, GENDER_LABEL } from "@/lib/format";
import { Card, CardTitle, EmptyState, TableToggle } from "@/components/ui";
import { inkOnSeq, seqColor, VIZ } from "@/components/chart-kit";

function faixaLabel(age: string): string {
  return age === "unknown" ? "Não informado" : age;
}

export function HeatmapIdadeGenero({ rows }: { rows: Row[] }) {
  const genderTotals = byGender(rows);
  const genders = genderTotals.filter((g) => g.impressions > 0).map((g) => g.gender);
  const ages = byAge(rows).map((a) => a.age);
  const grid = byAgeGender(rows);
  const totalImpr = genderTotals.reduce((s, g) => s + g.impressions, 0);

  const cell = (age: string, gender: string): number =>
    grid.find((c) => c.age === age && c.gender === gender)?.impressions ?? 0;

  // share de cada célula sobre o total; a cor normaliza pelo máximo da grade
  const maxShare =
    totalImpr > 0
      ? Math.max(...ages.flatMap((a) => genders.map((g) => cell(a, g) / totalImpr)), 0)
      : 0;

  const empty = rows.length === 0 || totalImpr === 0 || genders.length === 0 || ages.length === 0;

  return (
    <Card className="p-4 md:p-5">
      <CardTitle
        title="Mapa de calor — idade × gênero"
        subtitle="share de impressões de cada célula sobre o total do período"
      />
      {empty ? (
        <EmptyState message="Sem impressões para mapear ainda — o calor aparece com os primeiros números da campanha." />
      ) : (
        <div className="mt-3">
          <TableToggle
            chart={
              <div>
                <div className="overflow-x-auto scroll-thin">
                  <div
                    className="grid min-w-[320px] gap-[2px]"
                    style={{
                      gridTemplateColumns: `minmax(88px, auto) repeat(${genders.length}, minmax(72px, 1fr))`,
                    }}
                  >
                    <span aria-hidden />
                    {genders.map((g) => (
                      <span
                        key={g}
                        className="px-2 pb-1 text-center text-xs font-semibold text-ink-2"
                      >
                        {GENDER_LABEL[g] ?? g}
                      </span>
                    ))}
                    {ages.map((age) => (
                      <FragmentRow key={age} age={age}>
                        {genders.map((g) => {
                          const impr = cell(age, g);
                          const share = totalImpr > 0 ? impr / totalImpr : 0;
                          const norm = maxShare > 0 ? share / maxShare : 0;
                          return (
                            <span
                              key={g}
                              className="grid place-items-center rounded-xl px-2 py-2 text-xs font-semibold"
                              style={{ background: seqColor(norm), color: inkOnSeq(norm) }}
                              title={`${faixaLabel(age)} · ${GENDER_LABEL[g] ?? g}: ${int(impr)} ${
                                impr === 1 ? "impressão" : "impressões"
                              } (${pct(share)} do total)`}
                            >
                              {pct(share)}
                            </span>
                          );
                        })}
                      </FragmentRow>
                    ))}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-ink-3">menos</span>
                  <span className="text-[11px] text-ink-3" aria-hidden>
                    →
                  </span>
                  <div className="flex gap-[2px]" aria-hidden>
                    {[0, 2, 4, 5, 7].map((i) => (
                      <span
                        key={i}
                        className="h-3 w-3 rounded-[4px]"
                        style={{ background: VIZ.seq[i] }}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-ink-3">mais</span>
                </div>
              </div>
            }
            table={{
              columns: ["Faixa", ...genders.map((g) => GENDER_LABEL[g] ?? g)],
              rows: ages.map((age) => [
                faixaLabel(age),
                ...genders.map((g) => int(cell(age, g))),
              ]),
            }}
          />
        </div>
      )}
    </Card>
  );
}

/** Linha do grid: rótulo da faixa + células (mantém o grid plano). */
function FragmentRow({ age, children }: { age: string; children: React.ReactNode }) {
  return (
    <>
      <span className="flex items-center pr-2 text-xs font-semibold text-ink-2">
        {faixaLabel(age)}
      </span>
      {children}
    </>
  );
}
