"use client";

import type { AdSummary } from "@/lib/aggregate";
import { brl, compact, int, pct } from "@/lib/format";
import { Flower, Sparkle } from "@/components/ui";
import { Thumb } from "./thumb";
import { estrategiaColor, metricaContratada } from "./estrategia";

/**
 * Cartão-capa: o melhor criativo por impressões no recorte atual.
 * Único cartão escuro do painel. A métrica CONTRATADA da estratégia lidera.
 */
export function HeroAd({ ad }: { ad: AdSummary }) {
  const contratada = metricaContratada(ad.estrategias);
  const valorContratada =
    contratada === null
      ? ""
      : contratada.key === "impressions"
        ? compact(ad.impressions)
        : contratada.key === "clicks"
          ? int(ad.clicks)
          : int(ad.engagement);

  const restantes = [
    ...(contratada?.key !== "impressions"
      ? [{ label: "Impressões", value: compact(ad.impressions) }]
      : []),
    { label: "Investimento", value: brl(ad.investimento) },
    ...(contratada?.key !== "clicks" ? [{ label: "Cliques", value: int(ad.clicks) }] : []),
    ...(contratada?.key === "engagement"
      ? [{ label: "CPE", value: ad.engagement > 0 ? brl(ad.cpe, { cents: true }) : "—" }]
      : [{ label: "CTR", value: pct(ad.ctr) }]),
  ];

  const stats = contratada
    ? [
        { label: contratada.label, value: valorContratada, contratada: true },
        ...restantes.slice(0, 3).map((s) => ({ ...s, contratada: false })),
      ]
    : [
        { label: "Impressões", value: compact(ad.impressions), contratada: false },
        { label: "Investimento", value: brl(ad.investimento), contratada: false },
        { label: "Cliques", value: int(ad.clicks), contratada: false },
        { label: "CTR", value: pct(ad.ctr), contratada: false },
      ];

  return (
    <section className="relative overflow-hidden rounded-blob bg-ink text-white shadow-pop">
      <Flower className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 animate-spin-slow text-white/[0.07]" />
      <div className="relative flex flex-col gap-4 p-4 md:flex-row md:items-center md:gap-6 md:p-6">
        <div className="mx-auto w-full max-w-[260px] shrink-0 md:mx-0 md:w-40 lg:w-48">
          <Thumb
            src={ad.thumbnailUrl}
            alt={`Criativo: ${ad.adName}`}
            className="aspect-[4/5] w-full rounded-2xl"
          />
        </div>

        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-bright px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
            <Sparkle className="h-3 w-3" />
            destaque
          </span>

          <h2 className="mt-3 font-display text-xl font-bold leading-tight md:text-2xl">
            {ad.adName}
          </h2>
          <p className="mt-1 text-xs text-white/50">
            Melhor criativo por impressões no recorte atual
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {ad.ciclos.map((c) => (
              <span
                key={c}
                className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white/85"
              >
                {c}
              </span>
            ))}
            {ad.estrategias.map((e) => (
              <span
                key={e}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white/85"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: estrategiaColor(e) }}
                  aria-hidden
                />
                {e}
              </span>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <p
                  className={`flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider ${
                    s.contratada ? "text-orange-bright" : "text-white/60"
                  }`}
                >
                  {s.contratada ? <Sparkle className="h-3 w-3" aria-hidden /> : null}
                  {s.label}
                  {s.contratada ? " · contratada" : ""}
                </p>
                <p className="mt-1.5 font-sans text-xl font-bold leading-none tracking-tight text-white md:text-2xl">
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {ad.permalink ? (
            <a
              href={ad.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/20"
            >
              Ver no Instagram ↗
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
