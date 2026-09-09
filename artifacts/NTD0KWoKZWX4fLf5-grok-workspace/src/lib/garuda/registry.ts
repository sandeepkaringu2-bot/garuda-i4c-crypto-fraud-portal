import type { BridgeEvent, Complaint, TxHop, VaspRecord } from "./types";

export const KNOWN_VASPS: Record<string, VaspRecord> = {
  "0xWazirXInboundClusterA2": {
    id: "0xWazirXInboundClusterA2",
    name: "WazirX India",
    kind: "vasp",
    jurisdiction: "India",
    fiuRegistered: true,
    nodal: "Nodal Compliance Officer, WazirX",
    contact: "compliance@wazirx.com",
    freezeSlaHours: 6,
    notes: "FIU-IND registered. INR rails via partner banks. Highest-leverage freeze target for Indian victims.",
  },
  "0xCoinDCXReceivingWallet": {
    id: "0xCoinDCXReceivingWallet",
    name: "CoinDCX",
    kind: "vasp",
    jurisdiction: "India",
    fiuRegistered: true,
    nodal: "Nodal Officer, CoinDCX",
    contact: "compliance@coindcx.com",
    freezeSlaHours: 6,
    notes: "Large Indian VASP. Fast SAHYOG response on documented NCRP cases.",
  },
  "0xTarget_Ethereum_Offramp_Wallet": {
    id: "0xTarget_Ethereum_Offramp_Wallet",
    name: "CoinDCX Corporate Cashout Node",
    kind: "vasp",
    jurisdiction: "India",
    fiuRegistered: true,
    nodal: "Nodal Officer, CoinDCX",
    contact: "compliance@coindcx.com",
    freezeSlaHours: 6,
    notes: "Attributed offramp cluster. Treat as CoinDCX deposit for freeze purposes.",
  },
  "0xBinanceDepositHotWalletX901": {
    id: "0xBinanceDepositHotWalletX901",
    name: "Binance International",
    kind: "vasp",
    jurisdiction: "International",
    fiuRegistered: false,
    nodal: "Binance LEA Portal",
    contact: "lawenforcement@binance.com",
    freezeSlaHours: 48,
    notes: "Foreign VASP. Use LEA portal + MLAT if INR recovery is required. Still worth an immediate freeze request.",
  },
  "0xZebpay_Deposit_Cluster": {
    id: "0xZebpay_Deposit_Cluster",
    name: "ZebPay India",
    kind: "vasp",
    jurisdiction: "India",
    fiuRegistered: true,
    nodal: "Nodal Officer, ZebPay",
    contact: "compliance@zebpay.com",
    freezeSlaHours: 8,
    notes: "FIU-IND registered Indian exchange.",
  },
  "0xUnocoin_Receiving_Node": {
    id: "0xUnocoin_Receiving_Node",
    name: "Unocoin",
    kind: "vasp",
    jurisdiction: "India",
    fiuRegistered: true,
    nodal: "Nodal Officer, Unocoin",
    contact: "legal@unocoin.com",
    freezeSlaHours: 8,
    notes: "FIU-IND registered. Bengaluru-based.",
  },
  "0xTornadoCashMixerRouter": {
    id: "0xTornadoCashMixerRouter",
    name: "Tornado Cash",
    kind: "mixer",
    jurisdiction: "Sanctioned",
    fiuRegistered: false,
    nodal: "OFAC SDN",
    contact: "—",
    freezeSlaHours: 0,
    notes: "OFAC-sanctioned mixer. Funds entering here are treated as lost for victim recovery. Preserve pre-mix hops.",
  },
  "0xBridgeRouter_FixedFloat": {
    id: "0xBridgeRouter_FixedFloat",
    name: "FixedFloat",
    kind: "bridge",
    jurisdiction: "No-KYC swap",
    fiuRegistered: false,
    nodal: "Uncooperative swap desk",
    contact: "—",
    freezeSlaHours: 0,
    notes: "No-KYC cross-chain swap. Trace the destination recipient — that is where a freeze may still land.",
  },
};

export const DIRECTORY: VaspRecord[] = [
  ...Object.values(KNOWN_VASPS),
  {
    id: "giottus",
    name: "Giottus",
    kind: "vasp",
    jurisdiction: "India",
    fiuRegistered: true,
    nodal: "Nodal Officer, Giottus",
    contact: "compliance@giottus.com",
    freezeSlaHours: 8,
    notes: "FIU-IND registered Indian VASP.",
  },
  {
    id: "coinswitch",
    name: "CoinSwitch",
    kind: "vasp",
    jurisdiction: "India",
    fiuRegistered: true,
    nodal: "Nodal Officer, CoinSwitch",
    contact: "legal@coinswitch.co",
    freezeSlaHours: 8,
    notes: "FIU-IND registered. High retail volume.",
  },
  {
    id: "bitbns",
    name: "Bitbns",
    kind: "vasp",
    jurisdiction: "India",
    fiuRegistered: true,
    nodal: "Nodal Officer, Bitbns",
    contact: "compliance@bitbns.com",
    freezeSlaHours: 12,
    notes: "FIU-IND registered.",
  },
  {
    id: "okx",
    name: "OKX",
    kind: "vasp",
    jurisdiction: "International",
    fiuRegistered: false,
    nodal: "OKX LEA desk",
    contact: "lawenforcement@okx.com",
    freezeSlaHours: 48,
    notes: "Foreign VASP. LEA portal available.",
  },
  {
    id: "bybit",
    name: "Bybit",
    kind: "vasp",
    jurisdiction: "International",
    fiuRegistered: false,
    nodal: "Bybit LEA desk",
    contact: "lawenforcement@bybit.com",
    freezeSlaHours: 48,
    notes: "Foreign VASP.",
  },
];

export const SANCTIONS: Record<
  string,
  { source: string; reason: string; severity: "CRITICAL" | "HIGH"; terminal: boolean }
> = {
  "0xTornadoCashMixerRouter": {
    source: "OFAC SDN List",
    reason: "Sanctioned mixer used to break chain-of-custody of stolen assets",
    severity: "CRITICAL",
    terminal: true,
  },
  "0xOffshore_Mixer_Node": {
    source: "FIU-IND Cyber Threat Alert",
    reason: "Ransomware cash-out terminal observed across multiple I4C cases",
    severity: "CRITICAL",
    terminal: true,
  },
  "0xScam_Collection_TRON": {
    source: "NCRP repeat-match",
    reason: "Active phishing / investment-scam collection node on TRON",
    severity: "HIGH",
    terminal: false,
  },
};

export const BRIDGES: Record<string, string> = {
  "0xBridgeRouter_FixedFloat": "FixedFloat Cross-Chain Protocol",
  "0xBridgeRouter_ChangeNOW": "ChangeNOW Liquidity Bridge",
  "0xBridgeRouter_Thorchain": "Thorchain Decentralized Vault",
};

export const BRIDGE_EVENTS: Record<string, BridgeEvent> = {
  "0xBridgeRouter_FixedFloat": {
    bridge: "FixedFloat Cross-Chain Protocol",
    sourceAsset: "USDT (TRON)",
    amount: 10000,
    targetNetwork: "Ethereum",
    targetAsset: "ETH",
    targetRecipient: "0xTarget_Ethereum_Offramp_Wallet",
  },
  "0xBridgeRouter_ChangeNOW": {
    bridge: "ChangeNOW Liquidity Bridge",
    sourceAsset: "USDC (Ethereum)",
    amount: 5500,
    targetNetwork: "Bitcoin",
    targetAsset: "BTC",
    targetRecipient: "bc1q_suspect_bitcoin_endpoint",
  },
};

export const LEDGER: Record<string, TxHop[]> = {
  "0xSuspect_Burner_Wallet_A": [
    { to: "0xLayering_Wallet_B", amount: 5000, token: "USDT", txid: "0xab12a91c", timestamp: "2026-09-08T12:10:00+05:30", chain: "ethereum" },
    { to: "0xLayering_Wallet_C", amount: 2500, token: "USDT", txid: "0xef5633b0", timestamp: "2026-09-08T12:14:00+05:30", chain: "ethereum" },
    { to: "0xBridgeRouter_FixedFloat", amount: 10000, token: "USDT", txid: "0xcc91f001", timestamp: "2026-09-08T12:18:00+05:30", chain: "ethereum" },
  ],
  "0xLayering_Wallet_B": [
    { to: "0xLayering_Wallet_D", amount: 4900, token: "USDT", txid: "0xij9012kl", timestamp: "2026-09-08T13:02:00+05:30", chain: "ethereum" },
    { to: "0xTornadoCashMixerRouter", amount: 4900, token: "USDT", txid: "0xmn3456op", timestamp: "2026-09-08T13:05:00+05:30", chain: "ethereum" },
  ],
  "0xLayering_Wallet_C": [
    { to: "0xSuspect_Intermediary_X1", amount: 2450, token: "USDT", txid: "0xqa88c201", timestamp: "2026-09-08T13:20:00+05:30", chain: "ethereum" },
  ],
  "0xLayering_Wallet_D": [
    { to: "0xWazirXInboundClusterA2", amount: 4800, token: "USDT", txid: "0xqr7890st", timestamp: "2026-09-08T14:11:00+05:30", chain: "ethereum" },
  ],
  "0xSuspect_Intermediary_X1": [
    { to: "0xCoinDCXReceivingWallet", amount: 1250, token: "USDT", txid: "0xdcx11aa", timestamp: "2026-09-08T14:40:00+05:30", chain: "ethereum" },
    { to: "0xBinanceDepositHotWalletX901", amount: 1200, token: "USDT", txid: "0xbnx22bb", timestamp: "2026-09-08T14:41:00+05:30", chain: "ethereum" },
  ],
  "0xScam_Collection_TRON": [
    { to: "0xBridgeRouter_FixedFloat", amount: 12000, token: "USDT", txid: "TRON_TX_7701", timestamp: "2026-09-07T03:12:00+05:30", chain: "tron" },
  ],
  "0xLayering_Wallet_X": [
    { to: "0xCoinDCXReceivingWallet", amount: 2450, token: "USDT", txid: "0xlayx09", timestamp: "2026-09-07T18:00:00+05:30", chain: "ethereum" },
  ],
  "0xOffshore_Mixer_Node": [
    { to: "0xTornadoCashMixerRouter", amount: 7000, token: "USDT", txid: "0xoffmix1", timestamp: "2026-09-07T19:12:00+05:30", chain: "ethereum" },
  ],
};

export const CO_SPEND = [
  {
    txid: "tx_01",
    inputs: ["0xSuspect_Burner_Wallet_A", "0xSuspect_Intermediary_X1"],
    outputs: ["0xLayering_Wallet_B"],
  },
  {
    txid: "tx_02",
    inputs: ["0xSuspect_Intermediary_X1", "0xBinanceDepositHotWalletX901"],
    outputs: ["0xOutbound_Node"],
  },
];

export const COMPLAINTS: Complaint[] = [
  {
    id: "NCRP-2026-1001",
    typology: "investment_scam",
    victimWallet: "0xSuspect_Burner_Wallet_A",
    amountUsdt: 17500,
    hoursAgo: 6,
    state: "Maharashtra",
    brief: "Victim sent USDT after a fake trading-desk app promised 18% monthly returns. Funds left a burner within 40 minutes.",
  },
  {
    id: "NCRP-2026-1002",
    typology: "sextortion",
    victimWallet: "0xLayering_Wallet_B",
    amountUsdt: 9800,
    hoursAgo: 30,
    state: "Karnataka",
    brief: "Video-call extortion. Suspect instructed payment in USDT to a layering wallet that also appears in 1001.",
  },
  {
    id: "NCRP-2026-1003",
    typology: "ransomware",
    victimWallet: "0xScam_Collection_TRON",
    amountUsdt: 12000,
    hoursAgo: 46,
    state: "Delhi",
    brief: "Hospital billing system locked. Ransom demanded in USDT-TRC20, then bridged off TRON.",
  },
];

export const TYPOLOGY_LABEL: Record<Complaint["typology"], { en: string; hi: string }> = {
  investment_scam: { en: "Investment scam", hi: "निवेश धोखाधड़ी" },
  sextortion: { en: "Sextortion", hi: "सेक्सटॉर्शन" },
  ransomware: { en: "Ransomware", hi: "रैनसमवेयर" },
  phishing: { en: "Phishing", hi: "फिशिंग" },
  task_fraud: { en: "Task-based fraud", hi: "टास्क फ्रॉड" },
  darknet: { en: "Darknet", hi: "डार्कनेट" },
};

export const ENTITY_LABELS: Record<string, string> = {
  "0xSuspect_Burner_Wallet_A": "Suspect burner A",
  "0xLayering_Wallet_B": "Layering wallet B",
  "0xLayering_Wallet_C": "Layering wallet C",
  "0xLayering_Wallet_D": "Layering wallet D",
  "0xSuspect_Intermediary_X1": "Intermediary X1",
  "0xScam_Collection_TRON": "TRON collection node",
  "0xLayering_Wallet_X": "Layering wallet X",
  "0xOffshore_Mixer_Node": "Offshore mixer node",
  "0xWazirXInboundClusterA2": "WazirX inbound cluster",
  "0xCoinDCXReceivingWallet": "CoinDCX receiving wallet",
  "0xBinanceDepositHotWalletX901": "Binance deposit hot wallet",
  "0xTornadoCashMixerRouter": "Tornado Cash router",
  "0xBridgeRouter_FixedFloat": "FixedFloat router",
  "0xTarget_Ethereum_Offramp_Wallet": "CoinDCX ETH offramp",
};

export const MAX_HOPS = 6;
