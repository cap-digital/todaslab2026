"use client";

import { useMemo } from "react";
import { useData } from "@/lib/data";
import { computeProgress } from "@/lib/metas";
import { Notice, PageHeader } from "@/components/ui";
import { PanelHeader } from "@/components/painel-chrome";
import { ContractHero } from "@/components/pages/metas/contract-hero";
import { CicloCard } from "@/components/pages/metas/ciclo-card";
import { MetricSummary } from "@/components/pages/metas/metric-summary";

/**
 * Progresso de meta — contratado × realizado, SEMPRE acumulado da campanha
 * inteira (useData().rows direto; o date-picker não fatia contrato).
 */
export default function MetasPage() {
  const { rows, status } = useData();
  const progress = useMemo(() => computeProgress(rows), [rows]);

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <PanelHeader hideFilters note="Acumulado — todo o período" />
      <PageHeader kicker="Contrato" title="Progresso de meta" />

      {status === "ready" && rows.length === 0 ? (
        <Notice>
          A campanha acabou de começar — assim que a entrega registrar os
          primeiros números, o progresso aparece aqui. As metas contratadas já
          estão no mapa abaixo.
        </Notice>
      ) : null}

      <ContractHero progress={progress} />

      <div className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-2">
        {progress.map((ciclo, i) => (
          <CicloCard key={ciclo.ciclo} ciclo={ciclo} delay={(i + 1) * 70} />
        ))}
      </div>

      <MetricSummary progress={progress} delay={(progress.length + 1) * 70} />
    </div>
  );
}
