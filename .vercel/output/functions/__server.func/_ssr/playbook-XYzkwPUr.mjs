import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as useGaruda, r as t } from "./router-DGygSGFZ.mjs";
import { t as Card } from "./card-zDnq8gsv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/playbook-XYzkwPUr.js
var import_jsx_runtime = require_jsx_runtime();
var CHAPTERS = [
	{
		title: "The 48-hour rule",
		body: "Crypto leaves a victim wallet and hits an exchange deposit cluster fast — often under an hour. The exchange can still freeze if the IO arrives with a named cluster and a statutory notice. After ~48 hours the funds have usually been P2P’d into INR or bridged. Garuda puts a clock on every NCRP row so the oldest window is obvious."
	},
	{
		title: "Why the graph is not the product",
		body: "A matplotlib hop chart does not freeze money. A named Indian VASP, a rupee figure, and a bilingual Section 91 / PMLA 17 notice does. Trace until you hit a custodial sink. Stop walking into mixers. Keep walking through bridges."
	},
	{
		title: "Peeling chains",
		body: "One wallet sending two or more similar-sized payments is not ‘diversification’. It is a peeling chain — a laundering pattern. Freeze every VASP that received a peel. They are the same operator."
	},
	{
		title: "Co-spend clustering",
		body: "Bitcoin-style co-spend (two addresses used as inputs to one transaction) is strong evidence of common control. Ethereum approximations still help. If the victim’s burner co-spends with an intermediary, they are the same desk — not two strangers."
	},
	{
		title: "Mixers vs collection nodes",
		body: "Tornado Cash is a black hole for victim recovery. A sanctioned scam-collection address is not. Flag it, then follow the outbound hop. Previous builds returned early on every sanction hit and missed the TRON → FixedFloat → CoinDCX offramp."
	},
	{
		title: "India vs MLAT",
		body: "WazirX, CoinDCX, ZebPay, Unocoin, Giottus, CoinSwitch: FIU-IND registered, SAHYOG-reachable, hours. Binance / OKX / Bybit: LEA portals, days, and INR recovery still needs a bank. Do Indian VASPs first, always."
	},
	{
		title: "UPI is the last mile",
		body: "Most Indian victims paid UPI to a mule who then bought USDT on a P2P desk. When Garuda lands on CoinDCX or WazirX, ask for the linked INR / UPI / bank account in the same freeze — that is where the victim’s rupees actually sit."
	},
	{
		title: "Organised crime test",
		body: "One victim, one wallet: a case. Three NCRP complaints sharing a layering cluster: a syndicate. Escalate. One freeze notice covering the cluster is cheaper than three IOs discovering the same WazirX deposit a week apart."
	},
	{
		title: "Live multi-chain",
		body: "Paste a 0x address for Ethereum (native + ERC-20), a T-address for TRON TRC-20, or a bc1/1/3 address for Bitcoin. Auto-detect picks the chain. Garuda walks a few live hops through a 10-minute indexer cache so repeat traces do not hammer public APIs."
	},
	{
		title: "Mixers and DeFi",
		body: "Known Tornado / Railgun / Aztec contracts are terminal. Uniswap, 1inch, Stargate, Across are labelled and walked through — they are layering, not cash-out. Equal-lot inbound deposits still trip the mixer heuristic even when the contract is new."
	},
	{
		title: "The risk number in court",
		body: "The 0–100 score is a transparent feature model (sanctions, mixer, hop distance, fan-out, VASP jurisdiction) — not a black-box neural net. An IO can explain every point in a 161 statement. Typology (investment scam vs ransomware vs sextortion) is classified from the same graph."
	}
];
function PlaybookPage() {
	const lang = useGaruda((s) => s.lang);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl md:text-4xl",
				children: t(lang, "playbook.title")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Written for a station-house officer who has a wallet, a complaint number, and four hours — not a Chainalysis licence."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 space-y-4",
				children: CHAPTERS.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs tracking-[0.14em] text-subtle uppercase",
						children: ["0", i + 1]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-serif text-xl",
						children: c.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: c.body
					})
				] }, c.title))
			})
		]
	});
}
//#endregion
export { PlaybookPage as component };
