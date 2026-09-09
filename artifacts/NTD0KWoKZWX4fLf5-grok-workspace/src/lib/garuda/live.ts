import { createServerFn } from "@tanstack/react-start";
import type { TxHop, Chain } from "./types";

type LiveOk = { status: "SUCCESS" | "EMPTY" | "ERROR" | "RATE_LIMITED"; hops: TxHop[]; detail?: string };

export const fetchLiveHops = createServerFn({ method: "POST" })
  .validator((data: { address: string; chain: "ethereum" | "bitcoin" | "base" }) => data)
  .handler(async ({ data }): Promise<LiveOk> => {
    const address = data.address.trim();
    if (!address) return { status: "ERROR", hops: [], detail: "Empty address" };

    try {
      if (data.chain === "bitcoin") {
        const res = await fetch(`https://blockstream.info/api/address/${encodeURIComponent(address)}/txs`, {
          headers: { Accept: "application/json", "User-Agent": "GARUDA-I4C/1.0" },
          signal: AbortSignal.timeout(8000),
        });
        if (res.status === 429) return { status: "RATE_LIMITED", hops: [] };
        if (!res.ok) return { status: "ERROR", hops: [], detail: `HTTP ${res.status}` };
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
              txid: (tx.txid ?? "").slice(0, 16),
              timestamp: tx.status?.block_time
                ? new Date(tx.status.block_time * 1000).toISOString()
                : new Date().toISOString(),
              chain: "bitcoin",
            });
            if (hops.length >= 6) break;
          }
          if (hops.length >= 6) break;
        }
        return { status: hops.length ? "SUCCESS" : "EMPTY", hops };
      }

      const host = data.chain === "base" ? "https://base.blockscout.com" : "https://eth.blockscout.com";
      const res = await fetch(
        `${host}/api/v2/addresses/${encodeURIComponent(address)}/transactions`,
        {
          headers: { Accept: "application/json", "User-Agent": "GARUDA-I4C/1.0" },
          signal: AbortSignal.timeout(8000),
        },
      );
      if (!res.ok) return { status: "ERROR", hops: [], detail: `HTTP ${res.status}` };
      const body = (await res.json()) as {
        items?: Array<{
          hash?: string;
          timestamp?: string;
          value?: string;
          from?: { hash?: string };
          to?: { hash?: string };
        }>;
      };
      const hops: TxHop[] = [];
      const chain: Chain = data.chain === "base" ? "base" : "ethereum";
      for (const item of body.items ?? []) {
        const from = item.from?.hash;
        const to = item.to?.hash;
        if (!from || !to) continue;
        if (from.toLowerCase() !== address.toLowerCase()) continue;
        const raw = Number(item.value ?? 0);
        hops.push({
          to,
          amount: raw > 0 ? raw / 1e18 : 0,
          token: "ETH",
          txid: (item.hash ?? "").slice(0, 16),
          timestamp: item.timestamp ?? new Date().toISOString(),
          chain,
        });
        if (hops.length >= 6) break;
      }
      return { status: hops.length ? "SUCCESS" : "EMPTY", hops };
    } catch (e) {
      return { status: "ERROR", hops: [], detail: e instanceof Error ? e.message : "network" };
    }
  });
