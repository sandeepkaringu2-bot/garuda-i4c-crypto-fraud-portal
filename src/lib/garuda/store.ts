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
  dispatches: import("./types").SahyogDispatch[];
  setLang: (lang: Lang) => void;
  setOfficerId: (id: string) => void;
  setAddressMode: (m: AddressMode) => void;
  setTrace: (t: TraceResult | null) => void;
  logAction: (target: string, summary: string) => Promise<void>;
  addComplaint: (c: GarudaState["extraComplaints"][number]) => void;
  queueDispatch: (d: Omit<import("./types").SahyogDispatch, "at" | "status"> & { status?: import("./types").SahyogDispatch["status"] }) => void;
  ackDispatch: (id: string) => void;
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
      dispatches: [],
      setLang: (lang) => set({ lang }),
      setOfficerId: (officerId) => set({ officerId }),
      setAddressMode: (addressMode) => set({ addressMode }),
      setTrace: (lastTrace) => set({ lastTrace }),
      addComplaint: (c) => set({ extraComplaints: [c, ...get().extraComplaints].slice(0, 20) }),
      queueDispatch: (d) =>
        set({
          dispatches: [
            { ...d, status: d.status ?? "queued", at: Date.now() },
            ...get().dispatches,
          ].slice(0, 40),
        }),
      ackDispatch: (id) =>
        set({
          dispatches: get().dispatches.map((x) => (x.id === id ? { ...x, status: "acknowledged" } : x)),
        }),
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
        dispatches: s.dispatches,
      }),
    },
  ),
);
