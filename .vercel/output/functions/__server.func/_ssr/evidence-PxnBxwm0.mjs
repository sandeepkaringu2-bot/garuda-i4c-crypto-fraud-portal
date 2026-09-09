import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as useGaruda, r as t } from "./router-DGygSGFZ.mjs";
import { t as Badge } from "./badge-O91QQsnK.mjs";
import { t as Card } from "./card-zDnq8gsv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/evidence-PxnBxwm0.js
var import_jsx_runtime = require_jsx_runtime();
function EvidencePage() {
	const lang = useGaruda((s) => s.lang);
	const audit = useGaruda((s) => s.audit);
	let broken = -1;
	for (let i = 1; i < audit.length; i++) if (audit[i].previousHash !== audit[i - 1].hash) {
		broken = i;
		break;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl md:text-4xl",
				children: t(lang, "evidence.title")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Every trace and notice action is appended to a SHA-256 hash chain. Tampering a past record breaks the link. Export this chain with the dossier — it is the chain of custody, not a blog of clicks."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-6 p-4",
				children: broken >= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-danger",
					children: [
						"Chain broken at record ",
						broken + 1,
						"."
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-ok",
					children: [
						"Chain intact · ",
						audit.length,
						" record",
						audit.length === 1 ? "" : "s",
						" verified."
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-4 space-y-2",
				children: audit.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Run a trace to write the first block after genesis."
				}) : [...audit].reverse().map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: ["#", e.index] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm",
							children: e.summary
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-mono text-[11px] leading-relaxed text-subtle",
						children: [
							e.officerId,
							" · ",
							e.target,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							new Date(e.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
							" IST",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"prev ",
							e.previousHash.slice(0, 20),
							"…",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"hash ",
							e.hash.slice(0, 20),
							"…"
						]
					})]
				}, e.hash))
			})
		]
	});
}
//#endregion
export { EvidencePage as component };
