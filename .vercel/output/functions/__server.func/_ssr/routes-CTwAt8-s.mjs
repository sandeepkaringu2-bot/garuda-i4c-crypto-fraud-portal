import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as usdt, r as inr } from "./format-C_pSLqHG.mjs";
import { p as ArrowRight, r as Shield } from "../_libs/lucide-react.mjs";
import { a as cn, i as Button, o as useGaruda, r as t } from "./router-DGygSGFZ.mjs";
import { t as FreezeClock } from "./clock-mjKFNtaG.mjs";
import { t as Badge } from "./badge-O91QQsnK.mjs";
import { t as Card } from "./card-zDnq8gsv.mjs";
import { f as TYPOLOGY_LABEL, o as DIRECTORY, r as COMPLAINTS } from "./registry-dYL5WTs-.mjs";
import { n as runTrace } from "./engine-C0nk7dxH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CTwAt8-s.js
var import_jsx_runtime = require_jsx_runtime();
function KpiStat({ label, value, hint, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs font-medium tracking-wide text-muted uppercase",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("mt-2 font-serif text-2xl tabular-nums tracking-tight", tone === "danger" && "text-danger", tone === "ok" && "text-ok", tone === "warn" && "text-warn", !tone && "text-fg"),
				children: value
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xs text-subtle",
				children: hint
			}) : null
		]
	});
}
function Command() {
	const lang = useGaruda((s) => s.lang);
	const indian = DIRECTORY.filter((d) => d.jurisdiction === "India" && d.kind === "vasp").length;
	const tight = COMPLAINTS.find((c) => c.hoursAgo === Math.max(...COMPLAINTS.map((x) => x.hoursAgo)));
	const demo = runTrace("0xSuspect_Burner_Wallet_A", { caseId: "NCRP-2026-1001" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ledger-grid -mx-4 -mt-6 mb-8 rounded-none border-b border-border px-4 py-10 md:-mx-8 md:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
						children: t(lang, "app.org")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 max-w-2xl font-serif text-4xl text-fg md:text-5xl",
						children: t(lang, "app.name")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-serif text-lg text-muted",
						children: t(lang, "app.sub")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-2xl text-sm leading-relaxed text-muted",
						children: t(lang, "home.lead")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/trace",
									search: {
										wallet: "0xSuspect_Burner_Wallet_A",
										caseId: "NCRP-2026-1001",
										run: "1"
									},
									children: [t(lang, "home.demo"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/trace",
									children: t(lang, "home.trace")
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "ghost",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/playbook",
									children: t(lang, "nav.playbook")
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiStat, {
						label: t(lang, "kpi.pending"),
						value: String(COMPLAINTS.length),
						hint: "From NCRP / SAHYOG"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiStat, {
						label: t(lang, "kpi.window"),
						value: tight ? `${48 - tight.hoursAgo}h` : "—",
						hint: tight?.id,
						tone: "danger"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiStat, {
						label: t(lang, "kpi.recoverable"),
						value: demo.recoverableUsdt.toLocaleString("en-IN"),
						hint: `${inr(demo.recoverableUsdt)} at Indian VASPs`,
						tone: "ok"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiStat, {
						label: t(lang, "kpi.indian"),
						value: String(indian),
						hint: "Freezeable without MLAT"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: t(lang, "home.queue")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Oldest freeze window first. Click through to attribute the wallet."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-3",
						children: [...COMPLAINTS].sort((a, b) => b.hoursAgo - a.hoursAgo).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "flex flex-col gap-3 p-4 md:flex-row md:items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-sm",
												children: c.id
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												tone: c.hoursAgo > 36 ? "danger" : c.hoursAgo > 18 ? "warn" : "ok",
												children: TYPOLOGY_LABEL[c.typology][lang]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FreezeClock, { hoursAgo: c.hoursAgo })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-muted",
										children: c.brief
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 font-mono text-xs text-subtle",
										children: [
											c.victimWallet,
											" · ",
											usdt(c.amountUsdt),
											" · ",
											c.state
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								className: "shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/trace",
									search: {
										wallet: c.victimWallet,
										caseId: c.id,
										run: "1"
									},
									children: t(lang, "home.track")
								})
							})]
						}) }, c.id))
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "mt-0.5 size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-medium",
							children: "What previous teams missed"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-2 space-y-2 text-sm text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "A 48-hour recovery clock tied to the NCRP timestamp." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Bilingual SAHYOG freeze notices (CrPC 91 · PMLA 17 · IT Act)." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Syndicate correlation across complaints — same wallets, many victims." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Recoverable rupees, not just a matplotlib graph." })
							]
						})] })]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-medium",
						children: "SIH26183 coverage"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-2 space-y-1.5 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Live BTC · ETH (native + tokens) · TRON TRC-20, auto chain detect" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Hop-limited indexer cache + multi-hop live walk" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Mixer contracts + equal-lot heuristic · DeFi routers labelled" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Typology classifier + transparent feature risk score" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "NCRP JSON ingest · SAHYOG freeze outbox" })
						]
					})] })]
				})]
			})
		]
	});
}
//#endregion
export { Command as component };
