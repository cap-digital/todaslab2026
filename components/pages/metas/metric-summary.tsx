"use client";

import type { CicloProgress, MetricKind } from "@/lib/metas";
import { METRIC_LABEL } from "@/lib/metas";
import { compact, pct } from "@/lib/format";
import { Card, CardTitle, Meter, Sparkle, StatValue } from "@/components/ui";

const METRIC_ORDER: MetricKind[] = ["engajamento", "impressoes", "cliques"];

const METRIC_TONE: Record<MetricKind, "green" | "purple" | "orange"> = {
  engajamento: "green",
  impressoes: "purple",
  cliques: "orange",
};

const METRIC_DOT: Record<MetricKind, string> = {
  engajamento: "bg-green",
  impressoes: "bg-purple",
  cliques: "bg-orange",
};

/**
 * Entrega agregada por métrica contratada: soma dinamicamente todas as
 * estratégias do contrato (METAS via computeProgress), agrupadas por metric.
 */
export function MetricSummary({
  progress,
  delay = 0,
}: {
  progress: CicloProgress[];
  delay?: number;
}) {
  const porMetrica = METRIC_ORDER.map((metric) => {
    let contratado = 0;
    let entregue = 0;
    for (const c of progress) {
      for (const e of c.estrategias) {
        if (e.metric === metric) {
          contratado += e.meta;
          entregue += e.entregue;
        }
      }
    }
    return {
      metric,
      contratado,
      entregue,
      frac: contratado > 0 ? entregue / contratado : 0,
    };
  });

  return (
    <div className="animate-rise" style={{ animationDelay: `${delay}ms` }}>
      <Card className="p-4 md:p-5">
        <CardTitle
          title="Entrega por métrica"
          subtitle="Soma de todas as estratégias contratadas · acumulado da campanha"
          right={<Sparkle className="h-5 w-5 text-orange-bright" />}
        />

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {porMetrica.map((m) => (
            <div key={m.metric}>
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-2 w-2 rounded-full ${METRIC_DOT[m.metric]}`}
                  aria-hidden
                />
                <span className="text-xs font-semibold text-ink-2">
                  {METRIC_LABEL[m.metric]}
                </span>
              </div>
              <div className="mt-1.5">
                <StatValue
                  value={`${compact(m.entregue)} / ${compact(m.contratado)}`}
                />
              </div>
              <div className="mt-2">
                <Meter
                  value={m.frac}
                  tone={METRIC_TONE[m.metric]}
                  label={`Entrega — ${METRIC_LABEL[m.metric]}`}
                />
              </div>
              <p className="mt-1 text-[11px] font-semibold text-ink-3">
                {pct(m.frac)} da meta contratada
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
