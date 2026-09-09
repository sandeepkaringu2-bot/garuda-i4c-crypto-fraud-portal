import type { Endpoint, GraphEdge, GraphNode } from "./types";

/** Rule-weighted logistic-style score. Not a trained neural net — a transparent feature model officers can explain in court. */
export function featureRisk(opts: {
  id: string;
  hop: number;
  kind: string;
  edges: GraphEdge[];
  nodes: GraphNode[];
  sanctioned: boolean;
  mixer: boolean;
  indianVasp: boolean;
  foreignVasp: boolean;
  bridge: boolean;
}): number {
  const outDeg = opts.edges.filter((e) => e.from === opts.id).length;
  const inDeg = opts.edges.filter((e) => e.to === opts.id).length;
  const z: number[] = [
    1,
    opts.sanctioned ? 1 : 0,
    opts.mixer ? 1 : 0,
    opts.bridge ? 1 : 0,
    opts.indianVasp ? 1 : 0,
    opts.foreignVasp ? 1 : 0,
    Math.min(opts.hop, 6) / 6,
    Math.min(outDeg, 8) / 8,
    Math.min(inDeg, 8) / 8,
  ];
  // weights chosen so mixer/sanctions saturate, Indian VASP is high-priority but freezeable (not “lost”)
  const w = [18, 55, 50, 12, -8, 8, -10, 14, 6];
  const raw = z.reduce((s, v, i) => s + v * w[i], 0);
  const sigmoid = 1 / (1 + Math.exp(-raw / 28));
  let score = Math.round(sigmoid * 100);
  if (opts.sanctioned || opts.mixer) score = 100;
  if (opts.indianVasp) score = Math.max(score, 36);
  return Math.max(4, Math.min(100, score));
}

export function explainRisk(e: Endpoint): string[] {
  const bits: string[] = [];
  if (e.risk >= 90) bits.push("Near-certain illicit sink (mixer, sanction, or both).");
  if (e.kind === "vasp" && e.recoverable) bits.push("Custodial Indian VASP — freezeable without MLAT.");
  if (e.kind === "vasp" && !e.recoverable) bits.push("Foreign VASP — LEA portal / MLAT, still worth an immediate request.");
  if (e.hops <= 2) bits.push("Short hop distance: funds have not had time to fully layer.");
  if (e.hops >= 4) bits.push("Deep layering: operator is trying to outrun the 48-hour freeze window.");
  return bits;
}
