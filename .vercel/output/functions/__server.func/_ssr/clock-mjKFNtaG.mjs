import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as formatDuration, s as slaRemaining } from "./format-C_pSLqHG.mjs";
import { a as cn, o as useGaruda, r as t } from "./router-DGygSGFZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/clock-mjKFNtaG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FreezeClock({ hoursAgo, compact }) {
	const lang = useGaruda((s) => s.lang);
	const [left, setLeft] = (0, import_react.useState)(() => slaRemaining(hoursAgo));
	(0, import_react.useEffect)(() => {
		setLeft(slaRemaining(hoursAgo));
		const id = setInterval(() => setLeft(slaRemaining(hoursAgo)), 3e4);
		return () => clearInterval(id);
	}, [hoursAgo]);
	const closed = left <= 0;
	const tight = left > 0 && left < 144e5;
	const label = closed ? t(lang, "clock.closed") : `${formatDuration(left)} ${t(lang, "clock.left")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums", closed && "bg-danger/15 text-danger", tight && !closed && "bg-warn/15 text-warn", !tight && !closed && "bg-ok/15 text-ok", compact && "text-[11px]"),
		children: label
	});
}
//#endregion
export { FreezeClock as t };
