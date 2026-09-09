import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as useGaruda, r as t } from "./router-DGygSGFZ.mjs";
import { t as Badge } from "./badge-O91QQsnK.mjs";
import { t as Card } from "./card-zDnq8gsv.mjs";
import { a as DEFI_ROUTERS, d as SANCTIONS, u as MIXER_CONTRACTS } from "./registry-dYL5WTs-.mjs";
import { i as indexStats } from "./live-BgCs5gC_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/intel-CpLLlErX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function IntelPage() {
	const lang = useGaruda((s) => s.lang);
	const [stats, setStats] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		indexStats().then(setStats).catch(() => setStats({
			cachedAddresses: 0,
			ttlMinutes: 10
		}));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl md:text-4xl",
				children: t(lang, "intel.title")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Live hop cache, OFAC / FIU screening, mixer contracts, and DeFi routers. A mixer match is terminal. A collection-node match is not — we keep walking."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted",
							children: "Indexed addresses (live cache)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 font-serif text-3xl tabular-nums",
							children: stats?.cachedAddresses ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-subtle",
							children: [
								"TTL ",
								stats?.ttlMinutes ?? 10,
								" min · per-request walk, no full-chain node"
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted",
							children: "Mixer contracts screened"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 font-serif text-3xl tabular-nums",
							children: Object.keys(MIXER_CONTRACTS).length
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-subtle",
							children: "Plus equal-lot deposit heuristic"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 font-serif text-2xl",
				children: "Sanctions & collection nodes"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-3",
				children: Object.entries(SANCTIONS).map(([wallet, s]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: s.severity === "CRITICAL" ? "danger" : "warn",
									children: s.severity
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: s.source }),
								s.terminal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: "danger",
									children: "Terminal hop"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: "info",
									children: "Continue tracing"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-mono text-xs",
							children: wallet
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: s.reason
						})
					]
				}, wallet))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 font-serif text-2xl",
				children: "Live mixer / privacy pools"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: Object.entries(MIXER_CONTRACTS).map(([addr, name]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[11px] text-muted break-all",
						children: addr
					})]
				}, addr))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 font-serif text-2xl",
				children: "DeFi / bridge routers"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Hits are layering, not terminal. Garuda labels the protocol and keeps walking to the custodial sink."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: Object.entries(DEFI_ROUTERS).map(([addr, name]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[11px] text-muted break-all",
						children: addr
					})]
				}, addr))
			})
		]
	});
}
//#endregion
export { IntelPage as component };
