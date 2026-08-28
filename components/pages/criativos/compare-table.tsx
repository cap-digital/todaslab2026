"use client";

import type { AdSummary } from "@/lib/aggregate";
import { Chip } from "@/components/ui";
import { brl, int, pct } from "@/lib/format";
import { estrategiaTone } from "./estrategia";

const NUM_TH = "py-2 pr-4 text-right font-semibold last:pr-0";
const NUM_TD = "tnum py-2 pr-4 text-right text-ink-2 last:pr-0";

/** Tabela-gêmea da galeria: todos os anúncios, na ordenação ativa. */
export function CompareTable({ ads }: { ads: AdSummary[] }) {
  return (
    <div className="overflow-x-auto scroll-thin">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-grid text-xs text-ink-3">
            <th className="py-2 pr-4 font-semibold">Anúncio</th>
            <th className="py-2 pr-4 font-semibold">Estratégia</th>
            <th className={NUM_TH}>Investimento</th>
            <th className={NUM_TH}>Impressões</th>
            <th className={NUM_TH}>Cliques</th>
            <th className={NUM_TH}>CTR</th>
            <th className={NUM_TH}>Engajamento</th>
            <th className={NUM_TH}>CPM</th>
          </tr>
        </thead>
        <tbody>
          {ads.map((ad) => (
            <tr key={ad.adName} className="border-b border-grid/60 last:border-0">
              <td className="max-w-[240px] py-2 pr-4 font-semibold text-ink">
                <span className="line-clamp-1">{ad.adName}</span>
              </td>
              <td className="py-2 pr-4">
                <div className="flex flex-wrap gap-1">
                  {ad.estrategias.map((e) => (
                    <Chip key={e} tone={estrategiaTone(e)}>
                      {e}
                    </Chip>
                  ))}
                </div>
              </td>
              <td className={NUM_TD}>{brl(ad.investimento)}</td>
              <td className={NUM_TD}>{int(ad.impressions)}</td>
              <td className={NUM_TD}>{int(ad.clicks)}</td>
              <td className={NUM_TD}>{pct(ad.ctr)}</td>
              <td className={NUM_TD}>{int(ad.engagement)}</td>
              <td className={NUM_TD}>{brl(ad.cpm, { cents: true })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
