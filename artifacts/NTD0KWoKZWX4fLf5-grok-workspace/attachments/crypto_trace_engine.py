import time
import networkx as nx
import matplotlib.pyplot as plt
from tabulate import tabulate

# ==========================================
# 1. SIMULATED BLOCKCHAIN DATAREGISTRY (VASP & LEDGER)
# ==========================================
# Real-world lookup dictionary mimicking an exchange attribution cluster repository
KNOWN_VASP_CLUSTERS = {
    "0xBinanceDepositHotWalletX901": {"vasp_name": "Binance International", "risk_score": 10, "is_exchange": True},
    "0xWazirXInboundClusterA2": {"vasp_name": "WazirX India", "risk_score": 15, "is_exchange": True},
    "0xCoinDCXReceivingWallet": {"vasp_name": "CoinDCX", "risk_score": 12, "is_exchange": True},
    "0xTornadoCashMixerRouter": {"vasp_name": "Tornado Cash (Sanctioned Mixer)", "risk_score": 100, "is_exchange": False},
}

# Mocked transaction ledger mimicking multi-hop layering (Peeling Chains)
# Structure: Source -> Destination: (Amount in USDT, TxHash)
BLOCKCHAIN_LEDGER = {
    # Victim reports sending funds to Suspect Burner Wallet A
    "0xSuspect_Burner_Wallet_A": [
        {"to": "0xLayering_Wallet_B", "amount": 5000, "tx_hash": "0xab12...34cd"},
        {"to": "0xLayering_Wallet_C", "amount": 2500, "tx_hash": "0xef56...78gh"}
    ],
    # Layering Wallet B passes funds down the line
    "0xLayering_Wallet_B": [
        {"to": "0xLayering_Wallet_D", "amount": 4900, "tx_hash": "0xij90...12kl"}
    ],
    # Layering Wallet C sends funds into a high-risk mixer
    "0xLayering_Wallet_C": [
        {"to": "0xTornadoCashMixerRouter", "amount": 2450, "tx_hash": "0xmn34...56op"}
    ],
    # Layering Wallet D finally hits a centralized off-ramp cashout exchange
    "0xLayering_Wallet_D": [
        {"to": "0xWazirXInboundClusterA2", "amount": 4850, "tx_hash": "0xqr78...90st"}
    ]
}

class CryptoFraudAttributionSystem:
    def __init__(self):
        self.graph = nx.DiGraph()
        self.execution_logs = []
        self.identified_endpoints = []

    def log(self, message):
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        self.execution_logs.append(f"[{timestamp}] {message}")

    # ==========================================
    # 2. RECURSIVE BLOCKCHAIN TRACING ALGORITHM
    # ==========================================
    def trace_wallet(self, current_wallet, current_hop=1, max_hops=5):
        """
        Recursively traces outgoing transactions from a target wallet 
        to isolate the nearest point of deposit (VASP / Exchange)
        """
        self.log(f"Analyzing Address: {current_wallet} (Hop depth: {current_hop})")
        
        # Check if the address hits a known Exchange/VASP footprint
        if current_wallet in KNOWN_VASP_CLUSTERS:
            vasp_info = KNOWN_VASP_CLUSTERS[current_wallet]
            self.log(f"🚨 TARGET HIT: Attributed to VASP '{vasp_info['vasp_name']}'")
            self.identified_endpoints.append({
                "wallet": current_wallet,
                "vasp": vasp_info["vasp_name"],
                "risk": vasp_info["risk_score"],
                "hops": current_hop - 1,
                "status": "EXCHANGE FOUND - ACTION REQUIRED" if vasp_info["is_exchange"] else "HIGH RISK MIXER DETECTED"
            })
            return

        # Halt execution if tracing exceeds maximum investigative depth
        if current_hop > max_hops:
            self.log(f"Max investigative depth of {max_hops} reached for wallet {current_wallet}.")
            return

        # If the wallet has outgoing transactions, process them recursively
        if current_wallet in BLOCKCHAIN_LEDGER:
            for tx in BLOCKCHAIN_LEDGER[current_wallet]:
                next_destination = tx["to"]
                amount = tx["amount"]
                tx_hash = tx["tx_hash"]
                
                # Append data points to our Graph Visualization structure
                self.graph.add_edge(current_wallet, next_destination, weight=amount, tx=tx_hash)
                
                self.log(f"Forward flow detected: {current_wallet} ──({amount} USDT)──► {next_destination}")
                
                # Recursive execution down the blockchain tree
                self.trace_wallet(next_destination, current_hop + 1, max_hops)
        else:
            # End of chain without hitting a known cluster endpoint
            self.log(f"Leaf node reached at {current_wallet}. No ongoing public ledger traces found.")
            if current_wallet not in KNOWN_VASP_CLUSTERS:
                self.identified_endpoints.append({
                    "wallet": current_wallet,
                    "vasp": "Unknown Non-Custodial/Cold Wallet",
                    "risk": 40,
                    "hops": current_hop - 1,
                    "status": "FUNDS UNMOVED / INDEPENDENT HOLDING"
                })

    # ==========================================
    # 3. INTERACTIVE VISUALIZATION COMPONENT
    # ==========================================
    def render_blockchain_graph(self):
        """Generates a node graph visualizing the flow of laundering activities"""
        plt.figure(figsize=(12, 7))
        pos = nx.spring_layout(self.graph, seed=42)
        
        # Draw Nodes
        nx.draw_networkx_nodes(self.graph, pos, node_size=2500, node_color='lightblue', edgecolors='black')
        nx.draw_networkx_labels(self.graph, pos, font_size=8, font_weight='bold')
        
        # Draw Edges with Directional Arrows
        nx.draw_networkx_edges(self.graph, pos, arrowstyle='-|>', arrowsize=20, edge_color='gray', width=1.5)
        
        # Draw Transaction Edge Labels (Token value moving)
        edge_labels = nx.get_edge_attributes(self.graph, 'weight')
        formatted_labels = {k: f"{v} USDT" for k, v in edge_labels.items()}
        nx.draw_networkx_edge_labels(self.graph, pos, edge_labels=formatted_labels, font_color='red', font_size=9)
        
        plt.title("I4C Blockchain Intelligence Engine - Real-Time Transaction Flow Graph", fontsize=14, fontweight='bold')
        plt.axis('off')
        plt.tight_layout()
        print("\n[Graphics] Displaying Visual Flow Chart...")
        plt.show()

    # ==========================================
    # 4. ACTIONABLE INTELLIGENCE LEA GENERATOR
    # ==========================================
    def generate_investigation_report(self, target_input):
        print("="*80)
        print("  INDIAN CYBER CRIME COORDINATION CENTRE (I4C) - BLOCKCHAIN INTELLIGENCE REPORT  ")
        print("="*80)
        print(f"Suspect Target Input Address: {target_input}")
        print(f"System Assessment Status: Tracing Complete\n")
        
        print("--- AUTOMATED SYSTEM SYSTEM LOGS ---")
        for log_line in self.execution_logs:
            print(log_line)
            
        print("\n--- ATTRIBUTED TARGETS & DESTINATIONS DISCOVERED ---")
        headers = ["Endpoint Wallet Address", "Attributed Entity", "Risk Level", "Hops Distance", "Recommended Action"]
        table_data = [[item['wallet'], item['vasp'], item['risk'], item['hops'], item['status']] for item in self.identified_endpoints]
        print(tabulate(table_data, headers=headers, tablefmt="grid"))
        
        # Generate actionable Draft Notice for Law Enforcement
        for item in self.identified_endpoints:
            if "EXCHANGE FOUND" in item['status']:
                print("\n" + "#"*70)
                print("🚨 ACTIONABLE LEGAL NOTICE GENERATION (Drafting statutory compliance template...)")
                print("#"*70)
                print(f"To: Nodal Legal Officer, {item['vasp']}")
                print(f"Subject: Emergency Asset Freeze Notice under statutory cyber forensic protocols.")
                print(f"\nThis is to notify you that the wallet address '{item['wallet']}' has been flagged")
                print(f"by the I4C automated tracking network as the immediate endpoint recipient of stolen")
                print(f"funds originating from victim complaints involving wallet '{target_input}'.")
                print(f"\nYou are requested to immediately FREEZE, SECURE, AND PRESERVE all logs, fiat accounts,")
                print(f"KYC profiles, and transaction roots tied to this endpoint profile to prevent flight of capital.")
                print("#"*70)

# ==========================================
# RUNNING THE ENGINE SIMULATION
# ==========================================
if __name__ == "__main__":
    # Target address input submitted by a scam victim via the portal
    victim_reported_address = "0xSuspect_Burner_Wallet_A"
    
    engine = CryptoFraudAttributionSystem()
    
    # Execute structural lookup & pathing traversal algorithms
    engine.trace_wallet(victim_reported_address)
    
    # Format and present intelligence profiles to law enforcement officers
    engine.generate_investigation_report(victim_reported_address)
    
    # Render tracking layout canvas
    engine.render_blockchain_graph()
