import networkx as nx

class HeuristicClusterEngine:
    def __init__(self):
        self.parent = {}
        # FIXED: Mapped keys directly to match your live simulated database models
        self.vasp_seeds = {
            "0xBinanceDepositHotWalletX901": "Binance International",
            "0xWazirXInboundClusterA2": "WazirX India",
            "0xCoinDCXReceivingWallet": "CoinDCX",
            "0xTornadoCashMixerRouter": "Tornado Cash (Sanctioned)"
        }

    def find_cluster(self, wallet):
        """Finds the root representative of the cluster this wallet belongs to."""
        if wallet not in self.parent:
            self.parent[wallet] = wallet
            return wallet
        
        # Path compression logic for sub-second database performance
        path = []
        while self.parent[wallet] != wallet:
            path.append(wallet)
            wallet = self.parent[wallet]
        for node in path:
            self.parent[node] = wallet
        return wallet

    def union_wallets(self, wallet1, wallet2):
        """Merges two address clusters together into a single entity cluster."""
        root1 = self.find_cluster(wallet1)
        root2 = self.find_cluster(wallet2)
        if root1 != root2:
            self.parent[root1] = root2

    def process_raw_blockchain_txs(self, transaction_logs):
        """
        Parses block transaction histories. If multiple inputs are co-spent,
        they are linked into a single entity cluster.
        """
        for tx in transaction_logs:
            inputs = tx.get("inputs", [])
            
            # FIXED: Correctly grab the first item and unpack multi-input parameters safely
            if len(inputs) > 1:
                first_input = inputs[0]
                for next_input in inputs[1:]:
                    self.union_wallets(first_input, next_input)

    def extract_and_attribute_clusters(self, active_wallets):
        """Groups all addresses into their mapped clusters and runs VASP attribution checks."""
        clusters = {}
        
        for wallet in active_wallets:
            root = self.find_cluster(wallet)
            if root not in clusters:
                clusters[root] = {
                    "wallets": [],
                    "attributed_entity": "Unknown Private / Intermediary Layer"
                }
            clusters[root]["wallets"].append(wallet)

        # Cross-reference cluster wallets against known exchange seeds
        for root, data in clusters.items():
            for wallet in data["wallets"]:
                if wallet in self.vasp_seeds:
                    data["attributed_entity"] = f"Verified VASP: {self.vasp_seeds[wallet]}"
                    break # The entire cluster inherits this exchange attribution identity
                    
        return clusters
