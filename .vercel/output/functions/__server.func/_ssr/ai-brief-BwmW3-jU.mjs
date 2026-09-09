import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { c as usdt, r as inr } from "./format-C_pSLqHG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-brief-BwmW3-jU.js
function fallbackBrief(trace, lang) {
	const top = trace.endpoints[0];
	const indian = trace.endpoints.filter((e) => e.recoverable);
	const names = indian.map((e) => `${e.entity} (${usdt(e.amountUsdt)})`).join(", ");
	if (lang === "hi") return [
		`मामला ${trace.caseId ?? "अनअटैच्ड"} — वॉलेट ${trace.source} से ${trace.nodes.length} नोड तक ट्रैक हुआ।`,
		top ? `सबसे ऊँचा जोखिम: ${top.entity} (${top.risk}/100, ${top.hops} hop).` : "कोई स्पष्ट पड़ाव नहीं मिला।",
		indian.length ? `भारतीय वीएएसपी पर पुनःप्राप्य अनुमान: ${usdt(trace.recoverableUsdt)} ≈ ${inr(trace.recoverableUsdt)}. लक्ष्य: ${names}.` : "इस ग्राफ में भारतीय वीएएसपी सिंक नहीं मिला।",
		trace.lostUsdt > 0 ? `${usdt(trace.lostUsdt)} मिक्सर / प्रतिबंधित रूट में गया — पीड़ित भुगतान के लिए इसे खोया मानें।` : "",
		"अगला कदम: भारतीय वीएएसपी को सहयोग फ्रीज नोटिस भेजें, प्री-मिक्स hops को साक्ष्य में बाँधें, और साझा वॉलेट वाले अन्य एनसीआरपी से जोड़ें।"
	].filter(Boolean).join("\n\n");
	return [
		`Case ${trace.caseId ?? "unattached"} — walked ${trace.nodes.length} wallets from ${trace.source}.`,
		top ? `Highest-risk sink: ${top.entity} (${top.risk}/100, ${top.hops} hop${top.hops === 1 ? "" : "s"}).` : "No clear custodial sink inside the hop budget.",
		indian.length ? `Recoverable at Indian VASPs: ${usdt(trace.recoverableUsdt)} ≈ ${inr(trace.recoverableUsdt)}. Targets: ${names}.` : "No Indian VASP sink in this graph.",
		trace.lostUsdt > 0 ? `${usdt(trace.lostUsdt)} entered a mixer or sanctioned router — treat as unrecoverable for victim payout.` : "",
		"Next: serve a SAHYOG freeze on every Indian VASP in the graph, bag the pre-mixer hops as evidence, and merge any NCRP complaints that share these wallets."
	].filter(Boolean).join("\n\n");
}
var generateOfficerBrief_createServerFn_handler = createServerRpc({
	id: "84e3f85554505acf2d40e7ebe00a3fff5526fd2fa92e9265ba92a5781d12aef4",
	name: "generateOfficerBrief",
	filename: "src/lib/garuda/ai-brief.ts"
}, (opts) => generateOfficerBrief.__executeServer(opts));
var generateOfficerBrief = createServerFn({ method: "POST" }).validator((data) => data).handler(generateOfficerBrief_createServerFn_handler, async ({ data }) => {
	const { trace, lang } = data;
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: true,
		text: fallbackBrief(trace, lang),
		source: "local"
	};
	const compact = {
		source: trace.source,
		caseId: trace.caseId,
		endpoints: trace.endpoints.slice(0, 6),
		typologies: trace.typologies,
		correlations: trace.correlations.slice(0, 4),
		recovery: {
			recoverableUsdt: trace.recoverableUsdt,
			atRiskUsdt: trace.atRiskUsdt,
			lostUsdt: trace.lostUsdt
		},
		recommendations: trace.recommendations
	};
	try {
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "grok-4.5",
				max_tokens: 500,
				messages: [{
					role: "system",
					content: lang === "hi" ? "आप I4C के वरिष्ठ अन्वेषक हैं। 180-220 शब्दों में औपचारिक हिंदी में ब्रिफिंग लिखें। गालियाँ/इमोजी नहीं। तीन स्पष्ट अगले कदम दें। रुपये में मूल्य बताएँ (1 USDT ≈ ₹88)।" : "You are a senior I4C investigator briefing a station-house officer who is not a blockchain specialist. 180-220 words, plain English, no jargon without a one-line gloss, no emoji. Give three numbered next actions. Quote value in INR (1 USDT ≈ ₹88) and USDT."
				}, {
					role: "user",
					content: JSON.stringify(compact)
				}]
			})
		});
		if (!res.ok) return {
			ok: true,
			text: fallbackBrief(trace, lang),
			source: "local"
		};
		const text = (await res.json()).choices[0]?.message.content?.trim();
		if (!text) return {
			ok: true,
			text: fallbackBrief(trace, lang),
			source: "local"
		};
		return {
			ok: true,
			text,
			source: "grok"
		};
	} catch {
		return {
			ok: true,
			text: fallbackBrief(trace, lang),
			source: "local"
		};
	}
});
//#endregion
export { generateOfficerBrief_createServerFn_handler };
