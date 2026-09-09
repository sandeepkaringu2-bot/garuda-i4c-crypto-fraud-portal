import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/live-BgCs5gC_.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function detectChain(address) {
	const a = address.trim();
	if (a.startsWith("T") && a.length >= 30 && a.length <= 36) return "tron";
	if (/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{20,}$/.test(a)) return "bitcoin";
	if (a.startsWith("0x") && a.length === 42) return "ethereum";
	return "ethereum";
}
var fetchLiveHops = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("062ba59eb4d54b021590c220bb1fec5bb960f1950a8405582fd1e763ae1fed4e"));
var indexStats = createServerFn({ method: "GET" }).handler(createSsrRpc("70db7409b4db2ee69f5d5610f299382fdf8da5ca6969092c22ddc06e5976e51f"));
//#endregion
export { indexStats as i, detectChain as n, fetchLiveHops as r, createSsrRpc as t };
