import requests


class BlockscoutForensicEngine:
    """
    Live Ethereum/EVM chain forensic engine using Blockscout's public REST API.

    IMPORTANT correctness fix: this engine now only returns transactions
    where the queried wallet is the actual SENDER (from_addr == wallet).
    Earlier versions returned every transaction touching the wallet,
    including deposits INTO it — which meant app.py's tracer could
    mistakenly treat an incoming depositor's own destination as if the
    target wallet had sent funds there. That produces a false trail in a
    forensic tool, so it's fixed here to match the same sender-only
    standard already used in bitcoin_api_engine.py.
    """

    def __init__(self):
        self.api_urls = {
            "ethereum": "https://blockscout.com",
            "base": "https://blockscout.com",
            "optimism": "https://blockscout.com"
        }
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                          "(KHTML, like Gecko) Chrome/124.0 Safari/537.36",
            "Accept": "application/json"
        }

    def fetch_live_wallet_transactions(self, wallet_address, network="ethereum", max_txs=10):
        """
        Connects to live Blockscout REST v2 endpoints and returns only the
        transactions where wallet_address is the sender — i.e. real outbound
        hops usable for tracing where funds went.
        """
        if network not in self.api_urls:
            network = "ethereum"

        clean_wallet = wallet_address.strip()
        endpoint_url = f"{self.api_urls[network]}/addresses/{clean_wallet}/transactions"

        compiled_ledger_rows = []

        try:
            response = requests.get(endpoint_url, headers=self.headers, timeout=8)

            if response.status_code != 200:
                return {"status": "API_LIMIT_OR_ERROR", "http_status": response.status_code, "data": []}

            tx_data = response.json()
            items = tx_data.get("items", [])

            # Scan the whole returned page for outbound activity (same
            # reasoning as the Bitcoin engine: recent activity can be a run
            # of incoming deposits before any real outbound hop appears).
            for item in items:
                from_addr = item.get("from", {}).get("hash") if item.get("from") else None
                to_addr = item.get("to", {}).get("hash") if item.get("to") else None

                # Sender-only filter: skip anything that isn't actually an
                # outbound transaction from our target wallet.
                if not from_addr or from_addr.lower() != clean_wallet.lower():
                    continue
                if not to_addr:
                    continue

                tx_hash = item.get("hash", "unknown")
                raw_value = int(item.get("value", 0))
                formatted_value = raw_value / (10 ** 18) if raw_value > 0 else 0.0

                compiled_ledger_rows.append({
                    "txid": tx_hash[:16] + "...",
                    "from_wallet": from_addr,
                    "to_wallet": to_addr,
                    "amount_token": round(formatted_value, 6),
                    "timestamp": item.get("timestamp")
                })

                if len(compiled_ledger_rows) >= max_txs:
                    break

            return {"status": "SUCCESS", "data": compiled_ledger_rows}

        except Exception as e:
            return {"status": "CONNECTION_FAILED", "error": str(e), "data": []}


if __name__ == "__main__":
    print("🧪 Booting Team Garuda Ethereum/EVM Forensic Engine (Blockscout)...")
    engine = BlockscoutForensicEngine()
    test_wallet = "0xbe0eb53f46cd790cd13851d5eff43d12404d33e8"
    result = engine.fetch_live_wallet_transactions(test_wallet, network="ethereum", max_txs=5)
    print("Status:", result["status"])
    if result["status"] == "SUCCESS" and not result["data"]:
        print("No outbound transactions found in this wallet's most recent activity page.")
    for row in result["data"]:
        print(row)