import hashlib
import json
import time
import os

class ForensicAuditLogger:
    def __init__(self, log_file="forensic_audit_trail.json"):
        self.log_file = log_file
        self._initialize_ledger()

    def _initialize_ledger(self):
        """Initializes the genesis audit ledger file if it doesn't exist."""
        if not os.path.exists(self.log_file):
            with open(self.log_file, "w") as f:
                json.dump([], f)

    def _calculate_block_hash(self, entry):
        """Generates a secure SHA-256 hash string for an entry record."""
        serialized_data = json.dumps(entry, sort_keys=True).encode('utf-8')
        return hashlib.sha256(serialized_data).hexdigest()

    def log_investigation_action(self, investigator_id, target_wallet, action_summary):
        """Appends a cryptographically chained verification block to the ledger."""
        # Read historical ledger array records
        try:
            with open(self.log_file, "r") as f:
                ledger = json.load(f)
        except:
            ledger = []

        # Reference hash string from the immediately preceding record block
        previous_block_hash = "GENESIS_INITIAL_LOG_NODE" if not ledger else ledger[-1]["current_block_hash"]

        # Formulate current operational record parameters
        audit_payload = {
            "index_sequence": len(ledger) + 1,
            "timestamp_epoch": time.time(),
            "operator_id": investigator_id,
            "targeted_ledger_address": target_wallet,
            "operational_action_summary": action_summary,
            "previous_block_hash": previous_block_hash
        }

        # Sign the block using a computed SHA-256 integrity hash value
        audit_payload["current_block_hash"] = self._calculate_block_hash(audit_payload)
        
        # Write back to permanent storage registry matrix
        ledger.append(audit_payload)
        with open(self.log_file, "w") as f:
            json.dump(ledger, f, indent=4)
            
        return audit_payload

    def verify_ledger_integrity(self):
        """Scans the entire ledger history to verify chain blocks remain untampered."""
        try:
            with open(self.log_file, "r") as f:
                ledger = json.load(f)
        except:
            return {"status": "CRITICAL_ERROR", "details": "Ledger target inaccessible."}

        for i in range(len(ledger)):
            current_entry = ledger[i].copy()
            stored_hash = current_entry.pop("current_block_hash")
            
            # Recalculate block checksum status values
            computed_hash = self._calculate_block_hash(current_entry)
            if stored_hash != computed_hash:
                return {"status": "COMPROMISED", "failed_index": current_entry["index_sequence"]}
                
            # Verify block cryptographic backward linkages
            if i > 0:
                if current_entry["previous_block_hash"] != ledger[i-1]["current_block_hash"]:
                    return {"status": "CHAIN_BROKEN", "failed_index": current_entry["index_sequence"]}

        return {"status": "SECURE", "total_records_verified": len(ledger)}
