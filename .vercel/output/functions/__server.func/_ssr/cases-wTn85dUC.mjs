import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as usdt } from "./format-C_pSLqHG.mjs";
import { i as Button, o as useGaruda, r as t } from "./router-DGygSGFZ.mjs";
import { t as FreezeClock } from "./clock-mjKFNtaG.mjs";
import { t as Badge } from "./badge-O91QQsnK.mjs";
import { t as Card } from "./card-zDnq8gsv.mjs";
import { t as Input } from "./input-D7Gze3Jb.mjs";
import { t as Label } from "./label-CooKIvkz.mjs";
import { f as TYPOLOGY_LABEL, r as COMPLAINTS } from "./registry-dYL5WTs-.mjs";
import { n as runTrace } from "./engine-C0nk7dxH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cases-wTn85dUC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CasesPage() {
	const lang = useGaruda((s) => s.lang);
	const extra = useGaruda((s) => s.extraComplaints);
	const addComplaint = useGaruda((s) => s.addComplaint);
	const [id, setId] = (0, import_react.useState)("NCRP-2026-");
	const [wallet, setWallet] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("2500");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl md:text-4xl",
				children: t(lang, "cases.title")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm text-muted",
				children: "NCRP queue plus a local intake form. Same wallet in two complaints is treated as organised activity — Garuda flags it on the trace."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4",
				children: [COMPLAINTS.map((c) => {
					const overlap = COMPLAINTS.filter((o) => o.id !== c.id).filter((o) => {
						const a = runTrace(c.victimWallet);
						const b = new Set(runTrace(o.victimWallet).nodes.map((n) => n.id));
						return a.nodes.some((n) => b.has(n.id));
					});
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-sm",
										children: c.id
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: TYPOLOGY_LABEL[c.typology][lang] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: "info",
										children: c.state
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
									usdt(c.amountUsdt)
								]
							}),
							overlap.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-warn",
								children: [
									"Shares graph with ",
									overlap.map((o) => o.id).join(", "),
									" — syndicate signal."
								]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								className: "mt-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/trace",
									search: {
										wallet: c.victimWallet,
										caseId: c.id,
										run: "1"
									},
									children: t(lang, "home.track")
								})
							})
						]
					}, c.id);
				}), extra.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-sm",
							children: c.id
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-mono text-xs text-subtle",
							children: [
								c.wallet,
								" · ",
								usdt(c.amountUsdt),
								" · ",
								c.typology
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							className: "mt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/trace",
								search: {
									wallet: c.wallet,
									caseId: c.id,
									run: "1"
								},
								children: t(lang, "home.track")
							})
						})
					]
				}, c.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-xl",
						children: "Simulate NCRP webhook"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "In production this is the FastAPI /webhook/ncrp-alert endpoint. Here it lands in the local queue."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-4 grid gap-3 md:grid-cols-3",
						onSubmit: (e) => {
							e.preventDefault();
							if (!id || !wallet) return;
							addComplaint({
								id,
								wallet,
								amountUsdt: Number(amount) || 0,
								typology: "custom"
							});
							setWallet("");
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "nid",
								children: "Complaint ID"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "nid",
								value: id,
								onChange: (e) => setId(e.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "nw",
								children: "Wallet"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "nw",
								className: "font-mono",
								value: wallet,
								onChange: (e) => setWallet(e.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "na",
								children: "USDT"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "na",
								value: amount,
								onChange: (e) => setAmount(e.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "md:col-span-3",
								children: "Queue complaint"
							})
						]
					})
				]
			})
		]
	});
}
//#endregion
export { CasesPage as component };
