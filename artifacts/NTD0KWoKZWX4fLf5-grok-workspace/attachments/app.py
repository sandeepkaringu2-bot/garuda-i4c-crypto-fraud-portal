import streamlit as st
import networkx as nx
import matplotlib.pyplot as plt
import pandas as pd
import time
import os
import json

from forensic_intelligence import GarudaForensicEngine
from clustering_engine import HeuristicClusterEngine
from cross_chain_tracker import CrossChainBridgeTracker
from multi_chain_sync import MultiChainSyncEngine
from audit_logger import ForensicAuditLogger
from web3_api_engine import BlockscoutForensicEngine
from bitcoin_api_engine import BlockchairForensicEngine
from threat_intel import ThreatIntelEngine

# ==========================================
# PAGE CONFIG
# ==========================================
st.set_page_config(page_title="I4C Crypto Fraud Analytics Portal", layout="wide", page_icon="🛡️")

# ==========================================
# ENGINE INITIALIZATION
# ==========================================
forensic_core = GarudaForensicEngine()
cluster_core = HeuristicClusterEngine()
bridge_core = CrossChainBridgeTracker()
sync_core = MultiChainSyncEngine()
audit_core = ForensicAuditLogger()
web3_core = BlockscoutForensicEngine()
bitcoin_core = BlockchairForensicEngine()
threat_core = ThreatIntelEngine()

# ==========================================
# GLOBAL UI STYLING (Final polished version)
# ==========================================
st.markdown(
    """
    <style>
    /* ========== BASE ========== */
    .stApp {
        background-color: #F1F5F9 !important;
        color: #0F172A !important;
    }

    h1, h2, h3, h4 {
        color: #0F172A !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        font-weight: 700 !important;
    }

    p, span, label, div {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    }

    /* ========== SIDEBAR ========== */
    section[data-testid="stSidebar"] {
        background-color: #0F172A !important;
        border-right: 1px solid #1E293B !important;
    }
    section[data-testid="stSidebar"] * {
        color: #F8FAFC !important;
    }

    /* ========== INPUTS ========== */
    div[data-baseweb="input"] input,
    div[data-baseweb="select"] div,
    input[type="text"] {
        background-color: #FFFFFF !important;
        color: #0F172A !important;
        border: 1px solid #CBD5E1 !important;
        border-radius: 8px !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.04) !important;
    }

    /* ========== FILE UPLOADER ========== */
    div[data-testid="stFileUploader"] section {
        background-color: #FFFFFF !important;
        border: 2px dashed #94A3B8 !important;
        border-radius: 12px !important;
        padding: 20px !important;
    }

    /* ========== PRIMARY BUTTON (Start Tracking) ========== */
    div.stButton > button:first-child {
        background: linear-gradient(135deg, #1E40AF 0%, #1D4ED8 100%) !important;
        color: #FFFFFF !important;
        border-radius: 10px !important;
        border: none !important;
        padding: 14px 28px !important;
        font-weight: 600 !important;
        font-size: 16px !important;
        box-shadow: 0 4px 12px rgba(30, 64, 175, 0.25) !important;
        transition: all 0.2s ease !important;
    }
    div.stButton > button:first-child:hover {
        background: linear-gradient(135deg, #1D4ED8 0%, #1E3A8A 100%) !important;
        box-shadow: 0 6px 16px rgba(30, 64, 175, 0.35) !important;
        transform: translateY(-1px);
    }

    /* ========== DOWNLOAD BUTTON ========== */
    div.stDownloadButton > button {
        background: linear-gradient(135deg, #047857 0%, #059669 100%) !important;
        color: #FFFFFF !important;
        border-radius: 10px !important;
        border: none !important;
        padding: 14px 28px !important;
        font-weight: 600 !important;
        font-size: 15px !important;
        box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25) !important;
        transition: all 0.2s ease !important;
    }
    div.stDownloadButton > button:hover {
        background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
        box-shadow: 0 6px 16px rgba(5, 150, 105, 0.35) !important;
        transform: translateY(-1px);
    }

    /* ========== METRIC CARDS ========== */
    div[data-testid="stMetric"] {
        background: #FFFFFF !important;
        border: 1px solid #E2E8F0 !important;
        border-radius: 12px !important;
        padding: 16px 20px !important;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04) !important;
    }
    div[data-testid="stMetricValue"] {
        color: #1E40AF !important;
        font-weight: 700 !important;
        font-size: 26px !important;
    }
    div[data-testid="stMetricLabel"] {
        color: #64748B !important;
        font-size: 13px !important;
        font-weight: 500 !important;
    }

    /* ========== RISK BADGE ========== */
    .risk-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.85rem;
        color: white;
    }

    /* ========== INFO CARDS ========== */
    .info-card {
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        height: 100%;
    }

    /* ========== TABS ========== */
    button[data-baseweb="tab"] {
        font-weight: 600 !important;
        font-size: 14px !important;
        color: #475569 !important;
    }
    button[data-baseweb="tab"][aria-selected="true"] {
        color: #1E40AF !important;
    }

    /* ========== EXPANDER ========== */
    div[data-testid="stExpander"] {
        background: #FFFFFF !important;
        border: 1px solid #E2E8F0 !important;
        border-radius: 10px !important;
    }

    /* ========== SUCCESS / WARNING / INFO boxes ========== */
    div[data-testid="stAlert"] {
        border-radius: 10px !important;
    }
    </style>
    """,
    unsafe_allow_html=True
)

# ==========================================
# MOCK DATA REGISTRIES
# ==========================================
KNOWN_VASP_CLUSTERS = {
    "0xBinanceDepositHotWalletX901": {"name": "Binance International", "type": "VASP Exchange"},
    "0xWazirXInboundClusterA2": {"name": "WazirX India", "type": "VASP Exchange"},
    "0xCoinDCXReceivingWallet": {"name": "CoinDCX", "type": "VASP Exchange"},
    "0xTornadoCashMixerRouter": {"name": "Tornado Cash (Sanctioned)", "type": "Mixer / Privacy Router"},
    "0xTarget_Ethereum_Offramp_Wallet": {"name": "CoinDCX Corporate Cashout Node", "type": "VASP Exchange"},
    "0xZebpay_Deposit_Cluster": {"name": "ZebPay India", "type": "VASP Exchange"},
    "0xUnocoin_Receiving_Node": {"name": "Unocoin", "type": "VASP Exchange"}
}

BLOCKCHAIN_LEDGER = {
    # Main suspect starting point
    "0xSuspect_Burner_Wallet_A": [
        {"to": "0xLayering_Wallet_B", "amount": 5000},
        {"to": "0xLayering_Wallet_C", "amount": 2500},
        {"to": "0xBridgeRouter_FixedFloat", "amount": 10000}
    ],

    # Layering path 1
    "0xLayering_Wallet_B": [
        {"to": "0xLayering_Wallet_D", "amount": 4900},
        {"to": "0xTornadoCashMixerRouter", "amount": 4900}
    ],

    # Layering path 2
    "0xLayering_Wallet_C": [
        {"to": "0xSuspect_Intermediary_X1", "amount": 2450}
    ],

    # Goes to exchange
    "0xLayering_Wallet_D": [
        {"to": "0xWazirXInboundClusterA2", "amount": 4800}
    ],

    # Intermediary splits money
    "0xSuspect_Intermediary_X1": [
        {"to": "0xCoinDCXReceivingWallet", "amount": 1250},
        {"to": "0xBinanceDepositHotWalletX901", "amount": 1200}
    ],

    # Extra realistic paths
    "0xScam_Collection_TRON": [
        {"to": "0xBridgeRouter_FixedFloat", "amount": 12000}
    ],

    "0xLayering_Wallet_X": [
        {"to": "0xCoinDCXReceivingWallet", "amount": 2450}
    ],

    "0xOffshore_Mixer_Node": [
        {"to": "0xTornadoCashMixerRouter", "amount": 7000}
    ]
}

MOCK_BLOCK_LOGS = [
    {"txid": "tx_01", "inputs": ["0xSuspect_Burner_Wallet_A", "0xSuspect_Intermediary_X1"], "outputs": ["0xLayering_Wallet_B"]},
    {"txid": "tx_02", "inputs": ["0xSuspect_Intermediary_X1", "0xBinanceDepositHotWalletX901"], "outputs": ["0xOutbound_Node"]}
]

MAX_TRACE_HOPS = 6  # hard safety cap to prevent runaway/infinite recursion

# ==========================================
# HELPERS
# ==========================================
def risk_badge_html(score: int) -> str:
    """Returns a colored HTML badge for a given risk score (0-100)."""
    if score >= 70:
        color = "#DC2626"  # red
    elif score >= 30:
        color = "#D97706"  # amber
    else:
        color = "#16A34A"  # green
    return f'<span class="risk-badge" style="background-color:{color};">{score}/100</span>'


def short_addr(addr: str, length: int = 10) -> str:
    """Shortens a long wallet address for legible graph labels."""
    addr = str(addr)
    return addr if len(addr) <= length else addr[:length] + "…"

# ==========================================
# HEADER
# ==========================================
st.title("Crypto Fraud Tracking Portal")
st.caption("Indian Cyber Crime Coordination Centre (I4C) · Ministry of Home Affairs")

st.markdown(
    """
    <div style="background: #EFF6FF; border-left: 5px solid #1E40AF; 
                padding: 16px 20px; border-radius: 8px; margin: 16px 0 24px 0;">
        <p style="margin:0; font-size:15px; color:#0F172A; line-height:1.5;">
            <b>Simple steps:</b> Type or paste the wallet address given by the victim → 
            Click the blue button below → The system will automatically find where the money went 
            and tell you the exchange or platform that received it.
        </p>
    </div>
    """,
    unsafe_allow_html=True
)

# Three clear steps
col1, col2, col3 = st.columns(3)

with col1:
    st.markdown("""
    <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; 
                padding:18px 20px; min-height:130px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
        <div style="font-size:15px; font-weight:700; color:#1E40AF; margin-bottom:8px;">
            Step 1 — Enter Address
        </div>
        <div style="font-size:13.5px; color:#475569; line-height:1.45;">
            Put the suspect wallet address reported by the victim.
        </div>
    </div>
    """, unsafe_allow_html=True)

with col2:
    st.markdown("""
    <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; 
                padding:18px 20px; min-height:130px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
        <div style="font-size:15px; font-weight:700; color:#1E40AF; margin-bottom:8px;">
            Step 2 — Start Tracking
        </div>
        <div style="font-size:13.5px; color:#475569; line-height:1.45;">
            Click the button. The system follows the money across wallets and chains.
        </div>
    </div>
    """, unsafe_allow_html=True)

with col3:
    st.markdown("""
    <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; 
                padding:18px 20px; min-height:130px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
        <div style="font-size:15px; font-weight:700; color:#1E40AF; margin-bottom:8px;">
            Step 3 — Get Result
        </div>
        <div style="font-size:13.5px; color:#475569; line-height:1.45;">
            See the exchange name, risk level, and download a ready report.
        </div>
    </div>
    """, unsafe_allow_html=True)

st.markdown("<div style='margin-bottom:25px;'></div>", unsafe_allow_html=True)

# ==========================================
# SIDEBAR — LIVE COMPLAINT QUEUE
# ==========================================
st.sidebar.markdown(
    """
    <h2 style="color:#F8FAFC; margin-bottom:2px;">Pending Complaints</h2>
    <p style="color:#94A3B8; font-size:13px; margin-top:0;">From NCRP / SAHYOG system</p>
    """,
    unsafe_allow_html=True
)

if os.path.exists("complaint_queue.json"):
    with open("complaint_queue.json", "r") as f:
        try:
            live_queue = json.load(f)
        except json.JSONDecodeError:
            live_queue = []

    if live_queue:
        for idx, comp in enumerate(live_queue[::-1][:5]):
            wallet_val = comp.get('victim_reported_wallet', '')
            complaint_id = comp.get('complaint_id', 'UNKNOWN')
            amount = comp.get('stolen_amount_usdt', 'N/A')
            typology = comp.get('fraud_typology', 'N/A')

            st.sidebar.markdown(
                f"""
                <div style="background:#1E293B; border-left:4px solid #F87171; 
                            padding:14px; border-radius:8px; margin-bottom:14px;">
                    <p style="margin:0; color:#FCA5A5; font-size:11px; font-weight:600; letter-spacing:0.5px;">WAITING</p>
                    <p style="margin:4px 0 2px 0; color:#F8FAFC; font-weight:700; font-size:14px;">{complaint_id}</p>
                    <p style="margin:0; color:#94A3B8; font-size:12px;">{amount} USDT · {typology}</p>
                    <p style="margin:8px 0 0 0; color:#CBD5E1; font-size:11px; font-family:monospace;">{wallet_val[:20]}...</p>
                </div>
                """,
                unsafe_allow_html=True
            )

            if st.sidebar.button(
                "Track this wallet",
                key=f"trace_btn_{complaint_id}_{idx}",
                use_container_width=True
            ):
                st.session_state["target_address_value"] = wallet_val
                st.rerun()
    else:
        st.sidebar.info("No pending complaints right now.")
else:
    st.sidebar.info("Complaint queue file not found.")

st.sidebar.markdown("---")
st.sidebar.caption("System ready")

# ==========================================
# INPUT SECTION
# ==========================================
if "target_address_value" not in st.session_state:
    st.session_state["target_address_value"] = "0xSuspect_Burner_Wallet_A"

st.markdown("### Enter Details")

col_user, col_addr, col_net = st.columns([1.3, 2.2, 1.5])
with col_user:
    investigator_id = st.text_input("Your ID / Badge Number", value="I4C-OFFICER-402")
with col_addr:
    target_address = st.text_input("Suspect Wallet Address", key="target_address_value",
                                   help="Paste the wallet address given by the victim")
with col_net:
    execution_mode = st.selectbox(
        "Where to look for data",
        [
            "Simulated Ledger Database",
            "Live Mainnet Network API (Ethereum)",
            "Live Mainnet Network API (Base)",
            "Live Mainnet Network API (Bitcoin)"
        ],
        help="Use Simulated for demo. Use Live only when internet and API are available."
    )

st.markdown("#### Upload many transactions at once (optional)")
st.caption("Only needed if you have a CSV file with extra transactions")

uploaded_file = st.file_uploader(
    "Choose a CSV file (columns required: from_address, to_address, amount)",
    type=["csv"],
    label_visibility="collapsed"
)

if uploaded_file is not None:
    try:
        bulk_df = pd.read_csv(uploaded_file)
        good_rows, bad_rows = 0, 0

        for row_num, row in bulk_df.iterrows():
            try:
                f_addr = str(row['from_address']).strip()
                t_addr = str(row['to_address']).strip()
                v_amt = float(row['amount'])

                if f_addr not in BLOCKCHAIN_LEDGER:
                    BLOCKCHAIN_LEDGER[f_addr] = []
                BLOCKCHAIN_LEDGER[f_addr].append({"to": t_addr, "amount": v_amt})
                good_rows += 1
            except (KeyError, ValueError, TypeError):
                bad_rows += 1
                continue

        if good_rows:
            st.success(f"Successfully added {good_rows} transactions.")
        if bad_rows:
            st.warning(f"Skipped {bad_rows} rows that had errors.")
        if good_rows == 0 and bad_rows == 0:
            st.info("The file was empty.")
    except Exception as e:
        st.error(f"Could not read the file: {e}")

# ==========================================
# MAIN EXECUTION
# ==========================================
if st.button("Start Tracking Now", type="primary", use_container_width=True):

    audit_core.log_investigation_action(
        investigator_id=investigator_id,
        target_wallet=target_address,
        action_summary=f"Executed trace via source: {execution_mode}."
    )

    with st.status("Running automated blockchain intelligence pipeline...", expanded=True) as status:

        # --- Live API fetch (optional) ---
        if "Live Mainnet" in execution_mode:
            if "Bitcoin" in execution_mode:
                st.write("🌐 Querying live Bitcoin data via Blockchair API...")
                live_response = bitcoin_core.fetch_live_wallet_transactions(target_address, max_txs=3)
            else:
                selected_chain = "base" if "Base" in execution_mode else "ethereum"
                st.write(f"🌐 Querying live {selected_chain.capitalize()} data via Blockscout API...")
                live_response = web3_core.fetch_live_wallet_transactions(target_address, network=selected_chain, max_txs=5)

            if live_response["status"] == "SUCCESS" and live_response["data"]:
                BLOCKCHAIN_LEDGER[target_address] = [
                    {"to": tx["to_wallet"], "amount": tx["amount_token"]} for tx in live_response["data"]
                ]
                st.write(f"✅ Integrated {len(live_response['data'])} live transactions.")
            elif live_response["status"] == "RATE_LIMITED":
                st.write("⚠️ Blockchair free-tier rate limit reached — try again shortly, or use simulated mode.")
            else:
                st.write("⚠️ Live lookup returned no usable data — falling back to simulated ledger.")

        st.write("🔎 Checking sanctions & threat intelligence registries...")
        st.write("🕸️ Tracing wallet graph across hops and bridges...")

        G = nx.DiGraph()
        endpoints = []
        cross_chain_events_discovered = []
        pdf_matrix_payload = []
        visited = set()  # extra safety net against cycles even within max-hop budget

        cluster_core.process_raw_blockchain_txs(MOCK_BLOCK_LOGS)

        def trace(wallet, hop=1):
            # Hard stop: max hop depth reached
            if hop > MAX_TRACE_HOPS:
                return
            # Hard stop: cycle detected (A -> B -> A style loops)
            if wallet in visited:
                return
            visited.add(wallet)

            # --- Sanctions / threat intel check ---
            threat_status = threat_core.check_address_threat_status(wallet)
            if threat_status["is_flagged"]:
                endpoints.append({
                    "Wallet Address": wallet,
                    "Attributed Entity": f"⚠️ MATCHED: {threat_status['source']}",
                    "Risk Score": 100,
                    "Hops Distance": hop - 1,
                    "Entity Type": f"SANCTIONED [{threat_status['reason']}]"
                })
                pdf_matrix_payload.append({
                    "wallet": wallet,
                    "vasp": f"SANCTIONED ({threat_status['source']})",
                    "hops": hop - 1,
                    "risk": 100
                })
                # A sanctioned wallet is always treated as a terminal endpoint —
                # prevents the same wallet being logged twice (sanctioned + VASP/unknown).
                return

            # --- Cross-chain bridge check ---
            if wallet in bridge_core.monitored_bridges:
                bridge_data = bridge_core.inspect_contract_for_swaps(target_address, wallet)
                if bridge_data["is_cross_chain"]:
                    cross_chain_events_discovered.append(bridge_data)
                    dest_node = bridge_data["target_recipient"]
                    G.add_edge(wallet, dest_node, weight=bridge_data["amount"])
                    trace(dest_node, hop + 1)
                    return

            # --- Known VASP/exchange check ---
            if wallet in KNOWN_VASP_CLUSTERS:
                v_name = KNOWN_VASP_CLUSTERS[wallet]["name"]
                v_type = KNOWN_VASP_CLUSTERS[wallet]["type"]
                r_score = forensic_core.compute_wallet_risk_score(wallet, v_name, hop)

                endpoints.append({
                    "Wallet Address": wallet,
                    "Attributed Entity": v_name,
                    "Risk Score": r_score,
                    "Hops Distance": hop - 1,
                    "Entity Type": v_type
                })
                pdf_matrix_payload.append({"wallet": wallet, "vasp": v_name, "hops": hop - 1, "risk": r_score})
                return

            # --- Keep tracing forward hops ---
            if wallet in BLOCKCHAIN_LEDGER:
                for tx in BLOCKCHAIN_LEDGER[wallet]:
                    G.add_edge(wallet, tx["to"], weight=tx["amount"])
                    trace(tx["to"], hop + 1)
            else:
                r_score = forensic_core.compute_wallet_risk_score(wallet, "Unknown", hop)
                endpoints.append({
                    "Wallet Address": wallet,
                    "Attributed Entity": "Unknown Non-Custodial/Cold Wallet",
                    "Risk Score": r_score,
                    "Hops Distance": hop - 1,
                    "Entity Type": "Private Ledger Storage"
                })
                pdf_matrix_payload.append({"wallet": wallet, "vasp": "Unknown Non-Custodial Wallet", "hops": hop - 1, "risk": r_score})

        trace(target_address)

        st.write("🧬 Clustering co-spent wallets...")
        all_discovered_wallets = list(G.nodes) + [e["Wallet Address"] for e in endpoints]
        computed_clusters = cluster_core.extract_and_attribute_clusters(all_discovered_wallets)
        detected_typologies = forensic_core.analyze_laundering_typology(G)

        st.write("⚡ Synchronizing parallel cross-chain ledger workers...")
        sync_logs = sync_core.execute_synchronized_trace(
            suspect_tron_wallet="0xScam_Collection_TRON",
            target_eth_wallet="0xTarget_Ethereum_Offramp_Wallet"
        )

        st.write("📄 Compiling forensic report...")
        status.update(label="Analysis complete.", state="complete", expanded=False)

    # ==========================================
    # RESULTS — TOP METRICS
    # ==========================================
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Nodes Traversed", len(G.nodes))
    col2.metric("VASP Endpoints Found", len([e for e in endpoints if "Exchange" in e["Entity Type"]]))
    col3.metric("Typology Patterns", len(detected_typologies))
    col4.metric("Cross-Chain Swaps", len(cross_chain_events_discovered))

    st.markdown("---")

      # ==========================================
    # RESULTS
    # ==========================================
    st.markdown("## Tracking Results")

    # Four simple numbers
    m1, m2, m3, m4 = st.columns(4)
    m1.metric("Wallets Checked", len(G.nodes))
    m2.metric("Exchanges Found", len([e for e in endpoints if "Exchange" in e.get("Entity Type", "")]))
    m3.metric("Patterns Found", len(detected_typologies))
    m4.metric("Cross-Chain Moves", len(cross_chain_events_discovered))

    # Clear action recommendation
    if endpoints:
        highest = max(endpoints, key=lambda x: x["Risk Score"])
        risk = highest["Risk Score"]
        name = highest["Attributed Entity"]

        if risk >= 70:
            bg = "#FEF2F2"
            border = "#DC2626"
            title = "High Risk — Take Action Now"
            msg = f"The money reached <b>{name}</b> (Risk score {risk}/100). This is a high-risk destination. Start the freeze process and save all evidence immediately."
        elif risk >= 30:
            bg = "#FFFBEB"
            border = "#D97706"
            title = "Medium Risk — Prepare Papers"
            msg = f"The money reached <b>{name}</b> (Risk score {risk}/100). Prepare the freeze notice and keep watching this wallet."
        else:
            bg = "#F0FDF4"
            border = "#16A34A"
            title = "Low Risk — Normal Follow-up"
            msg = f"The money reached <b>{name}</b> (Risk score {risk}/100). Continue with normal investigation steps."

        st.markdown(
            f"""
            <div style="background:{bg}; border-left:6px solid {border}; 
                        padding:18px 22px; border-radius:10px; margin:22px 0;">
                <h3 style="margin:0 0 8px 0; color:#0F172A;">{title}</h3>
                <p style="margin:0; color:#1E293B; font-size:15px; line-height:1.5;">{msg}</p>
            </div>
            """,
            unsafe_allow_html=True
        )

    st.markdown("---")

    # Clear tab names
    tab1, tab2, tab3, tab4, tab5, tab6 = st.tabs([
        "Summary",
        "Money Flow Graph",
        "Where Money Landed",
        "Related Wallets & Bridges",
        "Download Report",
        "System Log"
    ])

    with tab1:
        st.subheader("What we found")
        if endpoints:
            st.success(f"Tracking finished for wallet: `{target_address}`")
            st.markdown("**Top results (highest risk first):**")
            for e in sorted(endpoints, key=lambda x: x["Risk Score"], reverse=True)[:4]:
                badge = risk_badge_html(e["Risk Score"])
                wallet_short = short_addr(e["Wallet Address"], 18)
                hops = e["Hops Distance"]
                entity = e["Attributed Entity"]

                st.markdown(
                    f"""
                    - **{entity}**  
                    Wallet: `{wallet_short}` · Steps away: {hops} · Risk: {badge}
                    """,
                    unsafe_allow_html=True
                )
        else:
            st.info("No clear destination was found for this wallet.")

        if detected_typologies:
            st.markdown("**Suspicious patterns detected:**")
            for t in detected_typologies:
                st.warning(f"{t['typology']} at wallet `{t['node']}` — Confidence: {t['confidence']}")

    with tab2:
        st.subheader("Visual path of the money")
        if len(G.edges) > 0:
            fig, ax = plt.subplots(figsize=(12, 7), facecolor='#F8FAFC')
            ax.set_facecolor('#F8FAFC')
            pos = nx.spring_layout(G, seed=42, k=1.2)

            node_colors = []
            for n in G.nodes:
                n_str = str(n)
                if "Tornado" in n_str or "Mixer" in n_str:
                    node_colors.append("#DC2626")
                elif n_str in KNOWN_VASP_CLUSTERS:
                    node_colors.append("#16A34A")
                elif "Bridge" in n_str:
                    node_colors.append("#D97706")
                else:
                    node_colors.append("#1E40AF")

            labels = {n: short_addr(n, 11) for n in G.nodes}

            nx.draw_networkx_nodes(G, pos, node_size=2000, node_color=node_colors,
                                   edgecolors='#0F172A', linewidths=1.2, ax=ax)
            nx.draw_networkx_labels(G, pos, labels=labels, font_size=7.5,
                                    font_weight='bold', font_color='white', ax=ax)
            nx.draw_networkx_edges(G, pos, arrowstyle='-|>', arrowsize=16,
                                   edge_color='#64748B', width=1.6, ax=ax)

            edge_labels = nx.get_edge_attributes(G, 'weight')
            nx.draw_networkx_edge_labels(G, pos,
                edge_labels={k: f"{v}" for k, v in edge_labels.items()},
                font_size=7, font_color='#B91C1C', ax=ax)

            plt.axis('off')

            from matplotlib.patches import Patch
            legend_elements = [
                Patch(facecolor='#1E40AF', label='Normal wallet'),
                Patch(facecolor='#16A34A', label='Exchange / VASP'),
                Patch(facecolor='#D97706', label='Bridge'),
                Patch(facecolor='#DC2626', label='Mixer / High risk')
            ]
            ax.legend(handles=legend_elements, loc='upper center',
                      bbox_to_anchor=(0.5, -0.03), ncol=4, frameon=False, fontsize=9)

            st.pyplot(fig)
            st.caption("Blue = normal · Green = exchange · Orange = bridge · Red = mixer or sanctioned")
        else:
            st.info("No money movement was found to draw a graph.")

    with tab3:
        st.subheader("Final destinations and risk scores")
        if endpoints:
            df = pd.DataFrame(endpoints)
            df = df.sort_values("Risk Score", ascending=False)
            df_display = df.copy()
            df_display["Risk Score"] = df_display["Risk Score"].apply(risk_badge_html)

            st.markdown(df_display.to_html(escape=False, index=False), unsafe_allow_html=True)
            st.caption("Red badge (70+) = High risk · Orange (30-69) = Medium · Green (below 30) = Low")
        else:
            st.info("No destinations found.")

    with tab4:
        st.subheader("Related wallets (same owner possible)")
        cluster_found = False
        for root, info in computed_clusters.items():
            if len(info["wallets"]) > 1:
                cluster_found = True
                st.warning("These wallets appear linked (used together in transactions)")
                st.markdown(f"**Possible owner / platform:** `{info['attributed_entity']}`")
                st.code("\n".join(info["wallets"]), language="text")
        if not cluster_found:
            st.success("No linked wallet groups found.")

        st.markdown("#### Money that moved to another blockchain")
        if cross_chain_events_discovered:
            for ev in cross_chain_events_discovered:
                st.info(f"Bridge used: **{ev['bridge']}**")
                st.write(f"Amount: {ev['amount']} {ev['source_asset']} → went to **{ev['target_network']}**")
                st.success(f"Final address on other chain: `{ev['target_recipient']}`")
        else:
            st.success("No cross-chain movement detected.")

        if sync_logs:
            st.markdown("#### Live check across chains")
            for log in sync_logs:
                if log["chain"] == "TRON":
                    st.error(f"TRON side: {log['data']['amount']} {log['data']['token']} left (TX: {log['data']['txid']})")
                elif log["chain"] == "Ethereum":
                    st.success(f"Ethereum side: {log['data']['amount']} {log['data']['token']} arrived (TX: {log['data']['txid']})")

    with tab5:
        st.subheader("Download official report")
        if endpoints:
            report_filename = f"Garuda_Case_Report_{int(time.time())}.pdf"
            forensic_core.generate_pdf_dossier(report_filename, target_address, pdf_matrix_payload, detected_typologies)

            with open(report_filename, "rb") as pdf_file:
                pdf_bytes = pdf_file.read()

            st.download_button(
                label="Download PDF Report",
                data=pdf_bytes,
                file_name=report_filename,
                mime="application/pdf",
                use_container_width=True
            )
            try:
                os.remove(report_filename)
            except OSError:
                pass

            st.markdown("**This report contains:**")
            st.write("- Target wallet address")
            st.write("- All places the money went")
            st.write("- Risk scores")
            st.write("- Detected fraud patterns")
            st.write("- Ready for official use")
        else:
            st.info("No data available to create a report.")

    with tab6:
        st.subheader("System activity log")
        integrity_check = audit_core.verify_ledger_integrity()
        if integrity_check["status"] == "SECURE":
            st.success(
                f"Log is safe and complete. {integrity_check['total_records_verified']} records checked. "
                "No changes or tampering detected."
            )
        else:
            st.error(f"Problem found in the log at record number {integrity_check.get('failed_index')}.")

else:
    st.info("Type a wallet address above and click the blue button to start tracking.")

    st.markdown("---")
    st.subheader("System Log Status")
    integrity_check = audit_core.verify_ledger_integrity()
    if integrity_check["status"] == "SECURE":
        st.success(
            f"Log is safe. {integrity_check['total_records_verified']} records verified. No problems found."
        )
    else:
        st.error(f"Problem in log at record {integrity_check.get('failed_index')}.")