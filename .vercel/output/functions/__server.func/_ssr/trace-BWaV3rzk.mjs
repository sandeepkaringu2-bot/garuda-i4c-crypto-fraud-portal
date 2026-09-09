import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as createServerFn } from "./ssr.mjs";
import { c as usdt, i as riskTone, o as shortAddr, r as inr, t as displayAddress } from "./format-C_pSLqHG.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as cn, i as Button, n as Route$1, o as useGaruda, r as t } from "./router-DGygSGFZ.mjs";
import { t as Badge } from "./badge-O91QQsnK.mjs";
import { t as Card } from "./card-zDnq8gsv.mjs";
import { t as Input } from "./input-D7Gze3Jb.mjs";
import { t as Label } from "./label-CooKIvkz.mjs";
import { c as KNOWN_VASPS, r as COMPLAINTS } from "./registry-dYL5WTs-.mjs";
import { n as runTrace, r as sahyogPayload, t as explainRisk } from "./engine-C0nk7dxH.mjs";
import { n as detectChain, r as fetchLiveHops, t as createSsrRpc } from "./live-BgCs5gC_.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trace-BWaV3rzk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KIND_FILL = {
	burner: "var(--color-info)",
	layer: "var(--color-ring)",
	vasp: "var(--color-ok)",
	offramp: "var(--color-ok)",
	mixer: "var(--color-danger)",
	sanctioned: "var(--color-danger)",
	bridge: "var(--color-warn)",
	unknown: "var(--color-subtle)"
};
function HopGraph({ trace }) {
	const mode = useGaruda((s) => s.addressMode);
	const [replay, setReplay] = (0, import_react.useState)(trace.maxHop);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const layout = (0, import_react.useMemo)(() => {
		const cols = /* @__PURE__ */ new Map();
		for (const n of trace.nodes) {
			const list = cols.get(n.hop) ?? [];
			list.push(n);
			cols.set(n.hop, list);
		}
		const nodeW = 148;
		const nodeH = 44;
		const gapX = 56;
		const gapY = 18;
		const pad = 24;
		const height = 48 + Math.max(...[...cols.values()].map((l) => l.length), 1) * 62 - gapY;
		const width = 48 + (trace.maxHop + 1) * 204 - gapX;
		const pos = /* @__PURE__ */ new Map();
		for (const [hop, list] of cols) {
			const startY = (height - (list.length * 62 - gapY)) / 2;
			list.forEach((n, i) => {
				pos.set(n.id, {
					x: pad + hop * 204,
					y: startY + i * 62
				});
			});
		}
		return {
			pos,
			width,
			height,
			nodeW,
			nodeH
		};
	}, [trace]);
	const visibleEdges = trace.edges.filter((e) => {
		return (trace.nodes.find((n) => n.id === e.to)?.hop ?? 99) <= replay;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: "Hop replay"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: 0,
					max: trace.maxHop,
					value: replay,
					onChange: (e) => setReplay(Number(e.target.value)),
					className: "w-40 accent-primary"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-xs tabular-nums text-fg",
					children: [
						replay,
						"/",
						trace.maxHop
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-9 rounded-md px-3 text-xs text-muted hover:text-fg",
					onClick: () => {
						setReplay(0);
						let h = 0;
						const tick = () => {
							h += 1;
							setReplay(Math.min(h, trace.maxHop));
							if (h < trace.maxHop) window.setTimeout(tick, 420);
						};
						window.setTimeout(tick, 280);
					},
					children: "Play hops"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-xl bg-bg p-2 shadow-[var(--shadow-border)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: `0 0 ${layout.width} ${layout.height}`,
				width: "100%",
				style: {
					minWidth: Math.min(layout.width, 920),
					height: Math.min(layout.height, 420)
				},
				role: "img",
				"aria-label": "Fund-flow hop graph",
				children: [visibleEdges.map((e) => {
					const a = layout.pos.get(e.from);
					const b = layout.pos.get(e.to);
					if (!a || !b) return null;
					const x1 = a.x + layout.nodeW;
					const y1 = a.y + layout.nodeH / 2;
					const x2 = b.x;
					const y2 = b.y + layout.nodeH / 2;
					const mid = (x1 + x2) / 2;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`,
						fill: "none",
						stroke: "color-mix(in oklab, var(--color-fg) 28%, transparent)",
						strokeWidth: "1.4"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: mid,
						y: (y1 + y2) / 2 - 6,
						textAnchor: "middle",
						fill: "var(--color-muted)",
						fontSize: "9",
						fontFamily: "IBM Plex Mono, monospace",
						children: e.amount >= 1 ? e.amount : e.amount.toFixed(4)
					})] }, `${e.from}-${e.to}-${e.txid}`);
				}), trace.nodes.filter((n) => n.hop <= replay).map((n) => {
					const p = layout.pos.get(n.id);
					if (!p) return null;
					const fill = KIND_FILL[n.kind] ?? KIND_FILL.unknown;
					const active = selected === n.id;
					const text = shortAddr(displayAddress(n.id, mode) === n.id ? n.label : displayAddress(n.id, mode), 16);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						onClick: () => setSelected(n.id),
						style: { cursor: "pointer" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: p.x,
								y: p.y,
								width: layout.nodeW,
								height: layout.nodeH,
								rx: 8,
								fill: "var(--color-surface)",
								stroke: active ? "var(--color-primary)" : fill,
								strokeWidth: active ? 2 : 1.4
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: p.x + 12,
								cy: p.y + 22,
								r: 4,
								fill
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: p.x + 22,
								y: p.y + 19,
								fill: "var(--color-fg)",
								fontSize: "10",
								fontFamily: "IBM Plex Sans, sans-serif",
								children: text
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
								x: p.x + 22,
								y: p.y + 33,
								fill: "var(--color-muted)",
								fontSize: "9",
								fontFamily: "IBM Plex Sans, sans-serif",
								children: [
									"hop ",
									n.hop,
									" · ",
									n.kind
								]
							})
						]
					}, n.id);
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "mt-3 flex flex-wrap gap-3 text-xs text-muted",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-info" }), " Origin / burner"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-ok" }), " Exchange / VASP"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-warn" }), " Bridge"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-danger" }), " Mixer / sanctioned"]
				})
			]
		}),
		selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 font-mono text-xs text-muted",
			children: [displayAddress(selected, mode), trace.edges.filter((e) => e.from === selected || e.to === selected).slice(0, 4).map((e) => ` · ${e.from === selected ? "out" : "in"} ${usdt(e.amount)}`).join("")]
		}) : null
	] });
}
function noticeId(complaintId, wallet) {
	return `GARUDA-FZ-${`${complaintId}:${wallet}`.replace(/[^A-Za-z0-9]/g, "").slice(-10).toUpperCase()}`;
}
function freezeNoticeEn(opts) {
	const v = KNOWN_VASPS[opts.endpoint.wallet];
	return [
		"INDIAN CYBER CRIME COORDINATION CENTRE (I4C)",
		"Ministry of Home Affairs — CIS Division",
		"SAHYOG / Emergency Asset Preservation Request",
		"",
		`Notice ID: ${noticeId(opts.complaintId, opts.endpoint.wallet)}`,
		`Date: ${(/* @__PURE__ */ new Date()).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST`,
		`From: ${opts.officerId}`,
		`To: ${v?.nodal ?? "Nodal Officer"}, ${opts.endpoint.entity}`,
		`Channel: ${v?.contact ?? "registered nodal desk"}`,
		"",
		`Subject: Immediate freeze of crypto assets linked to NCRP ${opts.complaintId}`,
		"",
		"Legal basis",
		"1. Section 91, Code of Criminal Procedure, 1973 — production and preservation of documents/electronic records.",
		"2. Section 17, Prevention of Money Laundering Act, 2002 — attachment and freeze of proceeds of crime.",
		"3. Information Technology Act, 2000 — duty to preserve digital evidence and subscriber information.",
		"4. I4C / MHA advisory on crypto-asset tracing for law-enforcement agencies.",
		"",
		"Facts (machine-traced, officer-verified)",
		`A victim-reported wallet ${opts.sourceWallet} was walked by the GARUDA attribution engine.`,
		`Endpoint cluster ${opts.endpoint.wallet} is attributed to ${opts.endpoint.entity}.`,
		`Value observed at this sink: ${usdt(opts.endpoint.amountUsdt)} (≈ ${inr(opts.endpoint.amountUsdt)}).`,
		`Hop distance from the reported wallet: ${opts.endpoint.hops}. Risk score: ${opts.endpoint.risk}/100.`,
		"",
		"You are requested to IMMEDIATELY, and in any event within four (4) hours of receipt:",
		"a) Freeze crypto balances and linked INR / bank / UPI rails for this cluster and any co-attributed deposit addresses;",
		"b) Preserve KYC, CKYC, video-KYC, login IPs, device fingerprints, order books, and internal transfer logs for 180 days;",
		"c) Restrict withdrawals, P2P completion, and internal shuttling for a minimum of 72 hours;",
		"d) Acknowledge this notice to the requesting officer with a freeze confirmation number.",
		"",
		"Non-preservation of these records after notice may attract consequences under PMLA and the IT Act.",
		"",
		"This notice is generated by GARUDA for I4C investigative use. It is a draft statutory communication — serve through SAHYOG / the registered nodal channel."
	].join("\n");
}
function freezeNoticeHi(opts) {
	const v = KNOWN_VASPS[opts.endpoint.wallet];
	return [
		"भारतीय साइबर अपराध समन्वय केंद्र (I4C)",
		"गृह मंत्रालय — सीआईएस प्रभाग",
		"सहयोग / आपात परिसंपत्ति संरक्षण अनुरोध",
		"",
		`नोटिस संख्या: ${noticeId(opts.complaintId, opts.endpoint.wallet)}`,
		`दिनांक: ${(/* @__PURE__ */ new Date()).toLocaleString("hi-IN", { timeZone: "Asia/Kolkata" })} IST`,
		`प्रेषक: ${opts.officerId}`,
		`सेवा में: ${v?.nodal ?? "नोडल अधिकारी"}, ${opts.endpoint.entity}`,
		`माध्यम: ${v?.contact ?? "पंजीकृत नोडल डेस्क"}`,
		"",
		`विषय: एनसीआरपी ${opts.complaintId} से जुड़ी क्रिप्टो परिसंपत्तियों का तत्काल अवरोधन`,
		"",
		"कानूनी आधार",
		"1. दंड प्रक्रिया संहिता, 1973 की धारा 91 — दस्तावेज / इलेक्ट्रॉनिक अभिलेख प्रस्तुत करना व सुरक्षित रखना।",
		"2. धन शोधन निवारण अधिनियम, 2002 की धारा 17 — अपराध की आय का कुर्क / फ्रीज।",
		"3. सूचना प्रौद्योगिकी अधिनियम, 2000 — डिजिटल साक्ष्य व ग्राहक सूचना संरक्षित रखने का कर्तव्य।",
		"4. विधि-प्रवर्तन हेतु क्रिप्टो-परिसंपत्ति अनुरेखण पर आई4सी / गृह मंत्रालय सलाह।",
		"",
		"तथ्य (इंजन-ट्रेस, अधिकारी-सत्यापित)",
		`पीड़ित द्वारा सूचित वॉलेट ${opts.sourceWallet} का GARUDA इंजन द्वारा अनुरेखण किया गया।`,
		`अंतिम क्लस्टर ${opts.endpoint.wallet} ${opts.endpoint.entity} से आरोपित है।`,
		`इस पड़ाव पर मूल्य: ${usdt(opts.endpoint.amountUsdt)} (लगभग ${inr(opts.endpoint.amountUsdt)})।`,
		`रिपोर्टेड वॉलेट से दूरी: ${opts.endpoint.hops} hop. जोखिम अंक: ${opts.endpoint.risk}/100.`,
		"",
		"आपसे अनुरोध है कि प्राप्ति के चार (4) घंटे के भीतर:",
		"क) इस क्लस्टर व सह-आरोपित जमा पतों के क्रिप्टो शेष तथा जुड़े INR / बैंक / यूपीआई रास्ते फ्रीज करें;",
		"ख) केवाईसी, लॉगिन आईपी, डिवाइस फिंगरप्रिंट, ऑर्डर बुक व आंतरिक ट्रांसफर लॉग 180 दिनों तक सुरक्षित रखें;",
		"ग) निकासी, पी2पी पूर्णता व आंतरिक स्थानांतरण न्यूनतम 72 घंटे रोकें;",
		"घ) फ्रीज पुष्टि संख्या के साथ इस अधिकारी को पावती भेजें।",
		"",
		"नोटिस के बाद अभिलेख न रखना पीएमएलए व आईटी अधिनियम के अंतर्गत परिणामी हो सकता है।",
		"",
		"यह नोटिस GARUDA द्वारा आई4सी जाँच हेतु तैयार मसौदा है — सहयोग / पंजीकृत नोडल माध्यम से तामील करें।"
	].join("\n");
}
function FreezePanel({ trace }) {
	const lang = useGaruda((s) => s.lang);
	const officerId = useGaruda((s) => s.officerId);
	const queueDispatch = useGaruda((s) => s.queueDispatch);
	const logAction = useGaruda((s) => s.logAction);
	const targets = trace.endpoints.filter((e) => e.kind === "vasp" || e.recoverable);
	const [wallet, setWallet] = (0, import_react.useState)(targets[0]?.wallet ?? trace.endpoints[0]?.wallet ?? "");
	const [docLang, setDocLang] = (0, import_react.useState)(lang);
	const endpoint = trace.endpoints.find((e) => e.wallet === wallet) ?? trace.endpoints[0];
	const text = (0, import_react.useMemo)(() => {
		if (!endpoint) return "";
		const opts = {
			officerId,
			complaintId: trace.caseId ?? "UNATTACHED",
			sourceWallet: trace.source,
			endpoint
		};
		return docLang === "hi" ? freezeNoticeHi(opts) : freezeNoticeEn(opts);
	}, [
		endpoint,
		officerId,
		trace,
		docLang
	]);
	if (!endpoint) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "No custodial endpoint to serve a notice on."
	});
	const payload = sahyogPayload(endpoint, trace.caseId ?? "UNATTACHED", officerId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5 lg:grid-cols-[1fr_280px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted",
						children: "VASP"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: wallet,
						onChange: (e) => setWallet(e.target.value),
						className: "h-11 rounded-md border border-border bg-bg px-3 text-sm",
						children: trace.endpoints.filter((e) => e.kind === "vasp" || e.kind === "mixer" || e.recoverable).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: e.wallet,
							children: e.entity
						}, e.wallet))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex rounded-md border border-border p-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `h-9 rounded px-3 text-xs ${docLang === "en" ? "bg-surface-2 text-fg" : "text-muted"}`,
							onClick: () => setDocLang("en"),
							children: "English"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `h-9 rounded px-3 text-xs ${docLang === "hi" ? "bg-surface-2 text-fg" : "text-muted"}`,
							onClick: () => setDocLang("hi"),
							children: "हिंदी"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
				className: "paper-doc rounded-lg p-6 font-serif text-[13px] leading-relaxed whitespace-pre-wrap",
				children: text
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2 no-print",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: async () => {
							await navigator.clipboard.writeText(text);
							toast("Notice copied");
						},
						children: t(lang, "notice.copy")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "secondary",
						onClick: () => {
							const w = window.open("", "_blank");
							if (!w) return;
							w.document.write(`<pre style="font-family:Georgia,serif;white-space:pre-wrap;padding:32px;max-width:720px">${text.replaceAll("<", "<")}</pre>`);
							w.document.close();
							w.print();
						},
						children: t(lang, "notice.print")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => {
							const blob = new Blob([text], { type: "text/plain" });
							const a = document.createElement("a");
							a.href = URL.createObjectURL(blob);
							a.download = `${noticeId(trace.caseId ?? "NA", endpoint.wallet)}.txt`;
							a.click();
						},
						children: "Download .txt"
					})
				]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "rounded-xl bg-surface-2 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "text-sm font-medium",
					children: t(lang, "notice.sahyog")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted",
					children: "Drop this JSON on the SAHYOG connector. Same payload, machine-readable."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "mt-3 overflow-x-auto font-mono text-[10px] leading-relaxed text-muted",
					children: JSON.stringify(payload, null, 2)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					className: "mt-2",
					onClick: async () => {
						await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
						toast("SAHYOG payload copied");
					},
					children: "Copy JSON"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					className: "mt-2 w-full",
					onClick: async () => {
						const id = noticeId(trace.caseId ?? "NA", endpoint.wallet);
						queueDispatch({
							id,
							complaintId: trace.caseId ?? "UNATTACHED",
							vaspName: endpoint.entity,
							wallet: endpoint.wallet,
							payload
						});
						await logAction(endpoint.wallet, `SAHYOG freeze queued ${id}`);
						toast("Queued on SAHYOG outbox — check NCRP / SAHYOG");
					},
					children: "Queue on SAHYOG"
				}),
				KNOWN_VASPS[endpoint.wallet] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-xs text-subtle",
					children: [
						"Nodal: ",
						KNOWN_VASPS[endpoint.wallet].nodal,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						KNOWN_VASPS[endpoint.wallet].contact
					]
				}) : null
			]
		})]
	});
}
function Progress({ value, className, tone = "ok" }) {
	const color = tone === "danger" ? "bg-danger" : tone === "warn" ? "bg-warn" : tone === "info" ? "bg-info" : "bg-ok";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-2", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("h-full rounded-full", color),
			style: { width: `${Math.max(0, Math.min(100, value))}%` }
		})
	});
}
var Tabs = Root2;
function TabsList({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
		className: cn("flex flex-wrap gap-1 rounded-lg bg-surface-2 p-1", className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		className: cn("rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors", "data-[state=active]:bg-surface data-[state=active]:text-fg data-[state=active]:shadow-[var(--shadow-border)]", "hover:text-fg", className),
		...props
	});
}
function TabsContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
		className: cn("mt-4 outline-none", className),
		...props
	});
}
var generateOfficerBrief = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("84e3f85554505acf2d40e7ebe00a3fff5526fd2fa92e9265ba92a5781d12aef4"));
var PIPE = [
	"Screening OFAC / FIU-IND / NCRP repeat matches",
	"Walking outbound hops (cap 6) with cycle guard",
	"Attributing VASP clusters and co-spent inputs",
	"Inspecting bridges for destination-chain recipients",
	"Correlating wallets against other NCRP complaints",
	"Valuing recoverable INR at Indian VASPs"
];
function TracePage() {
	const search = Route$1.useSearch();
	const lang = useGaruda((s) => s.lang);
	const officerId = useGaruda((s) => s.officerId);
	const setOfficerId = useGaruda((s) => s.setOfficerId);
	const addressMode = useGaruda((s) => s.addressMode);
	const setAddressMode = useGaruda((s) => s.setAddressMode);
	const lastTrace = useGaruda((s) => s.lastTrace);
	const setTrace = useGaruda((s) => s.setTrace);
	const logAction = useGaruda((s) => s.logAction);
	const [wallet, setWallet] = (0, import_react.useState)(search.wallet ?? "0xSuspect_Burner_Wallet_A");
	const [caseId, setCaseId] = (0, import_react.useState)(search.caseId ?? "NCRP-2026-1001");
	const [source, setSource] = (0, import_react.useState)("sim");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [step, setStep] = (0, import_react.useState)(0);
	const [brief, setBrief] = (0, import_react.useState)(null);
	const [briefing, setBriefing] = (0, import_react.useState)(false);
	const autoRan = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (search.wallet) setWallet(search.wallet);
		if (search.caseId) setCaseId(search.caseId);
	}, [search.wallet, search.caseId]);
	(0, import_react.useEffect)(() => {
		if (search.run === "1" && search.wallet && !autoRan.current) {
			autoRan.current = true;
			execute(search.wallet, search.caseId, "sim");
		}
	}, [
		search.run,
		search.wallet,
		search.caseId
	]);
	async function execute(w = wallet, cid = caseId, src = source) {
		setBusy(true);
		setBrief(null);
		setStep(0);
		for (let i = 0; i < PIPE.length; i++) {
			setStep(i + 1);
			await new Promise((r) => setTimeout(r, 220));
		}
		let extra;
		let mode = "simulated";
		if (src !== "sim") {
			const chain = src === "btc" ? "bitcoin" : src === "tron" ? "tron" : src === "auto" ? detectChain(w) : "ethereum";
			const live = await fetchLiveHops({ data: {
				address: w,
				chain,
				walk: true
			} });
			if (live.status === "SUCCESS" && (live.hops.length || Object.keys(live.ledger).length)) {
				extra = live.ledger;
				mode = "live";
				toast(`Live ${live.chain} ledger: ${live.hops.length} outbound hops (indexed)`);
			} else toast(live.status === "RATE_LIMITED" ? "Live API rate-limited — using simulated ledger" : "Live lookup empty — using simulated ledger");
		}
		const result = runTrace(w, {
			caseId: cid || void 0,
			extraLedger: extra,
			mode
		});
		setTrace(result);
		await logAction(w, `Trace ${cid || "unattached"} via ${mode} ledger`);
		setBusy(false);
	}
	const trace = lastTrace;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl md:text-4xl",
				children: t(lang, "trace.title")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm text-muted",
				children: t(lang, "trace.hint")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "officer",
							children: t(lang, "trace.officer")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "officer",
							value: officerId,
							onChange: (e) => setOfficerId(e.target.value)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "wallet",
								children: t(lang, "trace.wallet")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "wallet",
								value: wallet,
								onChange: (e) => setWallet(e.target.value),
								className: "font-mono"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "case",
								children: "NCRP complaint"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								id: "case",
								value: caseId,
								onChange: (e) => {
									const id = e.target.value;
									setCaseId(id);
									const c = COMPLAINTS.find((x) => x.id === id);
									if (c) setWallet(c.victimWallet);
								},
								className: "flex h-11 w-full rounded-md border border-border bg-bg px-3 text-sm",
								children: [COMPLAINTS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: c.id,
									children: [
										c.id,
										" · ",
										c.victimWallet
									]
								}, c.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Unattached / custom"
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "src",
								children: t(lang, "trace.source")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								id: "src",
								value: source,
								onChange: (e) => setSource(e.target.value),
								className: "flex h-11 w-full rounded-md border border-border bg-bg px-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "sim",
										children: t(lang, "trace.sim")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "auto",
										children: t(lang, "trace.auto")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "eth",
										children: t(lang, "trace.eth")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "btc",
										children: t(lang, "trace.btc")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "tron",
										children: t(lang, "trace.tron")
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "w-full md:w-auto",
								disabled: busy,
								onClick: () => void execute(),
								children: t(lang, "trace.run")
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: cn("h-9 rounded-md px-3 text-xs", addressMode === "label" ? "bg-surface-2 text-fg" : "text-muted"),
							onClick: () => setAddressMode("label"),
							children: t(lang, "trace.labels")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: cn("h-9 rounded-md px-3 text-xs", addressMode === "hex" ? "bg-surface-2 text-fg" : "text-muted"),
							onClick: () => setAddressMode("hex"),
							children: t(lang, "trace.hex")
						})]
					}),
					busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: step / PIPE.length * 100,
							tone: "info"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: PIPE[Math.max(0, step - 1)]
						})]
					}) : null
				]
			}),
			!trace && !busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm text-muted",
				children: t(lang, "empty.trace")
			}) : null,
			trace ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Results, {
				trace,
				brief,
				setBrief,
				briefing,
				setBriefing
			}) : null
		]
	});
}
function Results({ trace, brief, setBrief, briefing, setBriefing }) {
	const lang = useGaruda((s) => s.lang);
	const mode = useGaruda((s) => s.addressMode);
	const exchanges = trace.endpoints.filter((e) => e.kind === "vasp").length;
	const top = trace.endpoints[0];
	const tone = top ? riskTone(top.risk) : "ok";
	const riskKey = tone === "danger" ? "risk.high" : tone === "warn" ? "risk.med" : "risk.low";
	const total = trace.recoverableUsdt + trace.atRiskUsdt + trace.lostUsdt || 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8 animate-fade-up",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("rounded-xl border-l-4 p-5", tone === "danger" && "border-danger bg-danger/10", tone === "warn" && "border-warn bg-warn/10", tone === "ok" && "border-ok bg-ok/10"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: t(lang, riskKey)
				}), top ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm leading-relaxed",
					children: [
						"Money reached ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: top.entity }),
						" (",
						top.risk,
						"/100, ",
						top.hops,
						" hops). Recoverable at Indian VASPs: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: usdt(trace.recoverableUsdt) }),
						" ≈ ",
						inr(trace.recoverableUsdt),
						". Mixer / sanctioned:",
						" ",
						usdt(trace.lostUsdt),
						"."
					]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-3 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: t(lang, "res.wallets"),
						value: String(trace.nodes.length)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: t(lang, "res.exchanges"),
						value: String(exchanges)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: t(lang, "res.patterns"),
						value: String(trace.typologies.length)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: t(lang, "res.bridges"),
						value: String(trace.bridges.length)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid gap-3 md:grid-cols-3",
				children: trace.recovery.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted",
							children: s.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("mt-1 font-serif text-xl tabular-nums", s.tone === "ok" && "text-ok", s.tone === "warn" && "text-warn", s.tone === "danger" && "text-danger", s.tone === "muted" && "text-muted"),
							children: usdt(s.usdt)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-subtle",
							children: inr(s.usdt)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							className: "mt-2",
							value: s.usdt / total * 100,
							tone: s.tone === "muted" ? "info" : s.tone
						})
					]
				}, s.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-5 space-y-2",
				children: trace.recommendations.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							tone: r.priority === 1 ? "danger" : r.priority === 2 ? "warn" : "info",
							children: ["P", r.priority]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium",
							children: r.title
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: r.detail
					})]
				}, r.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "secondary",
					disabled: briefing,
					onClick: async () => {
						setBriefing(true);
						setBrief((await generateOfficerBrief({ data: {
							trace,
							lang
						} })).text);
						setBriefing(false);
					},
					children: briefing ? t(lang, "brief.working") : t(lang, "brief.cta")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dossier",
						children: t(lang, "dossier")
					})
				})]
			}),
			brief ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-medium",
					children: "Officer briefing"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted",
					children: brief
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "summary",
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "summary",
							children: t(lang, "tab.summary")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "graph",
							children: t(lang, "tab.graph")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "landed",
							children: t(lang, "tab.landed")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "related",
							children: t(lang, "tab.related")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "notice",
							children: t(lang, "tab.notice")
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "summary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-3",
								children: trace.endpoints.slice(0, 6).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium",
													children: e.entity
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
													tone: riskTone(e.risk),
													children: [e.risk, "/100"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-muted",
													children: e.chainHint
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 font-mono text-xs text-subtle",
											children: [
												displayAddress(e.wallet, mode),
												" · ",
												e.hops,
												" hops · ",
												usdt(e.amountUsdt)
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-muted",
											children: explainRisk(e).join(" ")
										})
									]
								}, e.wallet))
							}),
							trace.typologies.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 space-y-2",
								children: trace.typologies.map((ty) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-warn/30 bg-warn/10 p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-medium",
											children: ty.typology
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm text-muted",
											children: ty.description
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-sm",
											children: ty.officerNote
										})
									]
								}, ty.typology + ty.node))
							}) : null,
							trace.classified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "mt-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted",
										children: "Auto-classified typology"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 text-sm font-medium",
										children: [
											trace.classified.id.replace("_", " "),
											" · ",
											trace.classified.confidence,
											"%"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-2 list-disc space-y-1 pl-5 text-sm text-muted",
										children: trace.classified.reasons.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: r }, r))
									})
								]
							}) : null,
							trace.contractHits?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "mt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted",
									children: "Mixer / DeFi contracts on this walk"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-2 space-y-1 text-sm",
									children: trace.contractHits.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											tone: h.kind === "mixer" ? "danger" : "info",
											children: h.kind
										}),
										" ",
										h.label
									] }, h.node))
								})]
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "graph",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HopGraph, { trace })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "landed",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "text-xs tracking-wide text-muted uppercase",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-2 pr-3",
											children: "Entity"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-2 pr-3",
											children: "Wallet"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-2 pr-3",
											children: "Hops"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-2 pr-3",
											children: "Value"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-2",
											children: "Risk"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: trace.endpoints.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t border-border",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 pr-3",
											children: e.entity
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 pr-3 font-mono text-xs",
											children: displayAddress(e.wallet, mode)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 pr-3 tabular-nums",
											children: e.hops
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 pr-3 tabular-nums",
											children: usdt(e.amountUsdt)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												tone: riskTone(e.risk),
												children: e.risk
											})
										})
									]
								}, e.wallet)) })]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "related",
						children: [
							trace.clusters.length ? trace.clusters.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: c.attributed
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
									className: "mt-2 font-mono text-xs text-muted",
									children: c.wallets.map((w) => displayAddress(w, mode)).join("\n")
								})]
							}, c.root)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "No co-spend clusters on this walk."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-6 text-sm font-medium",
								children: "Cross-chain"
							}),
							trace.bridges.length ? trace.bridges.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-muted",
								children: [
									b.bridge,
									": ",
									b.amount,
									" ",
									b.sourceAsset,
									" → ",
									b.targetNetwork,
									" (",
									b.targetRecipient,
									")"
								]
							}, b.bridge)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: "No bridge events."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-6 text-sm font-medium",
								children: "Other NCRP complaints sharing wallets"
							}),
							trace.correlations.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 space-y-2",
								children: trace.correlations.slice(0, 6).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs",
										children: displayAddress(c.wallet, mode)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted",
										children: [
											" · ",
											c.complaintIds.join(", "),
											" — ",
											c.note
										]
									})]
								}, c.wallet))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: "No overlap with other queued complaints."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "notice",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FreezePanel, { trace })
					})
				]
			})
		]
	});
}
function Kpi({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 font-serif text-2xl tabular-nums",
			children: value
		})]
	});
}
//#endregion
export { TracePage as component };
