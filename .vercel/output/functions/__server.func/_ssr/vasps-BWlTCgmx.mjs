import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as useGaruda, r as t } from "./router-DGygSGFZ.mjs";
import { t as Badge } from "./badge-O91QQsnK.mjs";
import { t as Card } from "./card-zDnq8gsv.mjs";
import { o as DIRECTORY } from "./registry-dYL5WTs-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vasps-BWlTCgmx.js
var import_jsx_runtime = require_jsx_runtime();
function VaspsPage() {
	const lang = useGaruda((s) => s.lang);
	const indian = DIRECTORY.filter((d) => d.jurisdiction === "India");
	const foreign = DIRECTORY.filter((d) => d.jurisdiction !== "India" && d.kind === "vasp");
	const other = DIRECTORY.filter((d) => d.kind !== "vasp");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl md:text-4xl",
				children: t(lang, "vasps.title")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm text-muted",
				children: "Freeze leverage is a function of jurisdiction. An Indian FIU-IND VASP can move in hours. A foreign exchange is days to MLAT. A mixer does not take notices."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "India — FIU-IND registered",
				items: indian,
				lang
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "International VASPs",
				items: foreign,
				lang
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Bridges & mixers (do not freeze — trace through)",
				items: other,
				lang
			})
		]
	});
}
function Section({ title, items, lang }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-serif text-xl",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 grid gap-3 md:grid-cols-2",
			children: items.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: v.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: v.fiuRegistered ? "ok" : v.kind === "mixer" ? "danger" : "warn",
							children: v.fiuRegistered ? t(lang, "fiu.yes") : v.kind.toUpperCase()
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: v.notes
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-subtle",
						children: [
							v.nodal,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							v.contact,
							v.freezeSlaHours ? ` · typical freeze ${v.freezeSlaHours}h` : null
						]
					})
				]
			}, v.id))
		})]
	});
}
//#endregion
export { VaspsPage as component };
