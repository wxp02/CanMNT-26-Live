import httpx
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from models import PlayerEvent
from config import settings
from players import PLAYER_ID_MAP


class FootballAPIService:
    def __init__(self):
        self.base_url = f"https://{settings.rapidapi_host}"
        self.headers = {
            "X-RapidAPI-Key": settings.rapidapi_key,
            "X-RapidAPI-Host": settings.rapidapi_host
        }

    async def get_live_fixtures(self) -> List[dict]:
        """Fetch all live fixtures"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/v3/fixtures",
                    headers=self.headers,
                    params={"live": "all"},
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
                return data.get("response", [])
            except Exception as e:
                print(f"Error fetching live fixtures: {e}")
                return []

    async def get_fixture_events(self, fixture_id: int) -> List[dict]:
        """Fetch events for a specific fixture"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/v3/fixtures/events",
                    headers=self.headers,
                    params={"fixture": fixture_id},
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
                return data.get("response", [])
            except Exception as e:
                print(f"Error fetching fixture events: {e}")
                return []

    async def get_recent_fixtures(self, hours: int = 24) -> List[dict]:
        """Fetch fixtures from the last X hours"""
        from_date = (datetime.now(timezone.utc) - timedelta(hours=hours)).strftime("%Y-%m-%d")
        to_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/v3/fixtures",
                    headers=self.headers,
                    params={
                        "from": from_date,
                        "to": to_date
                    },
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
                return data.get("response", [])
            except Exception as e:
                print(f"Error fetching recent fixtures: {e}")
                return []

    def parse_event_type(self, event_type: str, detail: str) -> tuple[str, str]:
        """Parse API event type to our simplified type"""
        event_type_lower = event_type.lower()
        detail_lower = detail.lower() if detail else ""
        
        if "goal" in event_type_lower:
            return "goal", "Goal"
        elif "card" in event_type_lower:
            if "yellow" in detail_lower:
                return "card", "Yellow Card"
            elif "red" in detail_lower:
                return "card", "Red Card"
            return "card", "Card"
        elif "subst" in event_type_lower:
            return "substitution", "Substitution"
        elif "assist" in detail_lower:
            return "assist", "Assist"
        else:
            return "other", event_type

    def calculate_timestamp(self, fixture_date: str, event_minute: int) -> str:
        """Calculate relative timestamp from fixture date and event minute"""
        try:
            # Parse fixture date
            fixture_datetime = datetime.fromisoformat(fixture_date.replace('Z', '+00:00'))
            # Add event minute
            event_datetime = fixture_datetime + timedelta(minutes=event_minute)
            # Calculate difference from now
            now = datetime.now(timezone.utc)
            diff = now - event_datetime
            
            if diff.total_seconds() < 60:
                return "just now"
            elif diff.total_seconds() < 3600:
                minutes = int(diff.total_seconds() / 60)
                return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
            elif diff.total_seconds() < 86400:
                hours = int(diff.total_seconds() / 3600)
                return f"{hours} hour{'s' if hours != 1 else ''} ago"
            else:
                days = int(diff.total_seconds() / 86400)
                return f"{days} day{'s' if days != 1 else ''} ago"
        except Exception as e:
            print(f"Error calculating timestamp: {e}")
            return "recently"

    async def get_canadian_player_events(self) -> List[PlayerEvent]:
        """Get recent events for Canadian national team players"""
        events = []
        event_id = 1
        
        # Get live fixtures
        live_fixtures = await self.get_live_fixtures()
        
        # Also get recent fixtures from last 24 hours
        recent_fixtures = await self.get_recent_fixtures(hours=24)
        
        # Combine and deduplicate fixtures
        all_fixtures = {f["fixture"]["id"]: f for f in live_fixtures + recent_fixtures}
        
        for fixture in all_fixtures.values():
            fixture_id = fixture["fixture"]["id"]
            fixture_date = fixture["fixture"]["date"]
            home_team = fixture["teams"]["home"]["name"]
            away_team = fixture["teams"]["away"]["name"]
            home_goals = fixture["goals"]["home"] or 0
            away_goals = fixture["goals"]["away"] or 0
            league_name = fixture["league"]["name"]
            
            # Get events for this fixture
            fixture_events = await self.get_fixture_events(fixture_id)
            
            for event in fixture_events:
                player_id = event.get("player", {}).get("id")
                
                # Check if this is one of our tracked Canadian players
                if player_id in PLAYER_ID_MAP:
                    player_name = PLAYER_ID_MAP[player_id]
                    event_type_raw = event.get("type", "")
                    event_detail = event.get("detail", "")
                    event_minute = event.get("time", {}).get("elapsed", 0)
                    
                    # Parse event type
                    event_type, event_name = self.parse_event_type(event_type_raw, event_detail)
                    
                    # Skip non-interesting events
                    if event_type == "other":
                        continue
                    
                    # Create context string
                    context = f"{home_team} {home_goals}-{away_goals} {away_team}"
                    
                    # Calculate timestamp
                    timestamp = self.calculate_timestamp(fixture_date, event_minute)
                    
                    events.append(PlayerEvent(
                        id=event_id,
                        player=player_name,
                        event=event_name,
                        type=event_type,
                        context=context,
                        minute=f"{event_minute}'",
                        timestamp=timestamp,
                        league=league_name,
                        team=event.get("team", {}).get("name")
                    ))
                    event_id += 1
        
        # Sort by most recent first (you might want to implement better sorting)
        return sorted(events, key=lambda x: x.timestamp)[:10]  # Return top 10 recent events


football_api = FootballAPIService()
