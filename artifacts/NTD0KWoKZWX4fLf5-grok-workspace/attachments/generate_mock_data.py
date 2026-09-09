import pandas as pd

# Define a matrix payload mirroring standard blockchain trace logs
mock_transactions = {
    "from_address": [
        "0xSuspect_Burner_Wallet_A", 
        "0xLayering_Wallet_B", 
        "0xSuspect_Intermediary_X1", 
        "0xSuspect_Intermediary_X1"
    ],
    "to_address": [
        "0xSuspect_Intermediary_X1", 
        "0xTarget_Ethereum_Offramp_Wallet", 
        "0xCoinDCXReceivingWallet", 
        "0xBinanceDepositHotWalletX901"
    ],
    "amount": [2500.00, 4900.00, 1250.00, 1250.00]
}

# Construct dataframe structures and write out to disk
df = pd.DataFrame(mock_transactions)
filename = "garuda_bulk_test_logs.csv"
df.to_csv(filename, index=False)

print(f"✅ Success! Generated custom transaction log file for portal batch upload test runs: '{filename}'")
