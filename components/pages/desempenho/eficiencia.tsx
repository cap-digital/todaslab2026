"use client";

import type { Totals } from "@/lib/aggregate";
import { brl, int, pct } from "@/lib/format";
import { Card, CardTitle, Flower, Notice, StatTile } from "@/components/ui";

/**
 * Custos médios + interações separadas. As interações NÃO são somadas em nada —
 * o Engajamento é a métrica única da Meta; aqui cada tipo aparece por si.
 */
export function Eficiencia({ t }: { t: Totals }) {
  const interacoes = [
    { label: "Reações", n: t.reactions },
    { label: "Comentários", n: t.comments },
    { label: "Salvos", n: t.saves },
    { label: "Compart.", n: t.shares },
  ];
  const temInteracao = interacoes.some((d) => d.n > 0);

  return (
    <Card className="flex h-full flex-col gap-4 p-4 md:p-5">
      <CardTitle
        title="Eficiência"
        subtitle="custos médios do período"
        right={<Flower className="h-5 w-5 text-lilac" />}
      />
      <div className="grid grid-cols-2 gap-x-3 gap-y-4">
        <StatTile
          label="CPM"
          value={t.impressions === 0 ? "—" : brl(t.cpm, { cents: true })}
          hint="custo por mil impressões"
          accent="none"
        />
        <StatTile
          label="CPC"
          value={t.clicks === 0 ? "—" : brl(t.cpc, { cents: true })}
          hint="custo por clique"
          accent="none"
        />
        <StatTile
          label="CPE"
          value={t.engagement === 0 ? "—" : brl(t.cpe, { cents: true })}
          hint="custo por engajamento"
          accent="none"
        />
        <StatTile
          label="CTR"
          value={t.impressions === 0 ? "—" : pct(t.ctr)}
          hint="cliques ÷ impressões"
          accent="none"
        />
      </div>
      <div className="mt-auto">
        <p className="mb-2 text-xs font-semibold text-ink-2">Interações</p>
        {!temInteracao ? (
          <Notice>As interações aparecem conforme a campanha roda.</Notice>
        ) : (
          <div className="grid grid-cols-4 gap-2 rounded-2xl bg-sunken px-3 py-2.5">
            {interacoes.map((d) => (
              <div key={d.label}>
                <p className="text-[10px] font-semibold text-ink-3">{d.label}</p>
                <p className="tnum mt-0.5 text-sm font-bold leading-none text-ink">
                  {int(d.n)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
