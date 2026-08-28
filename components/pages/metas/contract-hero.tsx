"use client";

import type { CicloProgress } from "@/lib/metas";
import { CONTRATO_TOTAL } from "@/lib/metas";
import { brl, pct } from "@/lib/format";
import { Card, Chip, Flower, Meter, StatValue } from "@/components/ui";

/**
 * Card-herói do contrato: total investido acumulado sobre os R$ 15.000
 * contratados + trilha dos 5 blocos (Ciclos 1–4 e Aftermovies).
 */
export function ContractHero({ progress }: { progress: CicloProgress[] }) {
  const investido = progress.reduce((s, c) => s + c.investido, 0);
  const frac = CONTRATO_TOTAL > 0 ? investido / CONTRATO_TOTAL : 0;

  return (
    <div className="animate-rise">
      <Card tone="green" className="relative overflow-hidden p-4 md:p-5">
        <Flower className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 animate-spin-slow text-green/10" />

        <div className="relative flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-green-deep">
              Contrato TODAS Lab · {brl(CONTRATO_TOTAL)}
            </p>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <StatValue value={brl(investido)} size="hero" />
              <span className="text-sm font-semibold text-ink-2">
                investidos até agora
              </span>
            </div>
          </div>
          <Chip tone="green">{pct(frac)} do contrato</Chip>
        </div>

        <div className="relative mt-4">
          <Meter
            value={frac}
            tone="green"
            height="h-3"
            label="Investimento acumulado sobre o contrato total"
          />
        </div>

        {/* trilha da jornada: Ciclo 1 → 4 → Aftermovies */}
        <div className="relative mt-4 flex flex-wrap gap-2">
          {progress.map((c) => (
            <div
              key={c.ciclo}
              className="min-w-[140px] flex-1 rounded-2xl bg-surface/80 px-3.5 py-2 ring-1 ring-ink/5"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[11px] font-bold text-ink-2">{c.ciclo}</span>
                <span className="tnum text-[11px] font-semibold text-ink-3">
                  {brl(c.valor)}
                </span>
              </div>
              <div className="mt-1.5">
                <Meter
                  value={c.pctInvestimento}
                  tone="green"
                  height="h-1.5"
                  label={`Investimento — ${c.ciclo}`}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
