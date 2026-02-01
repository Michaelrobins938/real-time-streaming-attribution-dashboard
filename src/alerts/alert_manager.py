"""
Alert Manager
=============

Monitors real-time metrics for anomalies, performance drops, or low attribution confidence.
"""

from typing import List, Dict, Optional
import time

class AlertManager:
    """
    Monitors metrics and generates alerts for the dashboard.
    """
    
    def __init__(self, thresholds: Optional[Dict] = None):
        self.thresholds = thresholds or {
            'min_fill_rate': 0.90,
            'min_attribution_confidence': 0.75,
            'max_frequency_cap': 5.0,
            'min_ctr': 0.015
        }
        self.active_alerts = []
        
    def check_metrics(self, metrics: Dict) -> List[Dict]:
        """
        Check current metrics against thresholds and return active alerts.
        """
        new_alerts = []
        timestamp = time.time()
        
        # 1. Check Fill Rate
        fill_rate = metrics.get('health', {}).get('fill_rate', 1.0)
        if fill_rate < self.thresholds['min_fill_rate']:
            new_alerts.append({
                'id': f"alert_fill_{int(timestamp)}",
                'type': 'CRITICAL',
                'message': f"Fill rate dropped to {fill_rate:.1%} (Target: >{self.thresholds['min_fill_rate']:.0%})",
                'timestamp': timestamp,
                'category': 'Campaign Health'
            })
            
        # 2. Check Frequency
        avg_freq = metrics.get('health', {}).get('frequency_avg', 0.0)
        if avg_freq > self.thresholds['max_frequency_cap']:
            new_alerts.append({
                'id': f"alert_freq_{int(timestamp)}",
                'type': 'WARNING',
                'message': f"High frequency detected ({avg_freq:.1f}). Viewer fatigue risk.",
                'timestamp': timestamp,
                'category': 'Ad Operations'
            })
            
        # 3. Check Attribution Confidence
        # (Assuming confidence is passed in metrics)
        confidence = metrics.get('attribution_stats', {}).get('confidence', 1.0)
        if confidence < self.thresholds['min_attribution_confidence']:
            new_alerts.append({
                'id': f"alert_conf_{int(timestamp)}",
                'type': 'INFO',
                'message': f"Low attribution confidence ({confidence:.1%}). Needs more impressions.",
                'timestamp': timestamp,
                'category': 'Data Quality'
            })
            
        self.active_alerts = new_alerts
        return self.active_alerts

if __name__ == "__main__":
    manager = AlertManager()
    sample_metrics = {
        'health': {'fill_rate': 0.85, 'frequency_avg': 6.2},
        'attribution_stats': {'confidence': 0.60}
    }
    alerts = manager.check_metrics(sample_metrics)
    for a in alerts:
        print(f"[{a['type']}] {a['message']}")
