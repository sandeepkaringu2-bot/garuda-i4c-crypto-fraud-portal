import type { AddressMode, EntityKind } from "./types";

export const USDT_INR = 88;

export function inr(usdt: number): string {
  const v = Math.round(usdt * USDT_INR);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(v);
}

export function usdt(n: number): string {
  return `${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })} USDT`;
}

export function shortAddr(addr: string, len = 14): string {
  if (addr.length <= len) return addr;
  return `${addr.slice(0, Math.ceil((len - 1) / 2))}…${addr.slice(-Math.floor((len - 1) / 2))}`;
}

function fnv(s: string): string {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

export function hexAlias(id: string): string {
  if (/^(0x[a-fA-F0-9]{40}|bc1|[13])/.test(id) && !id.includes("_")) return id;
  const packed = fnv(id) + fnv(id + "x") + fnv(id + "y") + fnv(id + "z") + fnv(id + "w");
  return `0x${packed.slice(0, 40)}`;
}

export function displayAddress(id: string, mode: AddressMode): string {
  return mode === "hex" ? hexAlias(id) : id;
}

export function riskTone(score: number): "danger" | "warn" | "ok" {
  if (score >= 70) return "danger";
  if (score >= 30) return "warn";
  return "ok";
}

export function kindLabel(kind: EntityKind): string {
  switch (kind) {
    case "vasp":
      return "Exchange / VASP";
    case "mixer":
      return "Mixer";
    case "bridge":
      return "Cross-chain bridge";
    case "sanctioned":
      return "Sanctioned";
    case "offramp":
      return "Fiat offramp";
    case "burner":
      return "Burner / collection";
    case "layer":
      return "Layering wallet";
    default:
      return "Unknown wallet";
  }
}

export function slaRemaining(hoursAgo: number, now = Date.now()): number {
  const reported = now - hoursAgo * 3600 * 1000;
  const deadline = reported + 48 * 3600 * 1000;
  return deadline - now;
}

export function formatDuration(ms: number): string {
  if (ms <= 0) return "Window closed";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
}

export async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
