import type { Metadata } from "next";
import { Fraunces, Figtree } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/lib/data";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const sans = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "TODAS Lab · Painel de Mídia",
  description:
    "Acompanhamento da campanha de mídia Meta Ads do TODAS Lab — ciclo de laboratórios criativos nas artes e na cultura para TODAS as mulheres.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${display.variable} ${sans.variable} font-sans antialiased`}>
        <DataProvider>{children}</DataProvider>
      </body>
    </html>
  );
}
