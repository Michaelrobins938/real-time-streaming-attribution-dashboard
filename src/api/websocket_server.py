"""
WebSocket Server for Real-Time Attribution
==========================================

FastAPI server that broadcasts attribution updates and campaign health
metrics to connected React clients.
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import asyncio
import time
from typing import List, Dict
import uvicorn

app = FastAPI()

# Enable CORS for React dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                # Remove stale connections
                self.active_connections.remove(connection)

manager = ConnectionManager()

# Global state for metrics
current_metrics = {
    "attribution": {
        "Search": 0.25,
        "Social": 0.35,
        "Display": 0.20,
        "Email": 0.20
    },
    "health": {
        "fill_rate": 0.94,
        "ctr": 0.024,
        "conversion_rate": 0.052,
        "frequency_avg": 2.1
    },
    "alerts": [],
    "events_sec": 0,
    "timestamp": time.time()
}

@app.get("/")
async def get():
    return {"status": "online", "message": "Real-time Attribution Server"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Endpoint for internal processes to update metrics
@app.post("/update")
async def update_metrics(data: Dict):
    global current_metrics
    current_metrics.update(data)
    current_metrics["timestamp"] = time.time()
    await manager.broadcast(json.dumps(current_metrics))
    return {"status": "success"}

async def mock_updater():
    """Periodically drift metrics for visual demo if no real source is active."""
    import random
    while True:
        if not manager.active_connections:
            await asyncio.sleep(5)
            continue
            
        # Simulate slight changes
        for channel in current_metrics["attribution"]:
            current_metrics["attribution"][channel] += random.uniform(-0.02, 0.02)
        
        # Normalize
        total = sum(current_metrics["attribution"].values())
        for channel in current_metrics["attribution"]:
            current_metrics["attribution"][channel] /= total
            
        current_metrics["health"]["fill_rate"] = random.uniform(0.85, 0.98)
        current_metrics["events_sec"] = random.randint(180000, 220000)
        
        await manager.broadcast(json.dumps(current_metrics))
        await asyncio.sleep(5)

@app.on_event("startup")
async def startup_event():
    # Optional: Start mock updater if you want the dashboard to look alive immediately
    # asyncio.create_task(mock_updater())
    pass

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
