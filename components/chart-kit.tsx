"use client";

/**
 * Tokens de gráfico — paleta categórica validada (ordem fixa, nunca ciclar).
 * s1 verde · s2 lilás · s3 laranja · s4 magenta
 */
export const VIZ = {
  s1: "#2f9e0e",
  s2: "#a94fd1",
  s3: "#d97708",
  s4: "#c9407a",
  grid: "#ece2d9",
  axis: "#d8ccc1",
  ink: "#1c2417",
  ink2: "#5b6355",
  ink3: "#8a9083",
  surface: "#fffdfb",
  /* rampa sequencial de UM matiz (verde) para heatmaps/magnitude */
  seq: ["#eef8e8", "#d5efc6", "#b3e199", "#8ccf68", "#5fb838", "#2f9e0e", "#1f7a06", "#145c04"],
  /* wash de área: matiz da série a ~10% */
  greenWash: "rgba(47, 158, 14, 0.10)",
  purpleWash: "rgba(169, 79, 209, 0.10)",
  orangeWash: "rgba(217, 119, 8, 0.10)",
} as const;

/** Especificação de marcas (dataviz): barras finas com ponta arredondada. */
export const BAR = {
  maxBarSize: 22,
  radius: [4, 4, 0, 0] as [number, number, number, number],
};
export const BAR_H = {
  maxBarSize: 18,
  radius: [0, 4, 4, 0] as [number, number, number, number],
};

export const AXIS_TICK = { fill: VIZ.ink3, fontSize: 11 };

/** Escolhe degrau da rampa sequencial por fração 0..1 (para heatmap). */
export function seqColor(fraction: number): string {
  if (!Number.isFinite(fraction) || fraction <= 0) return VIZ.seq[0];
  const i = Math.min(VIZ.seq.length - 1, Math.max(0, Math.round(fraction * (VIZ.seq.length - 1))));
  return VIZ.seq[i];
}

/** Tinta legível (branca/escura) sobre um degrau da rampa. */
export function inkOnSeq(fraction: number): string {
  return fraction > 0.55 ? "#ffffff" : VIZ.ink;
}

type TooltipRow = { name: string; value: string; color: string; shape?: "line" | "rect" };

/**
 * Tooltip padrão: valor em destaque, nome secundário, chave de série
 * como traço curto na cor da série. Nunca é o único caminho até o valor
 * (toda página tem tabela/rótulos).
 */
export function VizTooltip({
  active,
  label,
  rows,
}: {
  active?: boolean;
  label?: string;
  rows: TooltipRow[];
}) {
  if (!active || rows.length === 0) return null;
  return (
    <div className="pointer-events-none rounded-2xl bg-ink px-3.5 py-2.5 shadow-pop">
      {label ? (
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-white/60">{label}</p>
      ) : null}
      <div className="flex flex-col gap-1">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center gap-2">
            {r.shape === "rect" ? (
              <span className="h-2 w-2 rounded-[3px]" style={{ background: r.color }} aria-hidden />
            ) : (
              <span className="h-0.5 w-3.5 rounded-full" style={{ background: r.color }} aria-hidden />
            )}
            <span className="text-sm font-bold text-white">{r.value}</span>
            <span className="text-[11px] text-white/60">{r.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Adaptador para o Tooltip do recharts: converte payload em linhas do VizTooltip.
 * Uso: <Tooltip content={<RechartsTooltip format={(k,v)=>...} />} />
 */
type TooltipPayloadItem = {
  dataKey?: string | number;
  value?: number | string;
  color?: string;
  fill?: string;
};

export function RechartsTooltip(props: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: unknown;
  format: (dataKey: string, value: number) => { name: string; value: string } | null;
  labelFormat?: (label: unknown) => string;
  shape?: "line" | "rect";
}) {
  const { active, payload, label, format, labelFormat, shape } = props;
  const rows: TooltipRow[] = (payload ?? [])
    .map((p): TooltipRow | null => {
      const out = format(String(p.dataKey), Number(p.value ?? 0));
      if (!out) return null;
      return { ...out, color: String(p.color ?? p.fill ?? VIZ.ink2), shape };
    })
    .filter((r): r is TooltipRow => r !== null);
  return (
    <VizTooltip
      active={active}
      label={labelFormat ? labelFormat(label) : label != null ? String(label) : undefined}
      rows={rows}
    />
  );
}
