"use client";

import Image from "next/image";
import Link from "next/link";
import { Flower, Sparkle } from "@/components/ui";

export default function Home() {
  return (
    <div className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* decoração orgânica da marca (recortada, nunca interativa) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-14 -top-14 animate-floaty">
          <Flower className="h-44 w-44 text-lilac opacity-40 md:h-60 md:w-60" />
        </div>
        {/* delay negativo desincroniza o flutuar das duas flores */}
        <div className="absolute -bottom-16 -right-12 animate-floaty" style={{ animationDelay: "-3s" }}>
          <Flower className="h-52 w-52 text-green opacity-[0.14] md:h-72 md:w-72" />
        </div>
        <div className="absolute right-[12%] top-[18%] animate-spin-slow">
          <Sparkle className="h-7 w-7 text-orange-bright opacity-80 md:h-9 md:w-9" />
        </div>
        <div className="absolute left-[10%] top-[58%] animate-floaty" style={{ animationDelay: "-1.5s" }}>
          <Sparkle className="h-4 w-4 text-orange opacity-60 md:h-5 md:w-5" />
        </div>
      </div>

      {/* hero */}
      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-7 px-6 py-16 text-center">
        <div className="animate-rise" style={{ animationDelay: "0ms" }}>
          <Image
            src="/todas-lab-logo.png"
            alt="TODAS Lab"
            width={460}
            height={188}
            priority
            className="h-auto w-52 md:w-72"
          />
        </div>

        <div className="animate-rise" style={{ animationDelay: "70ms" }}>
          <h1 className="font-display text-4xl font-bold leading-tight text-ink md:text-6xl">
            Painel de <em className="italic text-green-dark">mídia</em>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-2 md:text-base">
            Acompanhamento da campanha Meta Ads do TODAS Lab — ciclo de
            laboratórios criativos nas artes e na cultura para TODAS as
            mulheres, um projeto da plataforma TODAS.
          </p>
        </div>

        <div
          className="flex animate-rise flex-col items-center gap-3"
          style={{ animationDelay: "140ms" }}
        >
          <Link
            href="/painel/desempenho"
            className="group inline-flex items-center gap-2.5 rounded-full bg-green px-7 py-4 text-base font-bold text-white shadow-pop transition duration-200 hover:-translate-y-0.5 hover:bg-green-dark md:px-9"
          >
            Acessar painel de mídia
            <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
          <Link
            href="/painel/metas"
            className="text-xs font-semibold text-ink-3 underline-offset-4 transition hover:text-green-deep hover:underline"
          >
            Progresso de meta →
          </Link>
        </div>
      </main>

      {/* rodapé fino */}
      <footer className="relative z-10 pb-6 text-center text-[11px] font-semibold tracking-wide text-ink-3">
        TODAS Lab · Meta Ads · @todas.lab
      </footer>
    </div>
  );
}
