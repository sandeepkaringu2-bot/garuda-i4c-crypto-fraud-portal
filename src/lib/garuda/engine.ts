import {
  BRIDGE_EVENTS,
  BRIDGES,
  COMPLAINTS,
  CO_SPEND,
  ENTITY_LABELS,
  KNOWN_VASPS,
  LEDGER,
  MAX_HOPS,
  MIXER_CONTRACTS,
  DEFI_ROUTERS,
  SANCTIONS,
} from "./registry";
import { classifyTypology, detectFanOut, detectKnownContracts, detectMixerHeuristic } from "./patterns";
import { featureRisk } from "./ml-risk";
import type {
  BridgeEvent,
  Cluster,
  Correlation,
  Endpoint,
  EntityKind,
  GraphEdge,
  GraphNode,
  Recommendation,
  RecoverySlice,
  TraceResult,
  TxHop,
  TypologyHit,
} from "./types";

function mixerLabel(id: string): string | undefined {
  return MIXER_CONTRACTS[id] ?? MIXER_CONTRACTS[id.toLowerCase()];
}

function defiLabel(id: string): string | undefined {
  return DEFI_ROUTERS[id] ?? DEFI_ROUTERS[id.toLowerCase()];
}

function labelOf(id: string): string {
  if (KNOWN_VASPS[id]) return KNOWN_VASPS[id].name;
  if (mixerLabel(id)) return mixerLabel(id)!;
  if (defiLabel(id)) return defiLabel(id)!;
  return ENTITY_LABELS[id] ?? id;
}

function kindOf(id: string, hop: number): EntityKind {
  const s = SANCTIONS[id];
  if (s?.terminal) return "mixer";
  if (mixerLabel(id)) return "mixer";
  if (s) return "sanctioned";
  const v = KNOWN_VASPS[id];
  if (v?.kind === "vasp") return hop === 0 ? "burner" : "vasp";
  if (v?.kind === "mixer") return "mixer";
  if (v?.kind === "bridge" || BRIDGES[id]) return "bridge";
  if (defiLabel(id)) return "layer";
  if (hop === 0) return "burner";
  if (LEDGER[id]) return "layer";
  return "unknown";
}

function inboundAmount(edges: GraphEdge[], wallet: string): number {
  return edges.filter((e) => e.to === wallet).reduce((s, e) => s + e.amount, 0);
}

function scoreWallet(
  id: string,
  hop: number,
  edges: GraphEdge[],
  nodes: GraphNode[],
): number {
  const v = KNOWN_VASPS[id];
  const s = SANCTIONS[id];
  return featureRisk({
    id,
    hop,
    kind: kindOf(id, hop),
    edges,
    nodes,
    sanctioned: Boolean(s),
    mixer: Boolean(s?.terminal || mixerLabel(id) || v?.kind === "mixer"),
    indianVasp: Boolean(v?.kind === "vasp" && v.jurisdiction === "India"),
    foreignVasp: Boolean(v?.kind === "vasp" && v.jurisdiction !== "India"),
    bridge: Boolean(BRIDGES[id] || v?.kind === "bridge"),
  });
}

function analyzeTypology(edges: GraphEdge[]): TypologyHit[] {
  const out = new Map<string, GraphEdge[]>();
  for (const e of edges) {
    const list = out.get(e.from) ?? [];
    list.push(e);
    out.set(e.from, list);
  }
  const hits: TypologyHit[] = [];
  for (const [node, list] of out) {
    if (list.length < 2) continue;
    const amounts = list.map((x) => x.amount);
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance = amounts.reduce((s, x) => s + (x - avg) ** 2, 0) / amounts.length;
    if (variance < 5000 && avg > 1000) {
      hits.push({
        node,
        typology: "Automated peeling chain",
        confidence: "HIGH (92%)",
        description: `Split ~${avg.toFixed(0)} USDT across ${list.length} paths from the same wallet.`,
        officerNote:
          "Peeling is a laundering pattern, not a coincidence. The operator is trying to look like many small payments. Freeze every VASP that received a peel — they are the same case.",
      });
    }
  }
  if (edges.some((e) => e.to in SANCTIONS || KNOWN_VASPS[e.to]?.kind === "mixer" || mixerLabel(e.to))) {
    const node = edges.find((e) => SANCTIONS[e.to] || KNOWN_VASPS[e.to]?.kind === "mixer" || mixerLabel(e.to))!.to;
    hits.push({
      node,
      typology: "Mixer interaction",
      confidence: "HIGH (100%)",
      description: "Funds entered a privacy mixer / sanctioned router.",
      officerNote:
        "Treat mixer-bound funds as gone for victim payout. The usable case is everything that landed at an exchange BEFORE the mix.",
    });
  }
  if (edges.some((e) => e.to in BRIDGES)) {
    hits.push({
      node: edges.find((e) => e.to in BRIDGES)!.to,
      typology: "Cross-chain hop",
      confidence: "HIGH (88%)",
      description: "Assets left the origin chain through a swap/bridge router.",
      officerNote:
        "Do not stop at the bridge. The freezeable endpoint is the destination-chain recipient — often an Indian VASP offramp.",
    });
  }
  hits.push(...detectMixerHeuristic(edges), ...detectFanOut(edges));
  return hits;
}

function clustersFrom(wallets: string[]): Cluster[] {
  const parent: Record<string, string> = {};
  const find = (w: string): string => {
    if (!(w in parent)) parent[w] = w;
    if (parent[w] !== w) parent[w] = find(parent[w]);
    return parent[w];
  };
  const union = (a: string, b: string) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  };
  for (const tx of CO_SPEND) {
    if (tx.inputs.length > 1) {
      for (let i = 1; i < tx.inputs.length; i++) union(tx.inputs[0], tx.inputs[i]);
    }
  }
  const groups = new Map<string, string[]>();
  for (const w of wallets) {
    const r = find(w);
    const list = groups.get(r) ?? [];
    list.push(w);
    groups.set(r, list);
  }
  const out: Cluster[] = [];
  for (const [root, list] of groups) {
    if (list.length < 2) continue;
    let attributed = "Unknown private cluster";
    for (const w of list) {
      if (KNOWN_VASPS[w]) {
        attributed = `Attributed: ${KNOWN_VASPS[w].name}`;
        break;
      }
    }
    if (attributed === "Unknown private cluster") {
      attributed = "Likely same operator (co-spent inputs)";
    }
    out.push({ root, wallets: list, attributed });
  }
  return out;
}

function correlate(wallets: Set<string>, currentCase?: string): Correlation[] {
  const hits: Correlation[] = [];
  for (const w of wallets) {
    const ids: string[] = [];
    for (const c of COMPLAINTS) {
      if (c.id === currentCase) continue;
      const reach = reachable(c.victimWallet);
      if (reach.has(w) || c.victimWallet === w) ids.push(c.id);
    }
    if (ids.length > 0) {
      hits.push({
        wallet: w,
        complaintIds: ids,
        note:
          ids.length >= 2
            ? "Same wallet touches multiple NCRP complaints — treat as organised cybercrime, not a lone mule."
            : `Also present in ${ids[0]}. Shared infrastructure.`,
      });
    }
  }
  return hits.sort((a, b) => b.complaintIds.length - a.complaintIds.length);
}

function reachable(source: string, extra: Record<string, TxHop[]> = {}): Set<string> {
  const seen = new Set<string>();
  const stack = [source];
  while (stack.length) {
    const w = stack.pop()!;
    if (seen.has(w)) continue;
    seen.add(w);
    const hops = extra[w] ?? LEDGER[w] ?? [];
    for (const h of hops) stack.push(h.to);
    if (BRIDGES[w] && BRIDGE_EVENTS[w]) stack.push(BRIDGE_EVENTS[w].targetRecipient);
  }
  return seen;
}

function recommend(endpoints: Endpoint[], correlations: Correlation[]): Recommendation[] {
  const recs: Recommendation[] = [];
  const indian = endpoints
    .filter((e) => e.recoverable && e.kind === "vasp")
    .sort((a, b) => b.amountUsdt - a.amountUsdt);
  if (indian[0]) {
    const v = KNOWN_VASPS[indian[0].wallet];
    recs.push({
      priority: 1,
      title: `Freeze ${indian[0].entity} now`,
      detail: v
        ? `Highest-leverage Indian VASP in this graph. ${indian[0].amountUsdt.toLocaleString("en-IN")} USDT landed here. Notice goes to ${v.contact}. Typical freeze SLA ${v.freezeSlaHours}h.`
        : "Issue a SAHYOG freeze against this Indian VASP deposit cluster.",
      action: "freeze",
      vaspId: indian[0].wallet,
    });
  }
  const others = indian.slice(1);
  if (others.length) {
    recs.push({
      priority: 2,
      title: `Parallel freeze on ${others.length} more VASP${others.length > 1 ? "s" : ""}`,
      detail: others.map((e) => `${e.entity} (${e.amountUsdt} USDT)`).join(" · "),
      action: "freeze",
      vaspId: others[0].wallet,
    });
  }
  if (endpoints.some((e) => e.kind === "mixer" || e.kind === "sanctioned")) {
    recs.push({
      priority: 2,
      title: "Preserve pre-mixer hops as evidence",
      detail:
        "Do not chase funds inside the mixer. Export the graph, hashes, and timestamps of every hop before the mix. That is the court-usable trail.",
      action: "preserve",
    });
  }
  if (correlations.some((c) => c.complaintIds.length >= 1)) {
    recs.push({
      priority: 3,
      title: "Escalate as organised cybercrime",
      detail:
        "The same wallets appear in more than one NCRP complaint. Move this off a single-IO desk — I4C organised-crime coordination, common freeze, common Section 91.",
      action: "escalate",
    });
  }
  if (!recs.length) {
    recs.push({
      priority: 2,
      title: "Watch the leaf wallets",
      detail: "No custodial sink found within hop budget. Keep the addresses on watchlist and re-trace in 6 hours.",
      action: "watch",
    });
  }
  return recs.slice(0, 4);
}

export function runTrace(
  source: string,
  opts?: { caseId?: string; extraLedger?: Record<string, TxHop[]>; mode?: "simulated" | "live" },
): TraceResult {
  const ledger: Record<string, TxHop[]> = { ...LEDGER, ...(opts?.extraLedger ?? {}) };
  const visited = new Set<string>();
  const nodes = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];
  const endpoints: Endpoint[] = [];
  const bridges: BridgeEvent[] = [];

  const addNode = (id: string, hop: number) => {
    if (!nodes.has(id)) {
      nodes.set(id, {
        id,
        hop,
        kind: kindOf(id, hop),
        label: labelOf(id),
        entity: KNOWN_VASPS[id]?.name,
      });
    }
  };

  const walk = (wallet: string, hop: number) => {
    if (hop > MAX_HOPS) return;
    if (visited.has(wallet)) return;
    visited.add(wallet);
    addNode(wallet, hop);

    const threat = SANCTIONS[wallet];
    const vasp = KNOWN_VASPS[wallet];
    const mix = mixerLabel(wallet);

    if (threat) {
      const amt = inboundAmount(edges, wallet);
      endpoints.push({
        wallet,
        entity: `Matched: ${threat.source}`,
        kind: threat.terminal ? "mixer" : "sanctioned",
        risk: 100,
        hops: hop,
        chainHint: threat.reason,
        recoverable: false,
        amountUsdt: amt,
      });
      if (threat.terminal) return;
    }

    if (mix && !threat) {
      endpoints.push({
        wallet,
        entity: mix,
        kind: "mixer",
        risk: 100,
        hops: hop,
        chainHint: "Known privacy protocol / mixer contract",
        recoverable: false,
        amountUsdt: inboundAmount(edges, wallet),
      });
      return;
    }

    if (wallet in BRIDGES) {
      const ev = BRIDGE_EVENTS[wallet];
      if (ev) {
        bridges.push(ev);
        edges.push({
          from: wallet,
          to: ev.targetRecipient,
          amount: ev.amount,
          token: ev.sourceAsset,
          txid: "bridge-event",
        });
        addNode(wallet, hop);
        walk(ev.targetRecipient, hop + 1);
        return;
      }
    }

    if (vasp && vasp.kind === "vasp") {
      endpoints.push({
        wallet,
        entity: vasp.name,
        kind: hop === 0 ? "burner" : "vasp",
        risk: scoreWallet(wallet, hop, edges, [...nodes.values()]),
        hops: hop,
        chainHint: `${vasp.jurisdiction} · ${vasp.fiuRegistered ? "FIU-IND registered" : "Foreign VASP"}`,
        recoverable: vasp.jurisdiction === "India",
        amountUsdt: inboundAmount(edges, wallet),
      });
      return;
    }

    const hops = ledger[wallet];
    if (hops?.length) {
      for (const tx of hops) {
        edges.push({
          from: wallet,
          to: tx.to,
          amount: tx.amount,
          token: tx.token,
          txid: tx.txid,
        });
        addNode(tx.to, hop + 1);
        walk(tx.to, hop + 1);
      }
    } else if (!threat && !(vasp && vasp.kind === "vasp") && !mix) {
      endpoints.push({
        wallet,
        entity: defiLabel(wallet) ?? "Unknown non-custodial wallet",
        kind: defiLabel(wallet) ? "layer" : "unknown",
        risk: scoreWallet(wallet, hop, edges, [...nodes.values()]),
        hops: hop,
        chainHint: defiLabel(wallet)
          ? `DeFi protocol: ${defiLabel(wallet)}`
          : "No further public hops in the indexed ledger",
        recoverable: false,
        amountUsdt: inboundAmount(edges, wallet),
      });
    }
  };

  walk(source.trim() || "0xSuspect_Burner_Wallet_A", 0);

  for (const e of endpoints) {
    e.amountUsdt = inboundAmount(edges, e.wallet);
    e.risk = scoreWallet(e.wallet, e.hops, edges, [...nodes.values()]);
    if (e.kind === "mixer" || e.kind === "sanctioned") e.risk = 100;
  }

  const nodeList = [...nodes.values()].sort((a, b) => a.hop - b.hop || a.id.localeCompare(b.id));
  const cl = clustersFrom(nodeList.map((n) => n.id).concat(endpoints.map((e) => e.wallet)));
  const typologies = analyzeTypology(edges);
  const correlations = correlate(new Set(nodeList.map((n) => n.id)), opts?.caseId);
  const known = detectKnownContracts(nodeList.map((n) => n.id));
  const contractHits = [
    ...known.mixers.map((m) => ({ ...m, kind: "mixer" as const })),
    ...known.defi.map((m) => ({ ...m, kind: "defi" as const })),
  ];

  const recUsdt = endpoints.filter((e) => e.recoverable).reduce((s, e) => s + e.amountUsdt, 0);
  const lostUsdt = endpoints
    .filter((e) => e.kind === "mixer" || e.kind === "sanctioned")
    .reduce((s, e) => s + e.amountUsdt, 0);
  const atRisk = endpoints
    .filter((e) => !e.recoverable && e.kind !== "mixer" && e.kind !== "sanctioned")
    .reduce((s, e) => s + e.amountUsdt, 0);

  const recovery: RecoverySlice[] = [
    { label: "Recoverable at Indian VASPs", usdt: recUsdt, tone: "ok" },
    { label: "At-risk (foreign / unknown)", usdt: atRisk, tone: "warn" },
    { label: "Likely lost (mixer / sanctioned)", usdt: lostUsdt, tone: "danger" },
  ];

  const firstHop = ledger[source.trim()]?.[0]?.chain;
  const classified = classifyTypology({
    edges,
    hasMixer: endpoints.some((e) => e.kind === "mixer") || typologies.some((t) => t.typology.includes("Mixer")),
    hasIndianVasp: endpoints.some((e) => e.recoverable),
    hasBridge: bridges.length > 0,
    sourceChain: firstHop,
    amountUsdt: recUsdt + atRisk + lostUsdt,
  });

  const recommendations = recommend(endpoints, correlations);
  const maxHop = nodeList.reduce((m, n) => Math.max(m, n.hop), 0);

  return {
    source: source.trim() || "0xSuspect_Burner_Wallet_A",
    caseId: opts?.caseId,
    mode: opts?.mode ?? "simulated",
    nodes: nodeList,
    edges,
    endpoints: [...endpoints].sort((a, b) => b.risk - a.risk || b.amountUsdt - a.amountUsdt),
    typologies,
    classified,
    contractHits,
    bridges,
    clusters: cl,
    correlations,
    recovery,
    recommendations,
    recoverableUsdt: recUsdt,
    atRiskUsdt: atRisk,
    lostUsdt,
    maxHop,
    ranAt: Date.now(),
  };
}

export function sahyogPayload(endpoint: Endpoint, complaintId: string, officerId: string) {
  const v = KNOWN_VASPS[endpoint.wallet];
  return {
    request_type: "ASSET_FREEZE",
    channel: "SAHYOG",
    act: ["CrPC_S91", "PMLA_S17", "IT_ACT_2000_EVIDENCE"],
    urgency: "P1",
    complaint_id: complaintId,
    requesting_officer: officerId,
    vasp_name: endpoint.entity,
    vasp_wallet: endpoint.wallet,
    jurisdiction: v?.jurisdiction ?? "Unknown",
    estimated_value_usdt: endpoint.amountUsdt,
    freeze_window_hours: 72,
    preserve: ["KYC", "login_ip", "device_fingerprint", "linked_inr_accounts", "internal_transfer_logs"],
  };
}
