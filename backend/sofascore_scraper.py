import asyncio
import tls_client
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any
from models import PlayerEvent
from players import SOFASCORE_PLAYER_IDS


class SofaScoreScraper:
    """
    SofaScore API scraper using tls_client for browser-like TLS
    """
    
    def __init__(self):
        self.base_url = "https://api.sofascore.com/api/v1"
        self.sofascore_player_ids = SOFASCORE_PLAYER_IDS
        # Create session with browser-like TLS
        self.session = tls_client.Session(
            client_identifier="chrome_120",
            random_tls_extension_order=True
        )
    
    def get_player_id(self, player_name: str) -> int:
        """Get player ID from player name"""
        player_data = self.sofascore_player_ids.get(player_name, {})
        return player_data.get("id", 0) if isinstance(player_data, dict) else 0
    
    def get_player_position(self, player_name: str) -> str:
        """Get player position from player name"""
        player_data = self.sofascore_player_ids.get(player_name, {})
        return player_data.get("position", "N/A") if isinstance(player_data, dict) else "N/A"
    
    def get_player_team(self, player_name: str) -> str:
        """Get player team from player name"""
        player_data = self.sofascore_player_ids.get(player_name, {})
        return player_data.get("team", "Unknown") if isinstance(player_data, dict) else "Unknown"

    def calculate_timestamp(self, match_time: str) -> str:
        """Calculate relative timestamp from match time"""
        try:
            # Parse ISO format time
            match_datetime = datetime.fromisoformat(match_time.replace('Z', '+00:00'))
            now = datetime.now(timezone.utc)
            diff = now - match_datetime
            
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
        """
        Get recent events for Canadian players from SofaScore
        Uses tls_client to bypass API restrictions
        """
        all_events = []
        event_id = 1
        
        try:
            print("\n🔍 Fetching player events from SofaScore...")
            
            # Try to fetch last events for each player
            for player_name, player_data in self.sofascore_player_ids.items():
                try:
                    # Get player ID from the data structure
                    player_id = player_data.get("id") if isinstance(player_data, dict) else player_data
                    # Get player's last events
                    url = f"{self.base_url}/player/{player_id}/events/last/0"
                    
                    # Run synchronous request in thread pool
                    response = await asyncio.to_thread(self.session.get, url)
                    
                    if response.status_code == 200:
                        data = response.json()
                        events = data.get("events", [])
                        
                        print(f"   Checking {player_name}...")
                        
                        # Process events from entire 2025/26 season (started August 2025)
                        # Include matches from last 200 days to cover whole season including pre-season
                        cutoff_time = datetime.now(timezone.utc) - timedelta(days=200)
                        
                        for event in events[:35]:  # Check last 35 matches per player
                            match_time = event.get("startTimestamp", 0)
                            event_datetime = datetime.fromtimestamp(match_time, tz=timezone.utc)
                            
                            # Skip old matches
                            if event_datetime < cutoff_time:
                                continue
                            
                            # Check if match is finished
                            status = event.get("status", {}).get("type", "")
                            if status not in ["finished"]:
                                continue
                            
                            event_id_num = event.get("id")
                            if not event_id_num:
                                continue
                            
                            # Get match incidents
                            incidents_url = f"{self.base_url}/event/{event_id_num}/incidents"
                            inc_response = await asyncio.to_thread(self.session.get, incidents_url)
                            
                            if inc_response.status_code != 200:
                                continue
                            
                            incidents_data = inc_response.json()
                            incidents = incidents_data.get("incidents", [])
                            
                            if not incidents:
                                continue
                            
                            # Get match info
                            home_team = event.get("homeTeam", {}).get("name", "")
                            away_team = event.get("awayTeam", {}).get("name", "")
                            home_score = event.get("homeScore", {}).get("current", 0)
                            away_score = event.get("awayScore", {}).get("current", 0)
                            score_str = f"{home_score}-{away_score}"
                            tournament = event.get("tournament", {}).get("name", "Unknown League")
                            
                            # Process each incident for this player
                            for incident in incidents:
                                incident_player = incident.get("player", {})
                                if not incident_player:
                                    continue
                                
                                incident_player_id = incident_player.get("id")
                                event_type = None
                                event_name = None
                                
                                if incident_player_id != player_id:
                                    # Check for assists
                                    assist_player = incident.get("assist1", {})
                                    if assist_player.get("id") != player_id:
                                        continue
                                    else:
                                        # This is an assist
                                        event_type = "assist"
                                        event_name = "Assist"
                                else:
                                    # Parse incident type
                                    incident_type = incident.get("incidentType", "")
                                    
                                    if incident_type == "goal":
                                        event_type = "goal"
                                        event_name = "Goal"
                                    elif incident_type == "card":
                                        # Check card type from incidentClass
                                        incident_class = incident.get("incidentClass", "")
                                        event_type = "card"
                                        if incident_class == "red":
                                            event_name = "Red Card"
                                        else:
                                            event_name = "Yellow Card"
                                    elif incident_type == "yellowCard":
                                        event_type = "card"
                                        event_name = "Yellow Card"
                                    elif incident_type == "redCard":
                                        event_type = "card"
                                        event_name = "Red Card"
                                    elif incident_type == "substitution":
                                        if incident.get("playerIn", {}).get("id") == player_id:
                                            event_type = "substitution"
                                            event_name = "Substitution"
                                        else:
                                            continue
                                    else:
                                        continue
                                
                                if not event_type:
                                    continue
                                
                                minute = incident.get("time", 0)
                                context = f"{home_team} {score_str} {away_team}"
                                timestamp = self.calculate_timestamp_from_unix(match_time)
                                
                                # Determine player's team
                                is_home = incident.get("isHome", False)
                                player_team = home_team if is_home else away_team
                                
                                # Use incident ID if available, otherwise create composite ID
                                incident_id = incident.get("id")
                                if incident_id:
                                    unique_event_id = incident_id
                                else:
                                    # Fallback: create composite ID from match + player + type + minute
                                    unique_event_id = f"{event_id_num}_{player_id}_{event_type}_{minute}"
                                
                                print(f"      ✅ Found: {player_name} - {event_name} at {minute}' in {context}")
                                
                                all_events.append(PlayerEvent(
                                    id=unique_event_id,
                                    player=player_name,
                                    event=event_name,
                                    type=event_type,
                                    context=context,
                                    minute=f"{minute}'",
                                    timestamp=timestamp,
                                    league=tournament,
                                    team=player_team,
                                    unix_timestamp=match_time  # Store actual timestamp for sorting
                                ))
                        
                        # Small delay between requests
                        await asyncio.sleep(0.5)
                        
                    else:
                        print(f"   ⚠️ Could not fetch data for {player_name} (status: {response.status_code})")
                        
                except Exception as e:
                    print(f"   Error processing player {player_name}: {e}")
                    continue
        
        except Exception as e:
            print(f"❌ Error getting player events: {e}")
            import traceback
            traceback.print_exc()
        
        print(f"\n✅ Total events found: {len(all_events)}")
        
        # Sort by most recent (unix_timestamp descending) and return all events
        return sorted(all_events, key=lambda x: x.unix_timestamp or 0, reverse=True) if all_events else []
    
    def calculate_timestamp_from_unix(self, unix_timestamp: int) -> str:
        """Calculate relative timestamp from Unix timestamp"""
        try:
            match_datetime = datetime.fromtimestamp(unix_timestamp, tz=timezone.utc)
            now = datetime.now(timezone.utc)
            diff = now - match_datetime
            
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


    async def get_player_season_stats(self, player_name: str = None) -> Dict[str, Any]:
        """
        Get current season statistics for Canadian players from SofaScore
        Returns TOTAL season data aggregated across all competitions (not just one league)
        """
        all_stats = {}
        
        try:
            print(f"\n📊 Fetching season statistics from SofaScore...")
            
            # If specific player requested, filter to that player
            players_to_fetch = self.sofascore_player_ids
            if player_name and player_name in self.sofascore_player_ids:
                players_to_fetch = {player_name: self.sofascore_player_ids[player_name]}
            
            for player_name, player_data in players_to_fetch.items():
                try:
                    # Get player ID from the data structure
                    player_id = player_data.get("id") if isinstance(player_data, dict) else player_data
                    # Get player statistics for current season
                    url = f"{self.base_url}/player/{player_id}/statistics/seasons"
                    
                    response = await asyncio.to_thread(self.session.get, url)
                    
                    if response.status_code == 200:
                        data = response.json()
                        unique_tournaments = data.get("uniqueTournamentSeasons", [])
                        
                        # Aggregate stats across all competitions for 25/26 season
                        total_matches = 0
                        total_minutes = 0
                        total_goals = 0
                        total_assists = 0
                        total_ratings = []
                        team_name = "Unknown"
                        found_season = False
                        
                        # List of international competitions to exclude (not club competitions)
                        international_competitions = [
                            "CONCACAF Gold Cup",
                            "FIFA World Cup",
                            "Copa America",
                            "UEFA European Championship",
                            "Africa Cup of Nations",
                            "AFC Asian Cup",
                            "CONCACAF Nations League",
                            "UEFA Nations League",
                            "International Friendlies",
                            "World Cup Qualification",
                            "Olympic Games"
                        ]
                        
                        for tournament in unique_tournaments:
                            seasons = tournament.get("seasons", [])
                            for season in seasons:
                                # Look for 2025/2026 season
                                season_name = season.get("name", "")
                                if "25/26" in season_name or "2025" in season_name:
                                    season_id = season.get("id")
                                    tournament_id = tournament.get("uniqueTournament", {}).get("id")
                                    
                                    # Get team name from first season found
                                    if team_name == "Unknown":
                                        team_name = season.get("team", {}).get("name", "Unknown")
                                    
                                    # Fetch detailed stats for this tournament/season
                                    stats_url = f"{self.base_url}/player/{player_id}/unique-tournament/{tournament_id}/season/{season_id}/statistics/overall"
                                    stats_response = await asyncio.to_thread(self.session.get, stats_url)
                                    
                                    if stats_response.status_code == 200:
                                        stats_data = stats_response.json()
                                        statistics = stats_data.get("statistics", {})
                                        
                                        league_name = tournament.get("uniqueTournament", {}).get("name", "Unknown")
                                        
                                        # Skip international competitions
                                        if league_name in international_competitions:
                                            print(f"      ⏭️  Skipping {league_name} (international competition)")
                                            continue
                                        
                                        # Aggregate stats from this competition
                                        matches = statistics.get("appearances", 0)
                                        if matches > 0:
                                            found_season = True
                                            total_matches += matches
                                            total_minutes += statistics.get("minutesPlayed", 0)
                                            total_goals += statistics.get("goals", 0)
                                            total_assists += statistics.get("assists", 0)
                                            rating = statistics.get("rating", 0)
                                            if rating > 0:
                                                total_ratings.append(rating)
                                            
                                            league_name = tournament.get("uniqueTournament", {}).get("name", "Unknown")
                                            minutes_in_comp = statistics.get("minutesPlayed", 0)
                                            print(f"      - {league_name}: {matches} matches, {minutes_in_comp} mins, {statistics.get('goals', 0)}G {statistics.get('assists', 0)}A")
                        
                        if found_season and total_matches > 0:
                            # Calculate average rating weighted by matches played
                            avg_rating = sum(total_ratings) / len(total_ratings) if total_ratings else 0
                            
                            # Get hardcoded position and team from players.py
                            position = self.get_player_position(player_name)
                            hardcoded_team = self.get_player_team(player_name)
                            
                            all_stats[player_name] = {
                                "player": player_name,
                                "team": team_name,  # Team from SofaScore API
                                "hardcoded_team": hardcoded_team,  # Team from players.py
                                "position": position,  # Position from players.py
                                "league": "All Competitions",
                                "season": "2025/26",
                                "matches": total_matches,
                                "minutes": total_minutes,
                                "goals": total_goals,
                                "assists": total_assists,
                                "rating": round(avg_rating, 2) if avg_rating else 0,
                                "form_rating": round(avg_rating * 10, 0) if avg_rating else 0  # Scale to 0-100
                            }
                            
                            print(f"   ✅ {player_name}: {total_matches} matches, {total_goals} goals, {total_assists} assists ({team_name})")
                        else:
                            print(f"   ⚠️ No 25/26 season data found for {player_name}")
                    
                    else:
                        print(f"   ⚠️ Could not fetch stats for {player_name} (status: {response.status_code})")
                    
                    # Small delay between requests
                    await asyncio.sleep(0.3)
                    
                except Exception as e:
                    print(f"   ❌ Error processing {player_name}: {e}")
                    import traceback
                    traceback.print_exc()
                    continue
            
            print(f"\n✅ Stats fetched for {len(all_stats)} players")
            
        except Exception as e:
            print(f"❌ Error getting season statistics: {e}")
            import traceback
            traceback.print_exc()
        
        return all_stats


    async def get_player_matches(self) -> List[Dict[str, Any]]:
        """
        Get all match appearances for Canadian players from SofaScore
        Returns complete match list regardless of events
        """
        all_matches = []
        
        try:
            print("\n🔍 Fetching player match appearances from SofaScore...")
            
            for player_name, player_data in self.sofascore_player_ids.items():
                try:
                    player_id = player_data.get("id") if isinstance(player_data, dict) else player_data
                    url = f"{self.base_url}/player/{player_id}/events/last/0"
                    
                    response = await asyncio.to_thread(self.session.get, url)
                    
                    if response.status_code == 200:
                        data = response.json()
                        events = data.get("events", [])
                        
                        print(f"   Checking {player_name}...")
                        
                        # Process matches from 2025/26 season
                        cutoff_time = datetime.now(timezone.utc) - timedelta(days=200)
                        
                        for event in events[:35]:
                            match_time = event.get("startTimestamp", 0)
                            event_datetime = datetime.fromtimestamp(match_time, tz=timezone.utc)
                            
                            if event_datetime < cutoff_time:
                                continue
                            
                            status = event.get("status", {}).get("type", "")
                            if status not in ["finished"]:
                                continue
                            
                            match_id = event.get("id")
                            if not match_id:
                                continue
                            
                            # Get match details
                            home_team = event.get("homeTeam", {}).get("name", "")
                            away_team = event.get("awayTeam", {}).get("name", "")
                            home_score = event.get("homeScore", {}).get("current", 0)
                            away_score = event.get("awayScore", {}).get("current", 0)
                            score_str = f"{home_score}-{away_score}"
                            tournament = event.get("tournament", {}).get("name", "Unknown League")
                            
                            # Determine player's team
                            player_team = self.get_player_team(player_name)
                            is_home = home_team == player_team or home_team in player_team
                            opponent = away_team if is_home else home_team
                            
                            timestamp = self.calculate_timestamp_from_unix(match_time)
                            
                            print(f"      ✅ Found match: {player_name} in {home_team} {score_str} {away_team}")
                            
                            all_matches.append({
                                "match_id": str(match_id),
                                "player": player_name,
                                "team": player_team,
                                "opponent": opponent,
                                "score": score_str,
                                "league": tournament,
                                "match_time": event_datetime,
                                "timestamp": timestamp,
                                "is_substitute": False,  # Will be updated from events if substitution found
                                "rating": None,  # Not available in match list
                            })
                        
                        await asyncio.sleep(0.5)
                        
                    else:
                        print(f"   ⚠️ Could not fetch data for {player_name} (status: {response.status_code})")
                        
                except Exception as e:
                    print(f"   Error processing player {player_name}: {e}")
                    continue
        
        except Exception as e:
            print(f"❌ Error getting player matches: {e}")
            import traceback
            traceback.print_exc()
        
        print(f"\n✅ Total matches found: {len(all_matches)}")
        return all_matches




sofascore_scraper = SofaScoreScraper()

