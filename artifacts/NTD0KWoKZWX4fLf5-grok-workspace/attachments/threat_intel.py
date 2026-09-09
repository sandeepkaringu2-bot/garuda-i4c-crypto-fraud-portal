import time

class ThreatIntelEngine:
    def __init__(self):
        # High-leverage static dictionary simulating a live-synchronized security feed
        self.sanctioned_registry = {
            "0xTornadoCashMixerRouter": {
                "source": "OFAC SDN List",
                "reason": "State-sponsored laundering mixer platform",
                "severity": "CRITICAL"
            },
            "0xOffshore_Mixer_Node": {
                "source": "FIU Cyber Threat Alert",
                "reason": "Ransomware cash-out terminal point",
                "severity": "CRITICAL"
            },
            "0xScam_Collection_TRON": {
                "source": "NCRP Database Matches",
                "reason": "Active phishing scam collection node",
                "severity": "HIGH"
            }
        }

    def check_address_threat_status(self, wallet_address):
        """Cross-references a discovered ledger address against known sanction lists."""
        # Simple sub-second lookups mimicking high-speed hash checks
        normalized_address = str(wallet_address).strip()
        
        if normalized_address in self.sanctioned_registry:
            match_details = self.sanctioned_registry[normalized_address]
            return {
                "is_flagged": True,
                "source": match_details["source"],
                "reason": match_details["reason"],
                "severity": match_details["severity"]
            }
            
        return {
            "is_flagged": False,
            "source": "Clean Matrix",
            "reason": "No active threat database records matched.",
            "severity": "LOW"
        }
