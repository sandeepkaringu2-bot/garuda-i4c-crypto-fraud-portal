import { useMemo, useState } from "react";
import { displayAddress, shortAddr, usdt } from "@/lib/garuda/format";
import { useGaruda } from "@/lib/garuda/store";
import type { TraceResult } from "@/lib/garuda/types";

const KIND_FILL: Record<string, string> = {
  burner: "var(--color-info)",
  layer: "var(--color-ring)",
  vasp: "var(--color-ok)",
  offramp: "var(--color-ok)",
  mixer: "var(--color-danger)",
  sanctioned: "var(--color-danger)",
  bridge: "var(--color-warn)",
  unknown: "var(--color-subtle)",
};

export function HopGraph({ trace }: { trace: TraceResult }) {
  const mode = useGaruda((s) => s.addressMode);
  const [replay, setReplay] = useState(trace.maxHop);
  const [selected, setSelected] = useState<string | null>(null);

  const layout = useMemo(() => {
    const cols = new Map<number, typeof trace.nodes>();
    for (const n of trace.nodes) {
      const list = cols.get(n.hop) ?? [];
      list.push(n);
      cols.set(n.hop, list);
    }
    const nodeW = 148;
    const nodeH = 44;
    const gapX = 56;
    const gapY = 18;
    const pad = 24;
    const maxCount = Math.max(...[...cols.values()].map((l) => l.length), 1);
    const height = pad * 2 + maxCount * (nodeH + gapY) - gapY;
    const width = pad * 2 + (trace.maxHop + 1) * (nodeW + gapX) - gapX;
    const pos = new Map<string, { x: number; y: number }>();
    for (const [hop, list] of cols) {
      const colH = list.length * (nodeH + gapY) - gapY;
      const startY = (height - colH) / 2;
      list.forEach((n, i) => {
        pos.set(n.id, { x: pad + hop * (nodeW + gapX), y: startY + i * (nodeH + gapY) });
      });
    }
    return { pos, width, height, nodeW, nodeH };
  }, [trace]);

  const visibleEdges = trace.edges.filter((e) => {
    const tn = trace.nodes.find((n) => n.id === e.to);
    return (tn?.hop ?? 99) <= replay;
  });

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted">Hop replay</span>
        <input
          type="range"
          min={0}
          max={trace.maxHop}
          value={replay}
          onChange={(e) => setReplay(Number(e.target.value))}
          className="w-40 accent-primary"
        />
        <span className="font-mono text-xs tabular-nums text-fg">
          {replay}/{trace.maxHop}
        </span>
        <button
          type="button"
          className="h-9 rounded-md px-3 text-xs text-muted hover:text-fg"
          onClick={() => {
            setReplay(0);
            let h = 0;
            const tick = () => {
              h += 1;
              setReplay(Math.min(h, trace.maxHop));
              if (h < trace.maxHop) window.setTimeout(tick, 420);
            };
            window.setTimeout(tick, 280);
          }}
        >
          Play hops
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl bg-bg p-2 shadow-[var(--shadow-border)]">
        <svg
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          width="100%"
          style={{ minWidth: Math.min(layout.width, 920), height: Math.min(layout.height, 420) }}
          role="img"
          aria-label="Fund-flow hop graph"
        >
          {visibleEdges.map((e) => {
            const a = layout.pos.get(e.from);
            const b = layout.pos.get(e.to);
            if (!a || !b) return null;
            const x1 = a.x + layout.nodeW;
            const y1 = a.y + layout.nodeH / 2;
            const x2 = b.x;
            const y2 = b.y + layout.nodeH / 2;
            const mid = (x1 + x2) / 2;
            return (
              <g key={`${e.from}-${e.to}-${e.txid}`}>
                <path
                  d={`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`}
                  fill="none"
                  stroke="color-mix(in oklab, var(--color-fg) 28%, transparent)"
                  strokeWidth="1.4"
                />
                <text
                  x={mid}
                  y={(y1 + y2) / 2 - 6}
                  textAnchor="middle"
                  fill="var(--color-muted)"
                  fontSize="9"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {e.amount >= 1 ? e.amount : e.amount.toFixed(4)}
                </text>
              </g>
            );
          })}
          {trace.nodes
            .filter((n) => n.hop <= replay)
            .map((n) => {
              const p = layout.pos.get(n.id);
              if (!p) return null;
              const fill = KIND_FILL[n.kind] ?? KIND_FILL.unknown;
              const active = selected === n.id;
              const text = shortAddr(displayAddress(n.id, mode) === n.id ? n.label : displayAddress(n.id, mode), 16);
              return (
                <g
                  key={n.id}
                  onClick={() => setSelected(n.id)}
                  style={{ cursor: "pointer" }}
                >
                  <rect
                    x={p.x}
                    y={p.y}
                    width={layout.nodeW}
                    height={layout.nodeH}
                    rx={8}
                    fill="var(--color-surface)"
                    stroke={active ? "var(--color-primary)" : fill}
                    strokeWidth={active ? 2 : 1.4}
                  />
                  <circle cx={p.x + 12} cy={p.y + 22} r={4} fill={fill} />
                  <text
                    x={p.x + 22}
                    y={p.y + 19}
                    fill="var(--color-fg)"
                    fontSize="10"
                    fontFamily="IBM Plex Sans, sans-serif"
                  >
                    {text}
                  </text>
                  <text
                    x={p.x + 22}
                    y={p.y + 33}
                    fill="var(--color-muted)"
                    fontSize="9"
                    fontFamily="IBM Plex Sans, sans-serif"
                  >
                    hop {n.hop} · {n.kind}
                  </text>
                </g>
              );
            })}
        </svg>
      </div>

      <ul className="mt-3 flex flex-wrap gap-3 text-xs text-muted">
        <li className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-info" /> Origin / burner
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-ok" /> Exchange / VASP
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-warn" /> Bridge
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-danger" /> Mixer / sanctioned
        </li>
      </ul>

      {selected ? (
        <p className="mt-3 font-mono text-xs text-muted">
          {displayAddress(selected, mode)}
          {trace.edges
            .filter((e) => e.from === selected || e.to === selected)
            .slice(0, 4)
            .map((e) => ` · ${e.from === selected ? "out" : "in"} ${usdt(e.amount)}`)
            .join("")}
        </p>
      ) : null}
    </div>
  );
}
