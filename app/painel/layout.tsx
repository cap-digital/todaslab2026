"use client";

import { FiltersProvider } from "@/lib/filters";
import { MobileNav, Sidebar } from "@/components/painel-chrome";

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <FiltersProvider>
      {/* sidebar compacta (w-56) em todo desktop — override via seletor filho porque a classe base vive em painel-chrome */}
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] lg:[&>aside]:w-56">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 pb-28 pt-3 md:px-5 md:pt-4 lg:pb-8">{children}</main>
      </div>
      <MobileNav />
    </FiltersProvider>
  );
}
