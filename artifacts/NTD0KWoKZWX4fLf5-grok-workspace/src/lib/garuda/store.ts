import { create } from "zustand";
import { persist } from "zustand/middleware";
import { sha256 } from "./format";
import type { AddressMode, AuditEntry, Lang, TraceResult } from "./types";

interface GarudaState {
  lang: Lang;
  officerId: string;
  addressMode: AddressMode;
  lastTrace: TraceResult | null;
  audit: AuditEntry[];
  extraComplaints: { id: string; wallet: string; amountUsdt: number; typology: string }[];
  setLang: (lang: Lang) => void;
  setOfficerId: (id: string) => void;
  setAddressMode: (m: AddressMode) => void;
  setTrace: (t: TraceResult | null) => void;
  logAction: (target: string, summary: string) => Promise<void>;
  addComplaint: (c: GarudaState["extraComplaints"][number]) => void;
}

const GENESIS = "GENESIS_INITIAL_LOG_NODE";

export const useGaruda = create<GarudaState>()(
  persist(
    (set, get) => ({
      lang: "en",
      officerId: "I4C-OFFICER-402",
      addressMode: "label",
      lastTrace: null,
      audit: [],
      extraComplaints: [],
      setLang: (lang) => set({ lang }),
      setOfficerId: (officerId) => set({ officerId }),
      setAddressMode: (addressMode) => set({ addressMode }),
      setTrace: (lastTrace) => set({ lastTrace }),
      addComplaint: (c) => set({ extraComplaints: [c, ...get().extraComplaints].slice(0, 20) }),
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
          previousHash,
        });
        const hash = await sha256(payload);
        const entry: AuditEntry = {
          index,
          timestamp,
          officerId,
          target,
          summary,
          previousHash,
          hash,
        };
        set({ audit: [...prev, entry] });
      },
    }),
    {
      name: "garuda-i4c",
      partialize: (s) => ({
        lang: s.lang,
        officerId: s.officerId,
        addressMode: s.addressMode,
        audit: s.audit,
        extraComplaints: s.extraComplaints,
      }),
    },
  ),
);
