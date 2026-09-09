import { createServerFn } from "@tanstack/react-start";
import type { Chain, TxHop } from "./types";

export type LiveOk = {
  status: "SUCCESS" | "EMPTY" | "ERROR" | "RATE_LIMITED";
  hops: TxHop[];
  ledger: Record<string, TxHop[]>;
  detail?: string;
  chain: Chain;
};

const INDEX = new Map<string, { at: number; hops: TxHop[] }>();
const TTL = 10 * 60 * 1000;

function cacheGet(key: string): TxHop[] | null {
  const hit = INDEX.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > TTL) {
    INDEX.delete(key);
    return null;
  }
  return hit.hops;
}

function cacheSet(key: string, hops: TxHop[]) {
  INDEX.set(key, { at: Date.now(), hops });
  if (INDEX.size > 400) {
    const first = INDEX.keys().next().value;
    if (first) INDEX.delete(first);
  }
}

export function detectChain(address: string): Chain {
  const a = address.trim();
  if (a.startsWith("T") && a.length >= 30 && a.length <= 36) return "tron";
  if (/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{20,}$/.test(a)) return "bitcoin";
  if (a.startsWith("0x") && a.length === 42) return "ethereum";
  return "ethereum";
}

async function hopsBitcoin(address: string): Promise<TxHop[]> {
  const res = await fetch(`https://blockstream.info/api/address/${encodeURIComponent(address)}/txs`, {
    headers: { Accept: "application/json", "User-Agent": "GARUDA-I4C/1.0" },
    signal: AbortSignal.timeout(8000),
  });
  if (res.status === 429) throw Object.assign(new Error("rate"), { code: 429 });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const txs = (await res.json()) as Array<{
    txid: string;
    status?: { block_time?: number };
    vin?: Array<{ prevout?: { scriptpubkey_address?: string } }>;
    vout?: Array<{ scriptpubkey_address?: string; value?: number }>;
  }>;
  const hops: TxHop[] = [];
  for (const tx of txs) {
    const isSender = (tx.vin ?? []).some((v) => v.prevout?.scriptpubkey_address === address);
    if (!isSender) continue;
    for (const vout of tx.vout ?? []) {
      const to = vout.scriptpubkey_address;
      const sat = vout.value ?? 0;
      if (!to || to === address || sat <= 0) continue;
      hops.push({
        to,
        amount: Math.round((sat / 1e8) * 1e8) / 1e8,
        token: "BTC",
        txid: (tx.txid ?? "").slice(0, 18),
        timestamp: tx.status?.block_time ? new Date(tx.status.block_time * 1000).toISOString() : new Date().toISOString(),
        chain: "bitcoin",
      });
      if (hops.length >= 6) return hops;
    }
  }
  return hops;
}

async function hopsEvm(address: string, chain: "ethereum" | "base"): Promise<TxHop[]> {
  const host = chain === "base" ? "https://base.blockscout.com" : "https://eth.blockscout.com";
  const hops: TxHop[] = [];
  const native = await fetch(`${host}/api/v2/addresses/${encodeURIComponent(address)}/transactions`, {
    headers: { Accept: "application/json", "User-Agent": "GARUDA-I4C/1.0" },
    signal: AbortSignal.timeout(8000),
  });
  if (native.ok) {
    const body = (await native.json()) as {
      items?: Array<{
        hash?: string;
        timestamp?: string;
        value?: string;
        from?: { hash?: string };
        to?: { hash?: string };
      }>;
    };
    for (const item of body.items ?? []) {
      const from = item.from?.hash;
      const to = item.to?.hash;
      if (!from || !to) continue;
      if (from.toLowerCase() !== address.toLowerCase()) continue;
      const raw = Number(item.value ?? 0);
      hops.push({
        to,
        amount: raw > 0 ? raw / 1e18 : 0,
        token: chain === "base" ? "ETH" : "ETH",
        txid: (item.hash ?? "").slice(0, 18),
        timestamp: item.timestamp ?? new Date().toISOString(),
        chain,
      });
      if (hops.length >= 6) break;
    }
  }
  if (hops.length < 6) {
    const tok = await fetch(
      `${host}/api/v2/addresses/${encodeURIComponent(address)}/token-transfers?filter=from`,
      {
        headers: { Accept: "application/json", "User-Agent": "GARUDA-I4C/1.0" },
        signal: AbortSignal.timeout(8000),
      },
    );
    if (tok.ok) {
      const body = (await tok.json()) as {
        items?: Array<{
          tx_hash?: string;
          timestamp?: string;
          total?: { value?: string; decimals?: string };
          token?: { symbol?: string; decimals?: string };
          to?: { hash?: string };
          from?: { hash?: string };
        }>;
      };
      for (const item of body.items ?? []) {
        const to = item.to?.hash;
        if (!to) continue;
        const dec = Number(item.total?.decimals ?? item.token?.decimals ?? 18);
        const raw = Number(item.total?.value ?? 0);
        hops.push({
          to,
          amount: dec >= 0 && Number.isFinite(raw) ? raw / 10 ** Math.min(dec, 18) : 0,
          token: item.token?.symbol ?? "TOKEN",
          txid: (item.tx_hash ?? "").slice(0, 18),
          timestamp: item.timestamp ?? new Date().toISOString(),
          chain,
        });
        if (hops.length >= 8) break;
      }
    }
  }
  return hops.slice(0, 8);
}

async function hopsTron(address: string): Promise<TxHop[]> {
  const res = await fetch(
    `https://api.trongrid.io/v1/accounts/${encodeURIComponent(address)}/transactions/trc20?limit=20&only_from=true`,
    {
      headers: { Accept: "application/json", "User-Agent": "GARUDA-I4C/1.0" },
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = (await res.json()) as {
    data?: Array<{
      transaction_id?: string;
      block_timestamp?: number;
      to?: string;
      value?: string;
      token_info?: { symbol?: string; decimals?: number };
    }>;
  };
  const hops: TxHop[] = [];
  for (const item of body.data ?? []) {
    const to = item.to;
    if (!to || to === address) continue;
    const dec = item.token_info?.decimals ?? 6;
    const raw = Number(item.value ?? 0);
    hops.push({
      to,
      amount: Number.isFinite(raw) ? raw / 10 ** dec : 0,
      token: item.token_info?.symbol ?? "TRC20",
      txid: (item.transaction_id ?? "").slice(0, 18),
      timestamp: item.block_timestamp ? new Date(item.block_timestamp).toISOString() : new Date().toISOString(),
      chain: "tron",
    });
    if (hops.length >= 6) break;
  }
  return hops;
}

async function hopsFor(address: string, chain: Chain): Promise<TxHop[]> {
  const key = `${chain}:${address.toLowerCase()}`;
  const cached = cacheGet(key);
  if (cached) return cached;
  let hops: TxHop[] = [];
  if (chain === "bitcoin") hops = await hopsBitcoin(address);
  else if (chain === "tron") hops = await hopsTron(address);
  else hops = await hopsEvm(address, chain === "base" ? "base" : "ethereum");
  cacheSet(key, hops);
  return hops;
}

export const fetchLiveHops = createServerFn({ method: "POST" })
  .validator((data: { address: string; chain: Chain; walk?: boolean }) => data)
  .handler(async ({ data }): Promise<LiveOk> => {
    const address = data.address.trim();
    const chain = data.chain;
    if (!address) return { status: "ERROR", hops: [], ledger: {}, detail: "Empty address", chain };
    try {
      const hops = await hopsFor(address, chain);
      const ledger: Record<string, TxHop[]> = hops.length ? { [address]: hops } : {};
      if (data.walk && hops.length) {
        const seen = new Set([address.toLowerCase()]);
        const queue = hops.map((h) => h.to).slice(0, 4);
        let depth = 0;
        while (queue.length && depth < 2) {
          const next = queue.shift()!;
          if (seen.has(next.toLowerCase())) continue;
          seen.add(next.toLowerCase());
          try {
            const child = await hopsFor(next, detectChain(next) === "bitcoin" ? "bitcoin" : chain);
            if (child.length) {
              ledger[next] = child;
              for (const c of child.slice(0, 2)) queue.push(c.to);
            }
          } catch {
            /* skip a dead child, keep walking */
          }
          depth += 1;
        }
      }
      return {
        status: hops.length ? "SUCCESS" : "EMPTY",
        hops,
        ledger,
        chain,
        detail: hops.length ? undefined : "No outbound hops in the public indexer window",
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "network";
      if (msg === "rate" || (e as { code?: number }).code === 429) {
        return { status: "RATE_LIMITED", hops: [], ledger: {}, chain };
      }
      return { status: "ERROR", hops: [], ledger: {}, detail: msg, chain };
    }
  });

export const indexStats = createServerFn({ method: "GET" }).handler(async () => {
  return { cachedAddresses: INDEX.size, ttlMinutes: TTL / 60000 };
});
