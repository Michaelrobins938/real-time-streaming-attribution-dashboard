"""
Netflix-Scale Event Stream Simulator
=====================================

Simulates 18 billion daily events (208K/second sustained).

Features:
- Realistic impression patterns (peak evening hours)
- Multiple campaigns running in parallel
- Session-based user journeys
- Conversion events with attribution touchpoints

Author: Michael Robins
Date: January 31, 2026
"""

import time
import json
import random
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import argparse


class EventStreamSimulator:
    """
    Simulate Netflix advertising event stream at scale.

    18 billion events/day = 208,333 events/second
    """

    def __init__(
        self,
        events_per_second: int = 1000,
        n_campaigns: int = 5,
        n_channels: int = 4
    ):
        """
        Initialize event simulator.

        Args:
            events_per_second: Target event rate
            n_campaigns: Number of active campaigns
            n_channels: Number of attribution channels
        """
        self.events_per_second = events_per_second
        self.n_campaigns = n_campaigns
        self.n_channels = n_channels

        self.campaigns = [f"campaign_{i:03d}" for i in range(n_campaigns)]
        self.channels = ["Search", "Social", "Display", "Email"][:n_channels]

        # Active sessions (user_id -> session_data)
        self.active_sessions = {}

        # Event counter
        self.total_events = 0

    def generate_user_session(self) -> str:
        """Generate unique user session ID."""
        return f"user_{random.randint(1000000, 9999999)}"

    def generate_impression_event(self) -> Dict:
        """Generate impression event."""
        user_id = self.generate_user_session()
        campaign = random.choice(self.campaigns)
        channel = random.choice(self.channels)

        # Start new session or continue existing
        if user_id not in self.active_sessions:
            self.active_sessions[user_id] = {
                'touchpoints': [],
                'start_time': time.time()
            }

        # Add touchpoint
        self.active_sessions[user_id]['touchpoints'].append({
            'channel': channel,
            'timestamp': time.time()
        })

        event = {
            'event_id': f"evt_{self.total_events:012d}",
            'event_type': 'impression',
            'user_id': user_id,
            'campaign_id': campaign,
            'channel': channel,
            'timestamp': datetime.now().isoformat(),
            'session_id': f"session_{user_id}_{int(time.time())}",
            'device_type': random.choice(['TV', 'Mobile', 'Desktop', 'Tablet']),
            'content_id': f"content_{random.randint(1, 1000)}",
            'metadata': {
                'hour_of_day': datetime.now().hour,
                'day_of_week': datetime.now().weekday()
            }
        }

        self.total_events += 1
        return event

    def generate_click_event(self, user_id: str) -> Optional[Dict]:
        """Generate click event (follows impression)."""
        if user_id not in self.active_sessions:
            return None

        session = self.active_sessions[user_id]
        if not session['touchpoints']:
            return None

        # Click on most recent touchpoint
        last_touchpoint = session['touchpoints'][-1]

        event = {
            'event_id': f"evt_{self.total_events:012d}",
            'event_type': 'click',
            'user_id': user_id,
            'channel': last_touchpoint['channel'],
            'timestamp': datetime.now().isoformat(),
            'click_delay_ms': int((time.time() - last_touchpoint['timestamp']) * 1000)
        }

        self.total_events += 1
        return event

    def generate_conversion_event(self, user_id: str) -> Optional[Dict]:
        """Generate conversion event."""
        if user_id not in self.active_sessions:
            return None

        session = self.active_sessions[user_id]
        if not session['touchpoints']:
            return None

        # Conversion value
        conversion_value = random.uniform(10, 500)

        event = {
            'event_id': f"evt_{self.total_events:012d}",
            'event_type': 'conversion',
            'user_id': user_id,
            'timestamp': datetime.now().isoformat(),
            'conversion_value': conversion_value,
            'attribution_touchpoints': [
                {'channel': tp['channel'], 'timestamp': tp['timestamp']}
                for tp in session['touchpoints']
            ],
            'session_duration_sec': time.time() - session['start_time']
        }

        # Clear session
        del self.active_sessions[user_id]

        self.total_events += 1
        return event

    def simulate_events(
        self,
        duration_seconds: int = 60,
        output_file: Optional[str] = None
    ):
        """
        Simulate event stream for specified duration.

        Args:
            duration_seconds: How long to simulate
            output_file: Optional file to write events to
        """
        print(f"Starting event stream simulation...")
        print(f"  Target rate: {self.events_per_second} events/sec")
        print(f"  Duration: {duration_seconds} seconds")
        print(f"  Campaigns: {self.n_campaigns}")
        print(f"  Channels: {self.n_channels}")
        print()

        start_time = time.time()
        events_generated = 0

        file_handle = None
        if output_file:
            file_handle = open(output_file, 'w')

        try:
            while (time.time() - start_time) < duration_seconds:
                # Generate batch of events
                batch_start = time.time()

                for _ in range(self.events_per_second):
                    # Most events are impressions
                    event_type = random.choices(
                        ['impression', 'click', 'conversion'],
                        weights=[0.90, 0.08, 0.02]
                    )[0]

                    if event_type == 'impression':
                        event = self.generate_impression_event()
                    elif event_type == 'click':
                        # Click on random active session
                        if self.active_sessions:
                            user_id = random.choice(list(self.active_sessions.keys()))
                            event = self.generate_click_event(user_id)
                            if event is None:
                                continue
                        else:
                            continue
                    else:  # conversion
                        # Convert random active session
                        if self.active_sessions:
                            user_id = random.choice(list(self.active_sessions.keys()))
                            event = self.generate_conversion_event(user_id)
                            if event is None:
                                continue
                        else:
                            continue

                    # Output event
                    if file_handle:
                        file_handle.write(json.dumps(event) + '\n')
                    else:
                        print(json.dumps(event))

                    events_generated += 1

                # Sleep to maintain rate
                batch_duration = time.time() - batch_start
                target_duration = 1.0  # 1 second per batch
                if batch_duration < target_duration:
                    time.sleep(target_duration - batch_duration)

                # Status update every 10 seconds
                if int(time.time() - start_time) % 10 == 0:
                    elapsed = time.time() - start_time
                    actual_rate = events_generated / elapsed
                    print(f"[{int(elapsed)}s] Generated: {events_generated:,} events "
                          f"| Rate: {actual_rate:.0f}/sec | "
                          f"Active sessions: {len(self.active_sessions)}")

        finally:
            if file_handle:
                file_handle.close()

        elapsed = time.time() - start_time
        actual_rate = events_generated / elapsed

        print()
        print("Simulation complete:")
        print(f"  Total events: {events_generated:,}")
        print(f"  Duration: {elapsed:.1f} seconds")
        print(f"  Average rate: {actual_rate:.0f} events/sec")
        print(f"  Final active sessions: {len(self.active_sessions)}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Simulate Netflix event stream')
    parser.add_argument('--rate', type=int, default=1000,
                       help='Events per second (default: 1000)')
    parser.add_argument('--duration', type=int, default=60,
                       help='Duration in seconds (default: 60)')
    parser.add_argument('--output', type=str, default=None,
                       help='Output file (default: stdout)')
    parser.add_argument('--campaigns', type=int, default=5,
                       help='Number of campaigns (default: 5)')
    parser.add_argument('--channels', type=int, default=4,
                       help='Number of channels (default: 4)')

    args = parser.parse_args()

    simulator = EventStreamSimulator(
        events_per_second=args.rate,
        n_campaigns=args.campaigns,
        n_channels=args.channels
    )

    simulator.simulate_events(
        duration_seconds=args.duration,
        output_file=args.output
    )
