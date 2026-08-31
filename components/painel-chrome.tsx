"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useData } from "@/lib/data";
import { useFilters } from "@/lib/filters";
import { timestampLabel } from "@/lib/format";
import { DatePicker } from "./date-picker";
import { SelectPill } from "./select-pill";

const NAV = [
  {
    href: "/painel/desempenho",
    label: "Desempenho",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
        <path d="M3 17 9 11l4 4 8-8" />
        <path d="M15 7h6v6" />
      </svg>
    ),
  },
  /* Segmentação oculta até segunda ordem — para restaurar, descomente este
     bloco e remova o redirect em next.config.mjs.
  {
    href: "/painel/segmentacao",
    label: "Segmentação",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5" />
        <circle cx="17.5" cy="9.5" r="2.5" />
        <path d="M16 15.2c2.6.2 4.6 1.7 5.4 4.3" />
      </svg>
    ),
  },
  */
  {
    href: "/painel/criativos",
    label: "Criativos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-4.5-4.5L7 20" />
      </svg>
    ),
  },
  {
    href: "/painel/metas",
    label: "Progresso de Meta",
    short: "Metas",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 z-40 hidden h-screen w-60 shrink-0 flex-col gap-6 p-5 lg:flex">
      <Link href="/" className="flex items-center px-2 pt-1" aria-label="Voltar para a página inicial">
        <Image src="/todas-lab-logo.png" alt="TODAS Lab" width={132} height={54} priority className="h-auto w-28" />
      </Link>
      <nav className="flex flex-col gap-1.5" aria-label="Páginas do painel">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-bold transition ${
                active
                  ? "bg-green text-white shadow-card"
                  : "text-ink-2 hover:bg-surface hover:text-ink"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-3xl bg-purple-soft p-3.5">
        <p className="text-xs font-bold text-purple-dark">TODAS Lab</p>
        <p className="mt-1 text-[11px] leading-relaxed text-ink-2">
          Laboratórios criativos nas artes e na cultura para TODAS as mulheres.
        </p>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed inset-x-3 bottom-3 z-40 flex items-stretch justify-between gap-1 rounded-3xl bg-surface/95 p-1.5 shadow-pop ring-1 ring-ink/10 backdrop-blur lg:hidden"
      aria-label="Páginas do painel"
    >
      {NAV.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-1 py-2 text-[10px] font-bold transition ${
              active ? "bg-green text-white" : "text-ink-3"
            }`}
          >
            {item.icon}
            {item.short ?? item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * Cabeçalho do painel: título curto + linha ÚNICA de filtros que escopa tudo abaixo
 * (período primeiro, depois ciclo e estratégia) + selo de atualização.
 */
export function PanelHeader({
  hideFilters = false,
  note,
}: {
  /** páginas acumuladas (metas) escondem o fatiador de período */
  hideFilters?: boolean;
  note?: string;
}) {
  const { status, updatedAt, error, refresh } = useData();
  const {
    ciclo,
    setCiclo,
    estrategia,
    setEstrategia,
    ciclosDisponiveis,
    estrategiasDisponiveis,
  } = useFilters();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link href="/" className="mr-1 lg:hidden" aria-label="Página inicial">
        <Image src="/todas-lab-logo.png" alt="TODAS Lab" width={96} height={40} className="h-auto w-24" />
      </Link>

      {!hideFilters ? (
        <>
          <DatePicker />
          <SelectPill
            label="Filtrar por ciclo"
            value={ciclo}
            onChange={setCiclo}
            options={[
              { value: "todos", label: "Todos os ciclos" },
              ...ciclosDisponiveis.map((c) => ({ value: c, label: c })),
            ]}
          />
          <SelectPill
            label="Filtrar por estratégia"
            value={estrategia}
            onChange={setEstrategia}
            options={[
              { value: "todas", label: "Todas as estratégias" },
              ...estrategiasDisponiveis.map((e) => ({ value: e, label: e })),
            ]}
          />
        </>
      ) : note ? (
        <span className="rounded-full bg-surface px-3.5 py-1.5 text-sm font-bold text-ink-2 shadow-card ring-1 ring-ink/5">
          {note}
        </span>
      ) : null}

      <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-green-soft px-3 py-1.5 text-[11px] font-bold text-green-deep">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            status === "error" ? "bg-magenta" : "bg-green"
          } ${status === "loading" ? "animate-pulse" : ""}`}
          aria-hidden
        />
        {status === "loading"
          ? "carregando…"
          : status === "error"
            ? (error ?? "erro ao carregar")
            : updatedAt
              ? `atualizado ${timestampLabel(updatedAt)}`
              : "atualizado"}
      </span>
      <button
        type="button"
        onClick={refresh}
        aria-label="Recarregar dados"
        title="Recarregar dados"
        className="rounded-full bg-surface p-1.5 text-ink-3 shadow-card ring-1 ring-ink/5 transition hover:text-ink"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4" aria-hidden>
          <path d="M20 12a8 8 0 1 1-2.34-5.66" />
          <path d="M20 4v4h-4" />
        </svg>
      </button>
    </div>
  );
}
