"use client";

import { useMemo, useState } from "react";
import { PanelHeader } from "@/components/painel-chrome";
import { Card, CardTitle, EmptyState, PageHeader } from "@/components/ui";
import { byAd } from "@/lib/aggregate";
import { useFilters } from "@/lib/filters";
import { HeroAd } from "@/components/pages/criativos/hero-ad";
import { AdCard } from "@/components/pages/criativos/ad-card";
import {
  SortBar,
  SORT_OPTIONS,
  type SortKey,
} from "@/components/pages/criativos/sort-bar";
import { CompareTable } from "@/components/pages/criativos/compare-table";

export default function CriativosPage() {
  const { rows } = useFilters();
  const [sortKey, setSortKey] = useState<SortKey>("impressions");

  const ads = useMemo(() => byAd(rows), [rows]);

  // Destaque é sempre o melhor por impressões (independe da ordenação da galeria).
  const destaque = useMemo(
    () =>
      ads.length > 0
        ? [...ads].sort((a, b) => b.impressions - a.impressions)[0]
        : null,
    [ads]
  );

  const sorted = useMemo(
    () => [...ads].sort((a, b) => b[sortKey] - a[sortKey]),
    [ads, sortKey]
  );

  const sortLabel =
    SORT_OPTIONS.find((o) => o.key === sortKey)?.label.toLowerCase() ??
    "impressões";
  const countLabel =
    ads.length === 1 ? "1 anúncio no recorte" : `${ads.length} anúncios no recorte`;
  const tableDelay = Math.min(140 + sorted.length * 70, 560);

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <PanelHeader />
      <PageHeader
        kicker="Galeria"
        title="Criativos"
        right={
          ads.length > 0 ? (
            <p className="text-sm font-bold text-ink-3">{countLabel}</p>
          ) : undefined
        }
      />

      {destaque ? (
        <div className="animate-rise">
          <HeroAd ad={destaque} />
        </div>
      ) : (
        <Card className="animate-rise p-4 md:p-5">
          <EmptyState message="Nenhum anúncio no recorte selecionado. A campanha acabou de começar — ajuste o período ou os filtros acima para ver os criativos." />
        </Card>
      )}

      {ads.length > 0 ? (
        <>
          <div className="animate-rise" style={{ animationDelay: "70ms" }}>
            <SortBar value={sortKey} onChange={setSortKey} />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-3">
            {sorted.map((ad, i) => (
              <div
                key={ad.adName}
                className="animate-rise"
                style={{ animationDelay: `${Math.min(140 + i * 70, 560)}ms` }}
              >
                <AdCard ad={ad} />
              </div>
            ))}
          </div>

          <div
            className="animate-rise"
            style={{ animationDelay: `${tableDelay}ms` }}
          >
            <Card className="p-4 md:p-5">
              <CardTitle
                title="Comparativo"
                subtitle={`${countLabel[0].toUpperCase()}${countLabel.slice(1)}, na ordenação por ${sortLabel}`}
              />
              <div className="mt-4">
                <CompareTable ads={sorted} />
              </div>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
