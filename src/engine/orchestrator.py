"""
Streaming Orchestrator
======================

Connects the Event Simulator, Attribution Engine, and WebSocket API.
Provides the "Live" heart of the dashboard.
"""

import sys
import os
import json
import time
import requests
import threading
from datetime import datetime

# Add parent dir to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from simulator.event_generator import EventStreamSimulator
from engine.streaming_attribution import StreamingAttributionEngine
from alerts.alert_manager import AlertManager

class StreamingOrchestrator:
    def __init__(self, api_url: str = "http://localhost:8000/update"):
        self.api_url = api_url
        self.channels = ["Search", "Social", "Display", "Email"]
        self.engine = StreamingAttributionEngine(self.channels)
        self.alert_manager = AlertManager()
        self.simulator = EventStreamSimulator(events_per_second=1000)
        
        self.running = False
        self.events_processed = 0
        self.start_time = time.time()
        
    def start(self, duration: int = 3600):
        self.running = True
        self.start_time = time.time()
        
        # Start API reporting thread
        report_thread = threading.Thread(target=self._reporting_loop, daemon=True)
        report_thread.start()
        
        print(f"Orchestrator started. Reporting to {self.api_url}")
        
        # Main event loop (simplified version of simulate_events)
        try:
            while self.running and (time.time() - self.start_time) < duration:
                batch_start = time.time()
                
                for _ in range(self.simulator.events_per_second):
                    # Generate random event type
                    import random
                    event_type = random.choices(
                        ['impression', 'click', 'conversion'],
                        weights=[0.90, 0.08, 0.02]
                    )[0]
                    
                    if event_type == 'impression':
                        self.simulator.generate_impression_event()
                    elif event_type == 'click':
                        if self.simulator.active_sessions:
                            uid = random.choice(list(self.simulator.active_sessions.keys()))
                            self.simulator.generate_click_event(uid)
                    else:  # conversion
                        if self.simulator.active_sessions:
                            uid = random.choice(list(self.simulator.active_sessions.keys()))
                            event = self.simulator.generate_conversion_event(uid)
                            if event:
                                # Process path
                                path = [tp['channel'] for tp in event['attribution_touchpoints']]
                                self.engine.process_conversion(path, event['conversion_value'])
                    
                    self.events_processed += 1
                
                # Maintain rate
                elapsed = time.time() - batch_start
                if elapsed < 1.0:
                    time.sleep(1.0 - elapsed)
                    
        except KeyboardInterrupt:
            self.running = False
            
    def _reporting_loop(self):
        while self.running:
            try:
                scores = self.engine.get_current_scores()
                
                # Combine with health metrics
                metrics = {
                    "attribution": scores['shares'],
                    "health": {
                        "fill_rate": 0.94 + (0.02 * (time.time() % 10) / 10), # Simulated drift
                        "ctr": 0.023 + (0.005 * (time.time() % 5) / 5),
                        "conversion_rate": 0.051,
                        "frequency_avg": 2.1 + (0.5 * (time.time() % 15) / 15)
                    },
                    "attribution_stats": {
                        "confidence": 0.85 + (0.1 * (time.time() % 60) / 60)
                    },
                    "events_sec": self.simulator.events_per_second + (random_jitter() if 'random_jitter' in globals() else 0),
                    "total_events": self.events_processed
                }
                
                # Check for alerts
                alerts = self.alert_manager.check_metrics(metrics)
                metrics["alerts"] = alerts
                
                # Post to API
                requests.post(self.api_url, json=metrics, timeout=1)
                
            except Exception as e:
                print(f"Reporting error: {e}")
                
            time.sleep(5)  # Report every 5 seconds

def random_jitter():
    import random
    return random.randint(-50, 50)

if __name__ == "__main__":
    orchestrator = StreamingOrchestrator()
    orchestrator.start()
