"use client";

import type { CicloProgress, EstrategiaProgress } from "@/lib/metas";
import { METRIC_LABEL, METRIC_COST_LABEL, unitCost } from "@/lib/metas";
import { brl, int, pct } from "@/lib/format";
import { Card, Chip, Meter } from "@/components/ui";
import { estrategiaColor, estrategiaTone } from "./estrategia-visual";

function EstrategiaRow({ e }: { e: EstrategiaProgress }) {
  const tone = estrategiaTone(e.nome);
  const color = estrategiaColor(e.nome);
  const metaBatida = e.pctEntrega >= 1;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-ink">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: color }}
            aria-hidden
          />
          {e.nome}
        </span>
        <span className="inline-flex items-center gap-1.5">
          {metaBatida ? <Chip tone="green">meta batida</Chip> : null}
          <span className="text-xs font-bold text-ink-2">{pct(e.pctEntrega)}</span>
        </span>
      </div>

      <p className="mt-1 text-[11px] text-ink-3">
        Entrega: {int(e.entregue)} de {int(e.meta)} ·{" "}
        {METRIC_LABEL[e.metric].toLowerCase()}
      </p>

      <div className="mt-1.5">
        <Meter
          value={e.pctEntrega}
          tone={tone}
          height="h-2"
          label={`Entrega — ${e.nome}`}
        />
      </div>

      <p className="mt-1.5 text-[11px] text-ink-3">
        {brl(e.investido)} de {brl(e.investimento)} investidos
        <CustoContratadoRealizado e={e} />
      </p>
    </div>
  );
}

/**
 * Custo unitário contratado (investimento ÷ meta) × realizado (investido ÷ entregue).
 * Só aparece quando já houve entrega; "✓ abaixo do contratado" quando está mais barato.
 */
function CustoContratadoRealizado({ e }: { e: EstrategiaProgress }) {
  const sigla = METRIC_COST_LABEL[e.metric];
  const contratado = unitCost(e.metric, e.investimento, e.meta);
  const realizado = unitCost(e.metric, e.investido, e.entregue);
  if (contratado === null) return null;
  return (
    <>
      {" · "}
      {sigla} contratado {brl(contratado, { cents: true })}
      {realizado !== null ? (
        <>
          {" · realizado "}
          <span className="font-bold text-ink-2">{brl(realizado, { cents: true })}</span>
          {realizado <= contratado ? (
            <span className="font-bold text-green-deep"> ✓</span>
          ) : null}
        </>
      ) : null}
    </>
  );
}

/**
 * Um ciclo do contrato: investimento no cabeçalho + uma linha de entrega por
 * estratégia. Aftermovies (estratégia única) ganha o tom lilás.
 */
export function CicloCard({
  ciclo,
  delay = 0,
}: {
  ciclo: CicloProgress;
  delay?: number;
}) {
  const estrategiaUnica = ciclo.estrategias.length === 1;

  return (
    <div className="animate-rise" style={{ animationDelay: `${delay}ms` }}>
      <Card
        tone={estrategiaUnica ? "purple" : "surface"}
        className="h-full p-4 md:p-5"
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">
              {ciclo.ciclo}
            </h2>
            <p className="mt-0.5 text-xs text-ink-3">
              {brl(ciclo.investido)} de {brl(ciclo.valor)} investidos
            </p>
          </div>
          <Chip tone={estrategiaUnica ? "purple" : "green"}>
            {pct(ciclo.pctInvestimento)} do investimento
          </Chip>
        </div>

        <div className="mt-3 flex flex-col divide-y divide-grid/70">
          {ciclo.estrategias.map((e) => (
            <div key={e.nome} className="py-2.5 first:pt-0 last:pb-0">
              <EstrategiaRow e={e} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
