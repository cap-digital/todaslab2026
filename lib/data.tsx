"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { DataStatus, Row } from "./types";

/* ---------- parsing ---------- */

function num(v: unknown): number {
  if (v === null || v === undefined || v === "") return 0;
  const n = typeof v === "number" ? v : Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : v == null ? "" : String(v);
}

/** "2026-08-28T03:00:00.000Z" (meia-noite BRT) → "2026-08-28" */
function toDay(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  // desloca -3h (America/Sao_Paulo) e pega a parte da data em UTC
  const brt = new Date(d.getTime() - 3 * 60 * 60 * 1000);
  return brt.toISOString().slice(0, 10);
}

export function parseRows(raw: unknown): Row[] {
  const list = Array.isArray(raw)
    ? raw
    : raw && typeof raw === "object" && Array.isArray((raw as { meta?: unknown[] }).meta)
      ? (raw as { meta: unknown[] }).meta
      : [];

  return list
    .map((r): Row | null => {
      if (!r || typeof r !== "object") return null;
      const o = r as Record<string, unknown>;
      return {
        date: toDay(str(o.date)),
        campaign: str(o.campaign),
        adsetName: str(o.adset_name),
        adName: str(o.ad_name),
        age: str(o.age) || "unknown",
        gender: str(o.gender) || "unknown",
        thumbnailUrl: str(o.thumbnail_url),
        permalink: str(o.instagram_permalink_url),
        investimento: num(o["Investimento"]),
        impressions: num(o.impressions),
        clicks: num(o.clicks),
        linkClicks: num(o.actions_link_click),
        engagement: num(o.actions_post_engagement),
        reactions: num(o.actions_post_reaction),
        comments: num(o.actions_comment),
        saves: num(o.actions_onsite_conversion_post_save),
        shares: num(o.actions_post),
        videoViews: num(o.actions_video_view),
        thruplays: num(o.video_thruplay_watched_actions_video_view),
        videoP25: num(o.video_p25_watched_actions_video_view),
        videoP50: num(o.video_p50_watched_actions_video_view),
        videoP75: num(o.video_p75_watched_actions_video_view),
        videoP95: num(o.video_p95_watched_actions_video_view),
        videoP100: num(o.video_p100_watched_actions_video_view),
        ciclo: str(o["Ciclo"]) || "—",
        estrategia: str(o["Estratégia"]) || "—",
        device:
          str(o.device || o.impression_device || o.device_platform) || null,
      };
    })
    .filter((r): r is Row => r !== null && r.date !== "");
}

/* ---------- provider ---------- */

type DataContextValue = {
  rows: Row[];
  status: DataStatus;
  /** timestamp da resposta da função (ISO) */
  updatedAt: string | null;
  error: string | null;
  refresh: () => void;
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState<DataStatus>("loading");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inflight = useRef(false);

  const load = useCallback(async () => {
    if (inflight.current) return;
    inflight.current = true;
    // mantém as linhas anteriores durante o refetch (sem skeleton, sem salto)
    setStatus((s) => (s === "ready" ? "ready" : "loading"));
    setError(null);
    try {
      const res = await fetch("/api/data", { cache: "no-store" });
      if (!res.ok) throw new Error(`Falha ao carregar (${res.status})`);
      const json = await res.json();
      setRows(parseRows(json));
      setUpdatedAt(
        typeof json?.timestamp === "string" ? json.timestamp : new Date().toISOString()
      );
      setStatus("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
      setStatus((s) => (s === "ready" ? "ready" : "error"));
    } finally {
      inflight.current = false;
    }
  }, []);

  // começa a carregar assim que qualquer página monta (inclusive a inicial)
  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo(
    () => ({ rows, status, updatedAt, error, refresh: load }),
    [rows, status, updatedAt, error, load]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData precisa estar dentro de <DataProvider>");
  return ctx;
}
