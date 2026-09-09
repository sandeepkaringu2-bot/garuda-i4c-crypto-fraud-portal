import type { GraphEdge, TypologyHit, TypologyId } from "./types";
import { DEFI_ROUTERS, MIXER_CONTRACTS } from "./registry";

export function detectMixerHeuristic(edges: GraphEdge[]): TypologyHit[] {
  const inbound = new Map<string, GraphEdge[]>();
  for (const e of edges) {
    const list = inbound.get(e.to) ?? [];
    list.push(e);
    inbound.set(e.to, list);
  }
  const hits: TypologyHit[] = [];
  for (const [node, list] of inbound) {
    if (list.length < 4) continue;
    const amounts = list.map((x) => x.amount).filter((n) => n > 0);
    if (amounts.length < 4) continue;
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const relVar = amounts.reduce((s, x) => s + (x - avg) ** 2, 0) / amounts.length / Math.max(avg, 1);
    const roundish = amounts.filter((n) => n % 100 === 0 || n % 1 === 0).length / amounts.length;
    if (relVar < 0.04 && roundish > 0.6) {
      hits.push({
        node,
        typology: "Mixer / tumbler deposit pattern",
        confidence: "HIGH (heuristic)",
        description: `${list.length} near-equal inbound lots (avg ${avg.toFixed(0)}) — classic mixer or privacy-pool deposit.`,
        officerNote:
          "Treat as a privacy protocol even if the contract is not yet labelled. Preserve inbound hops; do not chase pool internals.",
      });
    }
  }
  return hits;
}

export function detectKnownContracts(nodes: string[]): {
  mixers: { node: string; label: string }[];
  defi: { node: string; label: string }[];
} {
  const mixers: { node: string; label: string }[] = [];
  const defi: { node: string; label: string }[] = [];
  for (const n of nodes) {
    const key = n.toLowerCase();
    if (MIXER_CONTRACTS[n] || MIXER_CONTRACTS[key]) {
      mixers.push({ node: n, label: MIXER_CONTRACTS[n] ?? MIXER_CONTRACTS[key] });
    }
    if (DEFI_ROUTERS[n] || DEFI_ROUTERS[key]) {
      defi.push({ node: n, label: DEFI_ROUTERS[n] ?? DEFI_ROUTERS[key] });
    }
  }
  return { mixers, defi };
}

export function detectFanOut(edges: GraphEdge[]): TypologyHit[] {
  const out = new Map<string, GraphEdge[]>();
  for (const e of edges) {
    const list = out.get(e.from) ?? [];
    list.push(e);
    out.set(e.from, list);
  }
  const hits: TypologyHit[] = [];
  for (const [node, list] of out) {
    if (list.length >= 5) {
      hits.push({
        node,
        typology: "Rapid fan-out / layering",
        confidence: "MED (78%)",
        description: `${list.length} outbound hops from one wallet — funds being splintered to evade a single freeze.`,
        officerNote: "Issue freeze notices on every custodial leaf of this fan-out in the same hour.",
      });
    }
  }
  return hits;
}

export function classifyTypology(opts: {
  edges: GraphEdge[];
  hasMixer: boolean;
  hasIndianVasp: boolean;
  hasBridge: boolean;
  sourceChain?: string;
  amountUsdt: number;
}): { id: TypologyId; confidence: number; reasons: string[] } {
  const scores: Record<TypologyId, number> = {
    investment_scam: 12,
    sextortion: 8,
    ransomware: 8,
    phishing: 10,
    task_fraud: 8,
    darknet: 6,
  };
  const reasons: string[] = [];

  if (opts.hasIndianVasp && opts.amountUsdt >= 5000) {
    scores.investment_scam += 28;
    reasons.push("Large USDT landed at an Indian VASP — typical pig-butchering / fake trading desk cash-out.");
  }
  if (opts.hasBridge) {
    scores.ransomware += 16;
    scores.investment_scam += 10;
    reasons.push("Cross-chain hop used to change the tracing surface.");
  }
  if (opts.hasMixer) {
    scores.ransomware += 24;
    scores.darknet += 22;
    reasons.push("Mixer interaction is common in ransomware and darknet cash-out.");
  }
  if (opts.sourceChain === "tron" && opts.hasBridge) {
    scores.ransomware += 18;
    reasons.push("TRC-20 USDT then a swap desk is the current ransomware playbook.");
  }
  if (opts.sourceChain === "bitcoin" && opts.hasMixer) {
    scores.darknet += 20;
    reasons.push("Bitcoin + mixer is the classic darknet settlement path.");
  }
  if (opts.amountUsdt > 0 && opts.amountUsdt < 2500 && opts.hasIndianVasp) {
    scores.sextortion += 26;
    scores.phishing += 12;
    reasons.push("Smaller INR-scale USDT to an Indian exchange matches sextortion / one-shot phishing.");
  }
  const peel = opts.edges.filter((e, _, all) => all.filter((x) => x.from === e.from).length >= 3);
  if (peel.length >= 3 && opts.amountUsdt < 4000) {
    scores.task_fraud += 24;
    reasons.push("Many small peels look like task-based / commission-mule payouts.");
  }
  const ranked = (Object.keys(scores) as TypologyId[]).sort((a, b) => scores[b] - scores[a]);
  const top = ranked[0];
  const conf = Math.min(96, 40 + scores[top]);
  return { id: top, confidence: conf, reasons: reasons.slice(0, 4) };
}
