"use client";

import type { Totals } from "@/lib/aggregate";
import { CONTRATO_TOTAL } from "@/lib/metas";
import { brl, compact, int, pct } from "@/lib/format";
import { Card, CardTitle, Meter, Sparkle, StatTile, StatValue } from "@/components/ui";

/** Cartão-herói: investimento total do recorte + relação com o contrato. */
export function HeroInvestimento({ t }: { t: Totals }) {
  const fracaoContrato = t.investimento / CONTRATO_TOTAL;
  return (
    <Card tone="green" className="relative h-full overflow-hidden p-4 md:p-5">
      <Sparkle className="absolute right-4 top-4 h-7 w-7 animate-floaty text-green" />
      <CardTitle title="Investimento total" subtitle="soma do período e filtros selecionados" />
      <StatValue value={brl(t.investimento)} size="hero" className="mt-4" />
      <p className="mt-2.5 text-xs text-ink-2">
        <span className="font-bold text-green-deep">{pct(fracaoContrato)}</span> do contrato de{" "}
        {brl(CONTRATO_TOTAL)}
      </p>
      <div className="mt-2.5">
        <Meter
          value={fracaoContrato}
          tone="green"
          label="Investimento em relação ao contrato"
        />
      </div>
    </Card>
  );
}

/**
 * Faixa de 4 números de entrega. O accent segue a identidade da métrica no
 * painel (metas/metric-summary e ritmo diário): Engajamento=green ·
 * Impressões=purple · Cliques=orange; ThruPlays usa magenta (sem par em metas).
 */
export function EntregaTiles({ t }: { t: Totals }) {
  const hintCliques =
    t.linkClicks > 0
      ? `${int(t.linkClicks)} ${t.linkClicks === 1 ? "clique no link" : "cliques no link"}`
      : undefined;
  const hintThruplays =
    t.videoViews > 0
      ? `${int(t.videoViews)} ${
          t.videoViews === 1 ? "visualização de vídeo" : "visualizações de vídeo"
        }`
      : undefined;

  return (
    <Card className="h-full p-4 md:p-5">
      <CardTitle title="Entrega no período" subtitle="o que os filtros acima escopam" />
      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4 md:grid-cols-4">
        <StatTile label="Impressões" value={compact(t.impressions)} accent="purple" />
        <StatTile label="Cliques" value={int(t.clicks)} hint={hintCliques} accent="orange" />
        {/* métrica única da Meta (actions_post_engagement) — nunca somada por nós */}
        <StatTile label="Engajamento" value={int(t.engagement)} accent="green" />
        <StatTile
          label="ThruPlays"
          value={int(t.thruplays)}
          hint={hintThruplays}
          accent="magenta"
        />
      </div>
    </Card>
  );
}
