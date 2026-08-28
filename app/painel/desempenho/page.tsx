"use client";

import { useFilters } from "@/lib/filters";
import { totals } from "@/lib/aggregate";
import { PanelHeader } from "@/components/painel-chrome";
import { PageHeader } from "@/components/ui";
import { EntregaTiles, HeroInvestimento } from "@/components/pages/desempenho/faixa-hero";
import { RitmoDiario } from "@/components/pages/desempenho/ritmo-diario";
import { PorEstrategia } from "@/components/pages/desempenho/por-estrategia";
import { Eficiencia } from "@/components/pages/desempenho/eficiencia";

export default function DesempenhoPage() {
  const { rows } = useFilters();
  const t = totals(rows);

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <PanelHeader />
      <PageHeader kicker="Visão geral" title="Desempenho" />

      {/* faixa-herói: número grande + 4 tiles de entrega */}
      <div className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-[1.1fr_1.9fr]">
        <div className="animate-rise" style={{ animationDelay: "0ms" }}>
          <HeroInvestimento t={t} />
        </div>
        <div className="animate-rise" style={{ animationDelay: "70ms" }}>
          <EntregaTiles t={t} />
        </div>
      </div>

      {/* ritmo diário: dois mini-gráficos empilhados no mesmo domínio x */}
      <div className="animate-rise" style={{ animationDelay: "140ms" }}>
        <RitmoDiario rows={rows} />
      </div>

      {/* linha final: estratégia (largo) + eficiência (estreito) */}
      <div className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-[1.6fr_1.4fr]">
        <div className="animate-rise" style={{ animationDelay: "210ms" }}>
          <PorEstrategia rows={rows} />
        </div>
        <div className="animate-rise" style={{ animationDelay: "280ms" }}>
          <Eficiencia t={t} />
        </div>
      </div>
    </div>
  );
}
