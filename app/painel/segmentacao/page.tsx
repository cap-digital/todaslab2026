"use client";

import { useFilters } from "@/lib/filters";
import { PageHeader } from "@/components/ui";
import { PanelHeader } from "@/components/painel-chrome";
import { GeneroDonut } from "@/components/pages/segmentacao/genero-donut";
import { IdadeGeneroBarras } from "@/components/pages/segmentacao/idade-genero-barras";
import { HeatmapIdadeGenero } from "@/components/pages/segmentacao/heatmap-idade-genero";
import { MelhorSegmento } from "@/components/pages/segmentacao/melhor-segmento";

export default function SegmentacaoPage() {
  const { rows } = useFilters();

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <PanelHeader />
      <PageHeader kicker="Público" title="Segmentação" />

      {/* faixa-herói: donut de gênero (destaque colorido) + idade × gênero */}
      <div className="grid grid-cols-1 items-start gap-3 md:gap-4 lg:grid-cols-[1.4fr_1.6fr]">
        <div className="animate-rise" style={{ animationDelay: "0ms" }}>
          <GeneroDonut rows={rows} />
        </div>
        <div className="animate-rise" style={{ animationDelay: "70ms" }}>
          <IdadeGeneroBarras rows={rows} />
        </div>
      </div>

      <div className="animate-rise" style={{ animationDelay: "140ms" }}>
        <HeatmapIdadeGenero rows={rows} />
      </div>

      <div className="animate-rise" style={{ animationDelay: "210ms" }}>
        <MelhorSegmento rows={rows} />
      </div>
    </div>
  );
}
