"""
Database service layer for interacting with Prisma
"""
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from prisma import Prisma
from models import PlayerEvent
import asyncio


class DatabaseService:
    """Service for database operations using Prisma"""
    
    def __init__(self):
        self.db = Prisma()
        self._connected = False
    
    async def connect(self):
        """Connect to the database"""
        if not self._connected:
            print("Connecting to Prisma database...")
            await self.db.connect()
            self._connected = True
            print("Prisma database connected!")
    
    async def disconnect(self):
        """Disconnect from the database"""
        if self._connected:
            await self.db.disconnect()
            self._connected = False
    
    async def save_events(self, events: List[PlayerEvent]) -> int:
        """
        Save player events to database
        Returns: Number of events saved
        """
        if not self._connected:
            await self.connect()
        saved_count = 0
        
        for event in events:
            try:
                # Parse match time
                match_time = self._parse_timestamp(event.timestamp)
                
                # Create or update event
                await self.db.playerevent.upsert(
                    where={
                        "eventId_player_eventType_minute": {
                            "eventId": str(event.id),
                            "player": event.player,
                            "eventType": event.type,
                            "minute": event.minute
                        }
                    },
                    data={
                        "create": {
                            "eventId": str(event.id),
                            "player": event.player,
                            "position": "",  # Not available in current model
                            "team": event.team or "",
                            "eventType": event.type,
                            "event": event.event,
                            "context": event.context,
                            "league": event.league,
                            "minute": event.minute,
                            "timestamp": event.timestamp,
                            "matchTime": match_time
                        },
                        "update": {
                            "context": event.context,
                            "timestamp": event.timestamp,
                            "matchTime": match_time
                        }
                    }
                )
                saved_count += 1
            except Exception as e:
                print(f"Error saving event {event.id}: {e}")
                continue
        
        return saved_count
    
    async def get_recent_events(
        self,
        event_type: Optional[str] = None,
        player: Optional[str] = None,
        days: int = 200
    ) -> List[PlayerEvent]:
        """
        Get recent events from database
        
        Args:
            event_type: Filter by event type (goal, assist, card)
            player: Filter by player name
            days: Number of days to look back
        
        Returns:
            List of PlayerEvent objects
        """
        if not self._connected:
            await self.connect()
        
        # Calculate cutoff date
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        
        # Build filters
        where_clause = {
            "matchTime": {
                "gte": cutoff
            }
        }
        
        if event_type:
            where_clause["eventType"] = event_type
        
        if player:
            where_clause["player"] = player
        
        # Query database
        db_events = await self.db.playerevent.find_many(
            where=where_clause,
            order={
                "matchTime": "desc"
            }
        )
        
        # Convert to PlayerEvent models
        events = []
        for db_event in db_events:
            events.append(PlayerEvent(
                id=db_event.eventId,
                player=db_event.player,
                team=db_event.team or "",
                type=db_event.eventType,
                event=db_event.event,
                context=db_event.context,
                league=db_event.league,
                minute=db_event.minute,
                timestamp=db_event.timestamp
            ))
        
        return events
    
    async def get_event_count(self) -> int:
        if not self._connected:
            """Get total number of events in database"""
        await self.connect()
        return await self.db.playerevent.count()
    
    async def get_latest_scrape_time(self) -> Optional[datetime]:
        if not self._connected:
            """Get the timestamp of the last successful scrape"""
        await self.connect()
        
        latest_run = await self.db.scraperrun.find_first(
            where={"success": True},
            order={"ranAt": "desc"}
        )
        
        return latest_run.ranAt if latest_run else None
    
    async def log_scraper_run(self, events_found: int, success: bool, error: str = None):
        """Log a scraper run"""
        if not self._connected:
            await self.connect()
        
        await self.db.scraperrun.create(
            data={
                "eventsFound": events_found,
                "success": success,
                "error": error
            }
        )
    
    def _parse_timestamp(self, timestamp_str: str) -> datetime:
        """Parse timestamp string to datetime"""
        # Try to extract time from relative timestamp
        now = datetime.now(timezone.utc)
        
        if "just now" in timestamp_str.lower():
            return now
        elif "minute" in timestamp_str:
            try:
                minutes = int(timestamp_str.split()[0])
                return now - timedelta(minutes=minutes)
            except:
                pass
        elif "hour" in timestamp_str:
            try:
                hours = int(timestamp_str.split()[0])
                return now - timedelta(hours=hours)
            except:
                pass
        elif "day" in timestamp_str:
            try:
                days = int(timestamp_str.split()[0])
                return now - timedelta(days=days)
            except:
                pass
        
        # Default to recent past
        return now - timedelta(hours=1)
    
    async def save_season_stats(self, stats_data: dict) -> int:
        """
        Save player season statistics to database
        Returns: Number of player stats saved
        """
        if not self._connected:
            await self.connect()
        
        saved_count = 0
        
        for player_name, stats in stats_data.items():
            try:
                await self.db.playerseasonstats.upsert(
                    where={"player": player_name},
                    data={
                        "create": {
                            "player": player_name,
                            "position": stats.get("position", ""),
                            "team": stats.get("team", ""),
                            "hardcodedTeam": stats.get("hardcoded_team", stats.get("team", "")),
                            "league": stats.get("league", ""),
                            "season": stats.get("season", "2025/26"),
                            "matches": stats.get("matches", 0),
                            "minutes": stats.get("minutes", 0),
                            "goals": stats.get("goals", 0),
                            "assists": stats.get("assists", 0),
                            "rating": float(stats.get("rating", 0.0)),
                            "formRating": float(stats.get("form_rating", 0.0))
                        },
                        "update": {
                            "position": stats.get("position", ""),
                            "team": stats.get("team", ""),
                            "hardcodedTeam": stats.get("hardcoded_team", stats.get("team", "")),
                            "league": stats.get("league", ""),
                            "season": stats.get("season", "2025/26"),
                            "matches": stats.get("matches", 0),
                            "minutes": stats.get("minutes", 0),
                            "goals": stats.get("goals", 0),
                            "assists": stats.get("assists", 0),
                            "rating": float(stats.get("rating", 0.0)),
                            "formRating": float(stats.get("form_rating", 0.0))
                        }
                    }
                )
                saved_count += 1
            except Exception as e:
                print(f"Error saving stats for {player_name}: {e}")
                continue
        
        return saved_count
    
    async def get_season_stats(self, player: Optional[str] = None) -> dict:
        """
        Get season statistics from database
        
        Args:
            player: Optional player name to filter by
        
        Returns:
            Dictionary of player stats
        """
        if not self._connected:
            await self.connect()
        
        where_clause = {}
        if player:
            where_clause["player"] = player
        
        db_stats = await self.db.playerseasonstats.find_many(where=where_clause)
        
        # Convert to dictionary format expected by frontend
        stats_dict = {}
        for stat in db_stats:
            stats_dict[stat.player] = {
                "player": stat.player,
                "position": stat.position,
                "team": stat.team,
                "hardcoded_team": stat.hardcodedTeam,
                "league": stat.league,
                "season": stat.season,
                "matches": stat.matches,
                "minutes": stat.minutes,
                "goals": stat.goals,
                "assists": stat.assists,
                "rating": stat.rating,
                "form_rating": stat.formRating
            }
        
        return stats_dict
    
    async def get_latest_stats_scrape_time(self) -> Optional[datetime]:
        """Get the timestamp of the last successful stats scrape"""
        if not self._connected:
            await self.connect()
        
        latest_run = await self.db.statsscraperrun.find_first(
            where={"success": True},
            order={"ranAt": "desc"}
        )
        
        return latest_run.ranAt if latest_run else None
    
    async def log_stats_scraper_run(self, players_found: int, success: bool, error: str = None):
        """Log a stats scraper run"""
        if not self._connected:
            await self.connect()
        
        await self.db.statsscraperrun.create(
            data={
                "playersFound": players_found,
                "success": success,
                "error": error
            }
        )


# Global database service instance
db_service = DatabaseService()
