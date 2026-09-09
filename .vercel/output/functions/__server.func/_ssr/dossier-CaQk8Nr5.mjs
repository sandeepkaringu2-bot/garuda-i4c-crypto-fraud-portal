import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as usdt, r as inr } from "./format-C_pSLqHG.mjs";
import { i as Button, o as useGaruda } from "./router-DGygSGFZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dossier-CaQk8Nr5.js
var import_jsx_runtime = require_jsx_runtime();
function DossierPage() {
	const trace = useGaruda((s) => s.lastTrace);
	const officerId = useGaruda((s) => s.officerId);
	if (!trace) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl py-16 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "No trace in session. Run attribution first."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/trace",
				children: "Open tracer"
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "no-print mb-4 flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => window.print(),
				children: "Print / save PDF"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/trace",
					children: "Back to trace"
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "paper-doc rounded-lg p-8 md:p-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.18em] uppercase",
					children: "Indian Cyber Crime Coordination Centre · CIS"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-serif text-3xl",
					children: "GARUDA forensic dossier"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm",
					children: [
						"Officer ",
						officerId,
						" · Case ",
						trace.caseId ?? "unattached",
						" · ",
						new Date(trace.ranAt).toLocaleString("en-IN"),
						" IST"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-8 font-serif text-xl",
					children: "1. Target"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-mono text-sm",
					children: trace.source
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm",
					children: [
						"Walked ",
						trace.nodes.length,
						" wallets, ",
						trace.maxHop,
						" hops, ",
						trace.mode,
						" ledger. Recoverable at Indian VASPs:",
						" ",
						usdt(trace.recoverableUsdt),
						" (",
						inr(trace.recoverableUsdt),
						"). Mixer-bound: ",
						usdt(trace.lostUsdt),
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-8 font-serif text-xl",
					children: "2. Endpoints"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "mt-3 w-full text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "pb-1",
							children: "Entity"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Wallet" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Hops" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Risk" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "USDT" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: trace.endpoints.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-ink/15",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-1.5 pr-2",
								children: e.entity
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-1.5 pr-2 font-mono text-[11px]",
								children: e.wallet
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-1.5 pr-2",
								children: e.hops
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-1.5 pr-2",
								children: e.risk
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-1.5",
								children: e.amountUsdt
							})
						]
					}, e.wallet)) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-8 font-serif text-xl",
					children: "3. Typologies"
				}),
				trace.typologies.length ? trace.typologies.map((ty) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: ty.typology }),
						" at ",
						ty.node,
						". ",
						ty.description,
						" ",
						ty.officerNote
					]
				}, ty.typology)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm",
					children: "No peeling / mixer / bridge pattern above threshold."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-8 font-serif text-xl",
					children: "4. Recommended actions"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-2 list-decimal space-y-1 pl-5 text-sm",
					children: trace.recommendations.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [r.title, "."] }),
						" ",
						r.detail
					] }, r.title))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-8 font-serif text-xl",
					children: "5. Correlations"
				}),
				trace.correlations.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 list-disc pl-5 text-sm",
					children: trace.correlations.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						c.wallet,
						" · ",
						c.complaintIds.join(", ")
					] }, c.wallet))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm",
					children: "No shared wallets with other queued complaints."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-10 text-xs",
					children: "Generated by GARUDA for I4C investigative use. Hash-chain the session from the Evidence locker before filing."
				})
			]
		})]
	});
}
//#endregion
export { DossierPage as component };
