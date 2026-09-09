import requests


class BlockchairForensicEngine:
    """
    Live Bitcoin chain forensic engine using Blockstream's public Esplora API
    (blockstream.info/api). No API key required. Chosen over Blockchair
    because it returns full transaction input/output data in a single
    request per address, instead of needing one request per transaction —
    which is both faster and far less likely to hit rate limits.

    Bitcoin's UTXO model means one transaction can pay out to several
    different addresses at once. This engine resolves each transaction's
    real outputs into individual (from -> to, amount) edges, in the same
    shape as web3_api_engine.py, so it plugs straight into the existing
    trace() logic in app.py without any changes to the tracing algorithm.

    (Class name kept as BlockchairForensicEngine so nothing else in the
    project needs to change its import.)
    """

    def __init__(self):
        self.base_url = "https://blockstream.info/api"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                          "(KHTML, like Gecko) Chrome/124.0 Safari/537.36",
            "Accept": "application/json"
        }

    def fetch_live_wallet_transactions(self, wallet_address, max_txs=5):
        """
        Fetches a Bitcoin address's most recent transactions and resolves
        the ones where this address is a sender into (from -> to, amount)
        edges usable by the shared tracing engine.
        """
        txs_url = f"{self.base_url}/address/{wallet_address}/txs"
        compiled_rows = []

        try:
            resp = requests.get(txs_url, headers=self.headers, timeout=10)

            if resp.status_code in (402, 429, 430):
                return {"status": "RATE_LIMITED", "data": []}
            if resp.status_code != 200:
                return {
                    "status": "API_LIMIT_OR_ERROR",
                    "http_status": resp.status_code,
                    "response_snippet": resp.text[:300],
                    "data": []
                }

            transactions = resp.json()
            if not transactions:
                return {"status": "SUCCESS", "data": []}

            # Scan the whole returned page (Esplora returns up to ~25 recent
            # transactions per call — already fetched, no extra request cost)
            # instead of only the first few. A wallet's most recent activity
            # can easily be a run of incoming deposits before any outbound
            # hop appears, so limiting the scan window early would miss it.
            for tx in transactions:
                # Only trace transactions where our wallet is actually a sender
                # (appears as a prevout address in one of the inputs).
                is_sender = any(
                    vin.get("prevout", {}).get("scriptpubkey_address") == wallet_address
                    for vin in tx.get("vin", [])
                )
                if not is_sender:
                    continue

                tx_time = tx.get("status", {}).get("block_time")
                txid = tx.get("txid", "unknown")

                for vout in tx.get("vout", []):
                    out_addr = vout.get("scriptpubkey_address")
                    out_value_sat = vout.get("value", 0)

                    # Skip change-back-to-self and non-standard/empty outputs
                    if not out_addr or out_addr == wallet_address or out_value_sat <= 0:
                        continue

                    compiled_rows.append({
                        "txid": txid[:16] + "...",
                        "from_wallet": wallet_address,
                        "to_wallet": out_addr,
                        "amount_token": round(out_value_sat / 1e8, 8),  # satoshis -> BTC
                        "timestamp": tx_time
                    })

                # Cap OUTPUT rows once we have enough qualifying hops, so the
                # tracer isn't overwhelmed by one very "busy" transaction.
                if len(compiled_rows) >= max_txs:
                    break

            return {"status": "SUCCESS", "data": compiled_rows[:max_txs]}

        except Exception as e:
            return {"status": "CONNECTION_FAILED", "error": str(e), "data": []}


if __name__ == "__main__":
    print("#Booting Team Garuda Bitcoin Forensic Engine (Blockstream Esplora)...")
    engine = BlockchairForensicEngine()
    # Publicly documented, high-volume Bitcoin exchange wallet — good for live demo testing
    test_wallet = "34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo"
    result = engine.fetch_live_wallet_transactions(test_wallet, max_txs=5)
    print("Status:", result["status"])
    if result["status"] == "API_LIMIT_OR_ERROR":
        print("HTTP status code:", result.get("http_status"))
        print("Response snippet:", result.get("response_snippet"))
    if result["status"] == "CONNECTION_FAILED":
        print("Error detail:", result.get("error"))
    if result["status"] == "SUCCESS" and not result["data"]:
        print("No outbound transactions found in this wallet's most recent activity page.")
        print("Try a different address, or one known to actively send funds.")
    for row in result["data"]:
        print(row)