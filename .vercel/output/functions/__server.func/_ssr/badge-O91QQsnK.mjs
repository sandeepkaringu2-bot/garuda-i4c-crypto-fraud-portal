import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as cn } from "./router-DGygSGFZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-O91QQsnK.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide", {
	variants: { tone: {
		default: "bg-surface-2 text-muted",
		primary: "bg-primary/15 text-primary",
		danger: "bg-danger/15 text-danger",
		warn: "bg-warn/15 text-warn",
		ok: "bg-ok/15 text-ok",
		info: "bg-info/15 text-info"
	} },
	defaultVariants: { tone: "default" }
});
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ tone }), className),
		...props
	});
}
//#endregion
export { Badge as t };
