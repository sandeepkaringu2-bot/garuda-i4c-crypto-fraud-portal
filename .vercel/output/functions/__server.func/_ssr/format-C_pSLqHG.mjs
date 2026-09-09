//#region node_modules/.nitro/vite/services/ssr/assets/format-C_pSLqHG.js
function inr(usdt) {
	const v = Math.round(usdt * 88);
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0
	}).format(v);
}
function usdt(n) {
	return `${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })} USDT`;
}
function shortAddr(addr, len = 14) {
	if (addr.length <= len) return addr;
	return `${addr.slice(0, Math.ceil((len - 1) / 2))}…${addr.slice(-Math.floor((len - 1) / 2))}`;
}
function fnv(s) {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return (h >>> 0).toString(16).padStart(8, "0");
}
function hexAlias(id) {
	if (/^(0x[a-fA-F0-9]{40}|bc1|[13])/.test(id) && !id.includes("_")) return id;
	return `0x${(fnv(id) + fnv(id + "x") + fnv(id + "y") + fnv(id + "z") + fnv(id + "w")).slice(0, 40)}`;
}
function displayAddress(id, mode) {
	return mode === "hex" ? hexAlias(id) : id;
}
function riskTone(score) {
	if (score >= 70) return "danger";
	if (score >= 30) return "warn";
	return "ok";
}
function slaRemaining(hoursAgo, now = Date.now()) {
	return now - hoursAgo * 3600 * 1e3 + 1728e5 - now;
}
function formatDuration(ms) {
	if (ms <= 0) return "Window closed";
	return `${Math.floor(ms / 36e5)}h ${Math.floor(ms % 36e5 / 6e4)}m`;
}
async function sha256(text) {
	const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
	return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
//#endregion
export { sha256 as a, usdt as c, riskTone as i, formatDuration as n, shortAddr as o, inr as r, slaRemaining as s, displayAddress as t };
