"use client";

import type { AdSummary } from "@/lib/aggregate";
import { Card, Chip, Sparkle } from "@/components/ui";
import { brl, compact, int, pct } from "@/lib/format";
import { Thumb } from "./thumb";
import { estrategiaTone, metricaContratada, type ChipTone } from "./estrategia";

/** Classes do bloco de destaque por tom de estratégia (mesma família dos Chips). */
const DESTAQUE_TONE: Record<ChipTone, { box: string; label: string }> = {
  green: { box: "bg-green-soft", label: "text-green-deep" },
  purple: { box: "bg-purple-soft", label: "text-purple-dark" },
  orange: { box: "bg-orange-soft", label: "text-orange" },
  magenta: { box: "bg-magenta-soft", label: "text-magenta" },
  neutral: { box: "bg-sunken", label: "text-ink-2" },
};

function valorMetrica(ad: AdSummary, key: "engagement" | "impressions" | "clicks"): string {
  if (key === "impressions") return compact(ad.impressions);
  if (key === "clicks") return int(ad.clicks);
  return int(ad.engagement);
}

/** Cartão da galeria: preview + identidade + a métrica CONTRATADA em destaque. */
export function AdCard({ ad }: { ad: AdSummary }) {
  const contratada = metricaContratada(ad.estrategias);
  const tone = DESTAQUE_TONE[estrategiaTone(ad.estrategias[0] ?? "")];

  // custo unitário da métrica contratada ("—" enquanto não há entrega)
  const custo =
    contratada === null
      ? null
      : contratada.custoKey === "cpm"
        ? ad.impressions > 0
          ? brl(ad.cpm, { cents: true })
          : "—"
        : contratada.custoKey === "cpc"
          ? ad.clicks > 0
            ? brl(ad.cpc, { cents: true })
            : "—"
          : ad.engagement > 0
            ? brl(ad.cpe, { cents: true })
            : "—";

  // as demais métricas seguem no grid neutro
  const secundarias = [
    { label: "Invest.", value: brl(ad.investimento) },
    ...(contratada?.key !== "impressions"
      ? [{ label: "Impressões", value: compact(ad.impressions) }]
      : []),
    ...(contratada?.key !== "clicks" ? [{ label: "Cliques", value: int(ad.clicks) }] : []),
    ...(contratada?.key !== "engagement" && contratada !== null
      ? [{ label: "Engaj.", value: int(ad.engagement) }]
      : []),
  ].slice(0, 3);

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <Thumb
        src={ad.thumbnailUrl}
        alt={`Criativo: ${ad.adName}`}
        className="aspect-square w-full rounded-t-blob"
      />
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-ink">
          {ad.adName}
        </h3>

        <div className="flex flex-wrap gap-1.5">
          {ad.ciclos.map((c) => (
            <Chip key={c}>{c}</Chip>
          ))}
          {ad.estrategias.map((e) => (
            <Chip key={e} tone={estrategiaTone(e)}>
              {e}
            </Chip>
          ))}
        </div>

        {contratada ? (
          <div className={`rounded-2xl px-3 py-2 ${tone.box}`}>
            <p className={`flex items-center gap-1 text-[11px] font-bold ${tone.label}`}>
              <Sparkle className="h-3 w-3" aria-hidden />
              {contratada.label} · métrica contratada
            </p>
            <div className="mt-1 flex items-baseline justify-between gap-2">
              <span className="font-sans text-xl font-bold leading-none tracking-tight text-ink">
                {valorMetrica(ad, contratada.key)}
              </span>
              <span className="text-[11px] font-bold text-ink-2">
                {contratada.custoLabel} {custo}
              </span>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-3 gap-2">
          {(contratada
            ? secundarias
            : [
                { label: "Impressões", value: compact(ad.impressions) },
                { label: "Invest.", value: brl(ad.investimento) },
                { label: "Cliques", value: int(ad.clicks) },
              ]
          ).map((m) => (
            <div key={m.label}>
              <p className="text-[11px] text-ink-3">{m.label}</p>
              <p className="mt-0.5 font-sans text-sm font-bold leading-none tracking-tight text-ink">
                {m.value}
              </p>
            </div>
          ))}
        </div>

        <p className="text-xs text-ink-3">
          CTR {pct(ad.ctr)}
          {contratada?.custoKey !== "cpm" ? <> · CPM {brl(ad.cpm, { cents: true })}</> : null}
          {contratada === null ? <> · Engaj. {int(ad.engagement)}</> : null}
        </p>

        {ad.permalink ? (
          <div className="mt-auto pt-1">
            <a
              href={ad.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-bold text-green-dark transition hover:text-green-deep hover:underline"
            >
              Instagram ↗
            </a>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
