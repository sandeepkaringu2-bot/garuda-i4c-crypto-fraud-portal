import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Button, o as useGaruda, r as t } from "./router-DGygSGFZ.mjs";
import { t as Badge } from "./badge-O91QQsnK.mjs";
import { t as Card } from "./card-zDnq8gsv.mjs";
import { t as Label } from "./label-CooKIvkz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ingest-PF2eTxF5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SAMPLE = `{
  "complaint_id": "NCRP-2026-1888",
  "victim_wallet": "0xSuspect_Burner_Wallet_A",
  "amount_usdt": 4200,
  "typology": "phishing",
  "state": "Rajasthan",
  "narrative": "UPI mule instructed victim to send USDT-ERC20."
}`;
function IngestPage() {
	const extra = useGaruda((s) => s.extraComplaints);
	const addComplaint = useGaruda((s) => s.addComplaint);
	const dispatches = useGaruda((s) => s.dispatches);
	const ackDispatch = useGaruda((s) => s.ackDispatch);
	const logAction = useGaruda((s) => s.logAction);
	const lang = useGaruda((s) => s.lang);
	const [raw, setRaw] = (0, import_react.useState)(SAMPLE);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl md:text-4xl",
				children: t(lang, "nav.ingest")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm text-muted",
				children: "NCRP webhook intake and SAHYOG freeze outbox. Production would POST to I4C SAHYOG; this command centre validates the same JSON, queues it, and records a hash-chained audit entry."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-xl",
						children: "NCRP webhook"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: "POST /api/ncrp/ingest — JSON body"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mt-3",
						htmlFor: "json",
						children: "Payload"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "json",
						value: raw,
						onChange: (e) => setRaw(e.target.value),
						className: "mt-1 min-h-44 w-full rounded-md border border-border bg-bg p-3 font-mono text-xs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3",
						onClick: async () => {
							try {
								const j = JSON.parse(raw);
								if (!j.complaint_id || !j.victim_wallet) throw new Error("complaint_id and victim_wallet required");
								addComplaint({
									id: j.complaint_id,
									wallet: j.victim_wallet,
									amountUsdt: Number(j.amount_usdt) || 0,
									typology: j.typology ?? "custom"
								});
								await logAction(j.victim_wallet, `NCRP ingest ${j.complaint_id}`);
								toast("Complaint queued");
							} catch (e) {
								toast(e instanceof Error ? e.message : "Invalid JSON");
							}
						},
						children: "Ingest complaint"
					}),
					extra.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2",
						children: extra.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs",
								children: c.id
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted",
								children: [" · ", c.wallet]
							})]
						}, c.id))
					}) : null
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-xl",
						children: "SAHYOG outbox"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: "Notices queued from Trace. Acknowledge simulates VASP nodal receipt."
					}),
					dispatches.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted",
						children: "No freezes queued. Run a trace, open Freeze notice, then Queue on SAHYOG."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-3",
						children: dispatches.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-md border border-border p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs",
										children: d.id
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: d.status === "acknowledged" ? "ok" : "warn",
										children: d.status
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm",
									children: [
										d.vaspName,
										" · ",
										d.complaintId
									]
								}),
								d.status !== "acknowledged" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									className: "mt-2",
									variant: "secondary",
									onClick: () => {
										ackDispatch(d.id);
										toast("VASP acknowledged freeze");
									},
									children: "Mark acknowledged"
								}) : null
							]
						}, d.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						size: "sm",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/trace",
							children: "Open tracer"
						})
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-xl",
						children: "Connector contract"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Fields match I4C / NCRP complaint JSON and SAHYOG freeze requests (CrPC §91, PMLA §17). Swap the outbox POST URL for the live SAHYOG endpoint when the agency connector is issued — the payload does not change."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "mt-3 overflow-x-auto font-mono text-[11px] text-muted",
						children: `POST {SAHYOG_BASE}/asset-freeze
Authorization: Bearer <I4C_TOKEN>
Content-Type: application/json

${JSON.stringify({
							request_type: "ASSET_FREEZE",
							channel: "SAHYOG",
							act: ["CrPC_S91", "PMLA_S17"],
							urgency: "P1"
						}, null, 2)}`
					})
				]
			})
		]
	});
}
//#endregion
export { IngestPage as component };
