import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, r as Slot, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as createRootRoute, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as sha256 } from "./format-C_pSLqHG.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { a as ScrollText, c as Inbox, d as Building2, f as BookOpen, i as ShieldAlert, l as GitFork, n as TriangleAlert, o as Menu, s as LayoutDashboard, t as X, u as FolderOpen } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-4-SQZspA.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var GENESIS = "GENESIS_INITIAL_LOG_NODE";
var useGaruda = create()(persist((set, get) => ({
	lang: "en",
	officerId: "I4C-OFFICER-402",
	addressMode: "label",
	lastTrace: null,
	audit: [],
	extraComplaints: [],
	dispatches: [],
	setLang: (lang) => set({ lang }),
	setOfficerId: (officerId) => set({ officerId }),
	setAddressMode: (addressMode) => set({ addressMode }),
	setTrace: (lastTrace) => set({ lastTrace }),
	addComplaint: (c) => set({ extraComplaints: [c, ...get().extraComplaints].slice(0, 20) }),
	queueDispatch: (d) => set({ dispatches: [{
		...d,
		status: d.status ?? "queued",
		at: Date.now()
	}, ...get().dispatches].slice(0, 40) }),
	ackDispatch: (id) => set({ dispatches: get().dispatches.map((x) => x.id === id ? {
		...x,
		status: "acknowledged"
	} : x) }),
	logAction: async (target, summary) => {
		const prev = get().audit;
		const previousHash = prev.length ? prev[prev.length - 1].hash : GENESIS;
		const timestamp = Date.now();
		const officerId = get().officerId;
		const index = prev.length + 1;
		const payload = JSON.stringify({
			index,
			timestamp,
			officerId,
			target,
			summary,
			previousHash
		});
		const entry = {
			index,
			timestamp,
			officerId,
			target,
			summary,
			previousHash,
			hash: await sha256(payload)
		};
		set({ audit: [...prev, entry] });
	}
}), {
	name: "garuda-i4c",
	partialize: (s) => ({
		lang: s.lang,
		officerId: s.officerId,
		addressMode: s.addressMode,
		audit: s.audit,
		extraComplaints: s.extraComplaints,
		dispatches: s.dispatches
	})
}));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-DGygSGFZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-danger",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-lg font-medium",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function GarudaMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("text-primary", className),
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: "16,2 28,8 28,20 16,30 4,20 4,8",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M8 14 L16 9 L24 14 L16 12 Z",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M9 19 L16 14.5 L23 19 L16 17 Z",
				fill: "currentColor",
				opacity: "0.7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "22.5",
				r: "1.4",
				fill: "#C45C5C"
			})
		]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-fg hover:bg-primary/90",
			secondary: "bg-surface-2 text-fg border border-border hover:bg-surface",
			ghost: "text-muted hover:text-fg hover:bg-surface-2",
			outline: "border border-border bg-transparent text-fg hover:bg-surface-2",
			danger: "bg-danger text-fg hover:bg-danger/90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var STR = {
	"app.name": {
		en: "GARUDA",
		hi: "गरुड़"
	},
	"app.sub": {
		en: "I4C Crypto Fraud Command Centre",
		hi: "आई4सी क्रिप्टो धोखाधड़ी कमांड सेंटर"
	},
	"app.org": {
		en: "Ministry of Home Affairs · CIS Division",
		hi: "गृह मंत्रालय · सीआईएस प्रभाग"
	},
	"nav.command": {
		en: "Command",
		hi: "कमांड"
	},
	"nav.trace": {
		en: "Trace",
		hi: "ट्रेस"
	},
	"nav.cases": {
		en: "Complaints",
		hi: "शिकायतें"
	},
	"nav.vasps": {
		en: "VASPs",
		hi: "एक्सचेंज"
	},
	"nav.intel": {
		en: "Intel",
		hi: "इंटेल"
	},
	"nav.evidence": {
		en: "Evidence",
		hi: "साक्ष्य"
	},
	"nav.playbook": {
		en: "Playbook",
		hi: "गाइड"
	},
	"nav.ingest": {
		en: "NCRP / SAHYOG",
		hi: "एनसीआरपी / सहयोग"
	},
	"kpi.pending": {
		en: "Pending NCRP",
		hi: "लंबित एनसीआरपी"
	},
	"kpi.window": {
		en: "Tightest freeze window",
		hi: "सबसे तंग फ्रीज विंडो"
	},
	"kpi.recoverable": {
		en: "Demo recoverable (USDT)",
		hi: "पुनःप्राप्य (USDT)"
	},
	"kpi.indian": {
		en: "Indian VASPs in directory",
		hi: "भारतीय वीएएसपी"
	},
	"home.lead": {
		en: "Paste a victim-reported wallet. Garuda walks the hops, names the exchange that received the money, and drafts the freeze notice before the 48-hour window closes.",
		hi: "पीड़ित द्वारा दी गई वॉलेट पता दर्ज करें। गरुड़ hop-by-hop ट्रैक कर एक्सचेंज पहचानता है और 48 घंटे की विंडो बंद होने से पहले फ्रीज नोटिस तैयार करता है।"
	},
	"home.demo": {
		en: "Run jury demo",
		hi: "डेमो चलाएँ"
	},
	"home.trace": {
		en: "Open tracer",
		hi: "ट्रेसर खोलें"
	},
	"home.queue": {
		en: "Waiting on an officer",
		hi: "अधिकारी की प्रतीक्षा"
	},
	"home.track": {
		en: "Trace this wallet",
		hi: "इस वॉलेट को ट्रेस करें"
	},
	"trace.title": {
		en: "Wallet attribution",
		hi: "वॉलेट आरोपण"
	},
	"trace.hint": {
		en: "The prize is not the graph. The prize is a named Indian VASP, a freeze notice, and a number in rupees.",
		hi: "ग्राफ इनाम नहीं है। इनाम है नामित भारतीय एक्सचेंज, फ्रीज नोटिस, और रुपये में राशि।"
	},
	"trace.officer": {
		en: "Officer / badge",
		hi: "अधिकारी / बैज"
	},
	"trace.wallet": {
		en: "Suspect wallet",
		hi: "संदिग्ध वॉलेट"
	},
	"trace.source": {
		en: "Ledger source",
		hi: "लेजर स्रोत"
	},
	"trace.sim": {
		en: "Simulated I4C ledger",
		hi: "सिम्युलेटेड आई4सी लेजर"
	},
	"trace.eth": {
		en: "Live Ethereum (Blockscout)",
		hi: "लाइव एथेरियम"
	},
	"trace.btc": {
		en: "Live Bitcoin (Blockstream)",
		hi: "लाइव बिटकॉइन"
	},
	"trace.tron": {
		en: "Live TRON TRC-20 (TronGrid)",
		hi: "लाइव ट्रॉन"
	},
	"trace.auto": {
		en: "Auto-detect live chain",
		hi: "चेन स्वतः पहचानें"
	},
	"trace.run": {
		en: "Start tracking",
		hi: "ट्रैकिंग शुरू करें"
	},
	"trace.labels": {
		en: "Forensic labels",
		hi: "लेबल"
	},
	"trace.hex": {
		en: "Hex aliases",
		hi: "हेक्स"
	},
	"res.wallets": {
		en: "Wallets walked",
		hi: "वॉलेट जाँचे"
	},
	"res.exchanges": {
		en: "Exchanges found",
		hi: "एक्सचेंज मिले"
	},
	"res.patterns": {
		en: "Patterns",
		hi: "पैटर्न"
	},
	"res.bridges": {
		en: "Cross-chain hops",
		hi: "क्रॉस-चेन"
	},
	"tab.summary": {
		en: "Summary",
		hi: "सार"
	},
	"tab.graph": {
		en: "Money flow",
		hi: "धन प्रवाह"
	},
	"tab.landed": {
		en: "Where it landed",
		hi: "अंतिम पड़ाव"
	},
	"tab.related": {
		en: "Related & bridges",
		hi: "संबंध व ब्रिज"
	},
	"tab.notice": {
		en: "Freeze notice",
		hi: "फ्रीज नोटिस"
	},
	"tab.log": {
		en: "Actions",
		hi: "कार्रवाई"
	},
	"risk.high": {
		en: "High risk — freeze now",
		hi: "उच्च जोखिम — अभी फ्रीज करें"
	},
	"risk.med": {
		en: "Medium risk — prepare papers",
		hi: "मध्यम जोखिम — कागज़ तैयार करें"
	},
	"risk.low": {
		en: "Low risk — routine follow-up",
		hi: "निम्न जोखिम — सामान्य जाँच"
	},
	"notice.gen": {
		en: "Generate freeze notice",
		hi: "फ्रीज नोटिस बनाएँ"
	},
	"notice.copy": {
		en: "Copy text",
		hi: "कॉपी करें"
	},
	"notice.print": {
		en: "Print / PDF",
		hi: "प्रिंट / पीडीएफ"
	},
	"notice.sahyog": {
		en: "SAHYOG payload",
		hi: "सहयोग पेलोड"
	},
	"brief.cta": {
		en: "Brief the officer",
		hi: "अधिकारी को ब्रिफ करें"
	},
	"brief.working": {
		en: "Writing the briefing…",
		hi: "ब्रिफिंग लिखी जा रही है…"
	},
	"dossier": {
		en: "Open case dossier",
		hi: "केस डोजियर खोलें"
	},
	"cases.title": {
		en: "NCRP intake",
		hi: "एनसीआरपी इनटेक"
	},
	"vasps.title": {
		en: "VASP directory",
		hi: "वीएएसपी निर्देशिका"
	},
	"intel.title": {
		en: "Threat & sanctions",
		hi: "खतरा और प्रतिबंध"
	},
	"evidence.title": {
		en: "Evidence locker",
		hi: "साक्ष्य लॉकर"
	},
	"playbook.title": {
		en: "Field playbook",
		hi: "फील्ड गाइड"
	},
	"clock.left": {
		en: "left in 48h window",
		hi: "48 घंटे में शेष"
	},
	"clock.closed": {
		en: "Window closed",
		hi: "विंडो बंद"
	},
	"empty.trace": {
		en: "Enter a wallet and start tracking.",
		hi: "वॉलेट दर्ज कर ट्रैकिंग शुरू करें।"
	},
	"fiu.yes": {
		en: "FIU-IND registered",
		hi: "FIU-IND पंजीकृत"
	},
	"fiu.no": {
		en: "Not FIU-IND",
		hi: "FIU-IND नहीं"
	}
};
function t(lang, key) {
	return STR[key]?.[lang] ?? STR[key]?.en ?? key;
}
var NAV = [
	{
		to: "/",
		key: "nav.command",
		icon: LayoutDashboard
	},
	{
		to: "/trace",
		key: "nav.trace",
		icon: GitFork
	},
	{
		to: "/cases",
		key: "nav.cases",
		icon: FolderOpen
	},
	{
		to: "/ingest",
		key: "nav.ingest",
		icon: Inbox
	},
	{
		to: "/vasps",
		key: "nav.vasps",
		icon: Building2
	},
	{
		to: "/intel",
		key: "nav.intel",
		icon: ShieldAlert
	},
	{
		to: "/evidence",
		key: "nav.evidence",
		icon: ScrollText
	},
	{
		to: "/playbook",
		key: "nav.playbook",
		icon: BookOpen
	}
];
function NavLinks({ onClick, stacked }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const lang = useGaruda((s) => s.lang);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: cn("flex gap-1", stacked ? "flex-col" : "flex-col"),
		children: NAV.map((item) => {
			const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
			const Icon = item.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				onClick,
				className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors", active ? "bg-surface-2 text-fg" : "text-muted hover:bg-surface-2/60 hover:text-fg"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }), t(lang, item.key)]
			}, item.to);
		})
	});
}
function AppShell({ children }) {
	const lang = useGaruda((s) => s.lang);
	const setLang = useGaruda((s) => s.setLang);
	const officerId = useGaruda((s) => s.officerId);
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-dvh",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "hidden w-60 shrink-0 flex-col border-r border-border bg-surface md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5 px-4 py-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GarudaMark, { className: "size-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-serif text-lg leading-none tracking-tight",
							children: t(lang, "app.name")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-[10px] tracking-[0.14em] text-muted uppercase",
							children: "I4C · CIS"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-3 pb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-auto border-t border-border px-4 py-4 text-xs text-subtle",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[11px] text-muted",
							children: officerId
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1",
							children: t(lang, "app.org")
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-bg/90 px-4 backdrop-blur-sm md:h-16 md:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 md:hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "flex size-11 items-center justify-center rounded-md text-fg",
									onClick: () => setOpen(true),
									"aria-label": "Open menu",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GarudaMark, { className: "size-6" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-serif text-base",
									children: t(lang, "app.name")
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hidden text-sm text-muted md:block",
							children: t(lang, "app.sub")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "ml-auto flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex rounded-md border border-border p-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setLang("en"),
									className: cn("h-8 rounded px-2.5 text-xs font-medium", lang === "en" ? "bg-surface-2 text-fg" : "text-muted"),
									children: "EN"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setLang("hi"),
									className: cn("h-8 rounded px-2.5 text-xs font-medium", lang === "hi" ? "bg-surface-2 text-fg" : "text-muted"),
									children: "हिं"
								})]
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 px-4 py-6 md:px-8 md:py-8",
					children
				})]
			})]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-50 md:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "absolute inset-0 bg-bg/80",
				"aria-label": "Close menu",
				onClick: () => setOpen(false)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex h-full w-64 flex-col bg-surface p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center justify-between px-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-serif text-lg",
						children: t(lang, "app.name")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => setOpen(false),
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, {
					stacked: true,
					onClick: () => setOpen(false)
				})]
			})]
		}) : null]
	});
}
var styles_default = "/assets/styles-BNXyu6fv.css";
var APP_NAME = "GARUDA";
var Route$9 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#0A0E14"
			},
			{
				name: "description",
				content: "I4C Crypto Fraud Command Centre — wallet tracing, VASP attribution, freeze notices."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap"
			}
		]
	}),
	component: Root
});
function Root() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "bottom-right",
				toastOptions: { style: {
					background: "#121820",
					border: "1px solid #243040",
					color: "#E8EDF2"
				} }
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$8 = () => import("./routes-CTwAt8-s.mjs");
var Route$8 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./cases-wTn85dUC.mjs");
var Route$7 = createFileRoute("/cases")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./dossier-CaQk8Nr5.mjs");
var Route$6 = createFileRoute("/dossier")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./evidence-PxnBxwm0.mjs");
var Route$5 = createFileRoute("/evidence")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./ingest-PF2eTxF5.mjs");
var Route$4 = createFileRoute("/ingest")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./intel-CpLLlErX.mjs");
var Route$3 = createFileRoute("/intel")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./playbook-XYzkwPUr.mjs");
var Route$2 = createFileRoute("/playbook")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./trace-BWaV3rzk.mjs");
var Route$1 = createFileRoute("/trace")({
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	validateSearch: (s) => ({
		wallet: typeof s.wallet === "string" ? s.wallet : void 0,
		caseId: typeof s.caseId === "string" ? s.caseId : void 0,
		run: typeof s.run === "string" ? s.run : void 0
	})
});
var $$splitComponentImporter = () => import("./vasps-BWlTCgmx.mjs");
var Route = createFileRoute("/vasps")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$8.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$9
	}),
	CasesRoute: Route$7.update({
		id: "/cases",
		path: "/cases",
		getParentRoute: () => Route$9
	}),
	DossierRoute: Route$6.update({
		id: "/dossier",
		path: "/dossier",
		getParentRoute: () => Route$9
	}),
	EvidenceRoute: Route$5.update({
		id: "/evidence",
		path: "/evidence",
		getParentRoute: () => Route$9
	}),
	IngestRoute: Route$4.update({
		id: "/ingest",
		path: "/ingest",
		getParentRoute: () => Route$9
	}),
	IntelRoute: Route$3.update({
		id: "/intel",
		path: "/intel",
		getParentRoute: () => Route$9
	}),
	PlaybookRoute: Route$2.update({
		id: "/playbook",
		path: "/playbook",
		getParentRoute: () => Route$9
	}),
	TraceRoute: Route$1.update({
		id: "/trace",
		path: "/trace",
		getParentRoute: () => Route$9
	}),
	VaspsRoute: Route.update({
		id: "/vasps",
		path: "/vasps",
		getParentRoute: () => Route$9
	})
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { cn as a, Button as i, Route$1 as n, useGaruda as o, t as r, router_exports as t };
