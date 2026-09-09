import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/live-B-bu6FFZ.js
var INDEX = /* @__PURE__ */ new Map();
var TTL = 6e5;
function cacheGet(key) {
	const hit = INDEX.get(key);
	if (!hit) return null;
	if (Date.now() - hit.at > TTL) {
		INDEX.delete(key);
		return null;
	}
	return hit.hops;
}
function cacheSet(key, hops) {
	INDEX.set(key, {
		at: Date.now(),
		hops
	});
	if (INDEX.size > 400) {
		const first = INDEX.keys().next().value;
		if (first) INDEX.delete(first);
	}
}
function detectChain(address) {
	const a = address.trim();
	if (a.startsWith("T") && a.length >= 30 && a.length <= 36) return "tron";
	if (/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{20,}$/.test(a)) return "bitcoin";
	if (a.startsWith("0x") && a.length === 42) return "ethereum";
	return "ethereum";
}
async function hopsBitcoin(address) {
	const res = await fetch(`https://blockstream.info/api/address/${encodeURIComponent(address)}/txs`, {
		headers: {
			Accept: "application/json",
			"User-Agent": "GARUDA-I4C/1.0"
		},
		signal: AbortSignal.timeout(8e3)
	});
	if (res.status === 429) throw Object.assign(/* @__PURE__ */ new Error("rate"), { code: 429 });
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	const txs = await res.json();
	const hops = [];
	for (const tx of txs) {
		if (!(tx.vin ?? []).some((v) => v.prevout?.scriptpubkey_address === address)) continue;
		for (const vout of tx.vout ?? []) {
			const to = vout.scriptpubkey_address;
			const sat = vout.value ?? 0;
			if (!to || to === address || sat <= 0) continue;
			hops.push({
				to,
				amount: Math.round(sat / 1e8 * 1e8) / 1e8,
				token: "BTC",
				txid: (tx.txid ?? "").slice(0, 18),
				timestamp: tx.status?.block_time ? (/* @__PURE__ */ new Date(tx.status.block_time * 1e3)).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
				chain: "bitcoin"
			});
			if (hops.length >= 6) return hops;
		}
	}
	return hops;
}
async function hopsEvm(address, chain) {
	const host = chain === "base" ? "https://base.blockscout.com" : "https://eth.blockscout.com";
	const hops = [];
	const native = await fetch(`${host}/api/v2/addresses/${encodeURIComponent(address)}/transactions`, {
		headers: {
			Accept: "application/json",
			"User-Agent": "GARUDA-I4C/1.0"
		},
		signal: AbortSignal.timeout(8e3)
	});
	if (native.ok) {
		const body = await native.json();
		for (const item of body.items ?? []) {
			const from = item.from?.hash;
			const to = item.to?.hash;
			if (!from || !to) continue;
			if (from.toLowerCase() !== address.toLowerCase()) continue;
			const raw = Number(item.value ?? 0);
			hops.push({
				to,
				amount: raw > 0 ? raw / 0xde0b6b3a7640000 : 0,
				token: chain === "base" ? "ETH" : "ETH",
				txid: (item.hash ?? "").slice(0, 18),
				timestamp: item.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
				chain
			});
			if (hops.length >= 6) break;
		}
	}
	if (hops.length < 6) {
		const tok = await fetch(`${host}/api/v2/addresses/${encodeURIComponent(address)}/token-transfers?filter=from`, {
			headers: {
				Accept: "application/json",
				"User-Agent": "GARUDA-I4C/1.0"
			},
			signal: AbortSignal.timeout(8e3)
		});
		if (tok.ok) {
			const body = await tok.json();
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
					timestamp: item.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
					chain
				});
				if (hops.length >= 8) break;
			}
		}
	}
	return hops.slice(0, 8);
}
async function hopsTron(address) {
	const res = await fetch(`https://api.trongrid.io/v1/accounts/${encodeURIComponent(address)}/transactions/trc20?limit=20&only_from=true`, {
		headers: {
			Accept: "application/json",
			"User-Agent": "GARUDA-I4C/1.0"
		},
		signal: AbortSignal.timeout(8e3)
	});
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	const body = await res.json();
	const hops = [];
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
			timestamp: item.block_timestamp ? new Date(item.block_timestamp).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
			chain: "tron"
		});
		if (hops.length >= 6) break;
	}
	return hops;
}
async function hopsFor(address, chain) {
	const key = `${chain}:${address.toLowerCase()}`;
	const cached = cacheGet(key);
	if (cached) return cached;
	let hops = [];
	if (chain === "bitcoin") hops = await hopsBitcoin(address);
	else if (chain === "tron") hops = await hopsTron(address);
	else hops = await hopsEvm(address, chain === "base" ? "base" : "ethereum");
	cacheSet(key, hops);
	return hops;
}
var fetchLiveHops_createServerFn_handler = createServerRpc({
	id: "062ba59eb4d54b021590c220bb1fec5bb960f1950a8405582fd1e763ae1fed4e",
	name: "fetchLiveHops",
	filename: "src/lib/garuda/live.ts"
}, (opts) => fetchLiveHops.__executeServer(opts));
var fetchLiveHops = createServerFn({ method: "POST" }).validator((data) => data).handler(fetchLiveHops_createServerFn_handler, async ({ data }) => {
	const address = data.address.trim();
	const chain = data.chain;
	if (!address) return {
		status: "ERROR",
		hops: [],
		ledger: {},
		detail: "Empty address",
		chain
	};
	try {
		const hops = await hopsFor(address, chain);
		const ledger = hops.length ? { [address]: hops } : {};
		if (data.walk && hops.length) {
			const seen = /* @__PURE__ */ new Set([address.toLowerCase()]);
			const queue = hops.map((h) => h.to).slice(0, 4);
			let depth = 0;
			while (queue.length && depth < 2) {
				const next = queue.shift();
				if (seen.has(next.toLowerCase())) continue;
				seen.add(next.toLowerCase());
				try {
					const child = await hopsFor(next, detectChain(next) === "bitcoin" ? "bitcoin" : chain);
					if (child.length) {
						ledger[next] = child;
						for (const c of child.slice(0, 2)) queue.push(c.to);
					}
				} catch {}
				depth += 1;
			}
		}
		return {
			status: hops.length ? "SUCCESS" : "EMPTY",
			hops,
			ledger,
			chain,
			detail: hops.length ? void 0 : "No outbound hops in the public indexer window"
		};
	} catch (e) {
		const msg = e instanceof Error ? e.message : "network";
		if (msg === "rate" || e.code === 429) return {
			status: "RATE_LIMITED",
			hops: [],
			ledger: {},
			chain
		};
		return {
			status: "ERROR",
			hops: [],
			ledger: {},
			detail: msg,
			chain
		};
	}
});
var indexStats_createServerFn_handler = createServerRpc({
	id: "70db7409b4db2ee69f5d5610f299382fdf8da5ca6969092c22ddc06e5976e51f",
	name: "indexStats",
	filename: "src/lib/garuda/live.ts"
}, (opts) => indexStats.__executeServer(opts));
var indexStats = createServerFn({ method: "GET" }).handler(indexStats_createServerFn_handler, async () => {
	return {
		cachedAddresses: INDEX.size,
		ttlMinutes: TTL / 6e4
	};
});
//#endregion
export { fetchLiveHops_createServerFn_handler, indexStats_createServerFn_handler };
