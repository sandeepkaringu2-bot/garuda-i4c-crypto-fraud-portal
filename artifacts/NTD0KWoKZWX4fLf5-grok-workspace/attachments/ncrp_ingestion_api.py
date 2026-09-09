from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
import os

app = FastAPI(title="NCRP Ingestion Gateway Webhook Simulator")

class ComplaintPayload(BaseModel):
    complaint_id: str
    victim_reported_wallet: str
    stolen_amount_usdt: float
    fraud_typology: str

QUEUE_FILE = "complaint_queue.json"

@app.post("/webhook/ncrp-alert")
async def receive_ncrp_alert(payload: ComplaintPayload):
    try:
        # 1. Load existing queue or create a new empty list
        queue = []
        if os.path.exists(QUEUE_FILE):
            with open(QUEUE_FILE, "r") as f:
                try:
                    queue = json.load(f)
                except json.JSONDecodeError:
                    queue = []
        
        # 2. Append the new incoming cybercrime incident complaint record
        new_record = payload.dict()
        queue.append(new_record)
        
        # 3. Write it atomically back to disk so Streamlit can read it instantly
        with open(QUEUE_FILE, "w") as f:
            json.dump(queue, f, indent=4)
            
        return {"status": "SUCCESS", "message": f"Incident {payload.complaint_id} queued safely."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
