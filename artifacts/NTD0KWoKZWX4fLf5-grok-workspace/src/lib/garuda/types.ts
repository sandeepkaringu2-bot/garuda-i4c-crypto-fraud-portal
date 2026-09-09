export type Chain = "ethereum" | "tron" | "bitcoin" | "base";
export type EntityKind =
  | "burner"
  | "layer"
  | "vasp"
  | "mixer"
  | "bridge"
  | "sanctioned"
  | "unknown"
  | "offramp";

export type TypologyId =
  | "investment_scam"
  | "sextortion"
  | "ransomware"
  | "phishing"
  | "task_fraud"
  | "darknet";

export interface TxHop {
  to: string;
  amount: number;
  token: string;
  txid: string;
  timestamp: string;
  chain: Chain;
}

export interface VaspRecord {
  id: string;
  name: string;
  kind: "vasp" | "mixer" | "bridge";
  jurisdiction: string;
  fiuRegistered: boolean;
  nodal: string;
  contact: string;
  freezeSlaHours: number;
  notes: string;
}

export interface Complaint {
  id: string;
  typology: TypologyId;
  victimWallet: string;
  amountUsdt: number;
  hoursAgo: number;
  state: string;
  brief: string;
}

export interface GraphNode {
  id: string;
  hop: number;
  kind: EntityKind;
  label: string;
  entity?: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  amount: number;
  token: string;
  txid: string;
}

export interface Endpoint {
  wallet: string;
  entity: string;
  kind: EntityKind;
  risk: number;
  hops: number;
  chainHint: string;
  recoverable: boolean;
  amountUsdt: number;
}

export interface TypologyHit {
  node: string;
  typology: string;
  confidence: string;
  description: string;
  officerNote: string;
}

export interface BridgeEvent {
  bridge: string;
  sourceAsset: string;
  amount: number;
  targetNetwork: string;
  targetAsset: string;
  targetRecipient: string;
}

export interface Cluster {
  root: string;
  wallets: string[];
  attributed: string;
}

export interface Correlation {
  wallet: string;
  complaintIds: string[];
  note: string;
}

export interface RecoverySlice {
  label: string;
  usdt: number;
  tone: "ok" | "warn" | "danger" | "muted";
}

export interface Recommendation {
  priority: 1 | 2 | 3;
  title: string;
  detail: string;
  action: "freeze" | "watch" | "escalate" | "preserve";
  vaspId?: string;
}

export interface TraceResult {
  source: string;
  caseId?: string;
  mode: "simulated" | "live";
  nodes: GraphNode[];
  edges: GraphEdge[];
  endpoints: Endpoint[];
  typologies: TypologyHit[];
  bridges: BridgeEvent[];
  clusters: Cluster[];
  correlations: Correlation[];
  recovery: RecoverySlice[];
  recommendations: Recommendation[];
  recoverableUsdt: number;
  atRiskUsdt: number;
  lostUsdt: number;
  maxHop: number;
  ranAt: number;
}

export interface AuditEntry {
  index: number;
  timestamp: number;
  officerId: string;
  target: string;
  summary: string;
  previousHash: string;
  hash: string;
}

export type Lang = "en" | "hi";
export type AddressMode = "label" | "hex";
