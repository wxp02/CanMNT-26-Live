import asyncio
import tls_client
from datetime import datetime, timezone
from players import SOFASCORE_PLAYER_IDS

async def check_buchanan_dec6():
    """Check Buchanan's matches around December 6, 2025"""
    
    session = tls_client.Session(
        client_identifier="chrome_120",
        random_tls_extension_order=True
    )
    
    player_name = "Tajon Buchanan"
    player_id = SOFASCORE_PLAYER_IDS[player_name]["id"]
    
    base_url = "https://api.sofascore.com/api/v1"
    url = f"{base_url}/player/{player_id}/events/last/0"
    
    print(f"\n🔍 Checking {player_name}'s matches around December 6, 2025...\n")
    
    response = await asyncio.to_thread(session.get, url)
    
    if response.status_code != 200:
        print(f"❌ Failed to fetch data: {response.status_code}")
        return
    
    data = response.json()
    events = data.get("events", [])
    
    print(f"Total matches in API: {len(events)}\n")
    
    # Look for matches in December 2025
    target_date = datetime(2025, 12, 6, tzinfo=timezone.utc)
    
    for i, event in enumerate(events[:30], 1):
        match_time = event.get("startTimestamp", 0)
        event_datetime = datetime.fromtimestamp(match_time, tz=timezone.utc)
        
        # Show all December matches
        if event_datetime.month == 12 and event_datetime.year == 2025:
            home_team = event.get("homeTeam", {}).get("name", "")
            away_team = event.get("awayTeam", {}).get("name", "")
            home_score = event.get("homeScore", {}).get("current", 0)
            away_score = event.get("awayScore", {}).get("current", 0)
            status = event.get("status", {}).get("type", "")
            event_id = event.get("id")
            
            print(f"Match {i}: {home_team} {home_score}-{away_score} {away_team}")
            print(f"   Date: {event_datetime.strftime('%a %b %d, %Y at %H:%M UTC')}")
            print(f"   Status: {status}")
            print(f"   Event ID: {event_id}")
            
            if status in ["finished", "ended"]:
                # Get incidents
                incidents_url = f"{base_url}/event/{event_id}/incidents"
                inc_response = await asyncio.to_thread(session.get, incidents_url)
                
                if inc_response.status_code == 200:
                    incidents_data = inc_response.json()
                    incidents = incidents_data.get("incidents", [])
                    
                    print(f"   Total incidents in match: {len(incidents)}")
                    
                    buchanan_incidents = []
                    for incident in incidents:
                        incident_player = incident.get("player", {})
                        incident_player_id = incident_player.get("id")
                        
                        if incident_player_id == player_id:
                            incident_type = incident.get("incidentType", "")
                            incident_class = incident.get("incidentClass", "")
                            minute = incident.get("time", 0)
                            buchanan_incidents.append(f"{incident_type} ({incident_class}) at {minute}'")
                        
                        # Check assists
                        assist_player = incident.get("assist1", {})
                        if assist_player.get("id") == player_id:
                            minute = incident.get("time", 0)
                            buchanan_incidents.append(f"assist at {minute}'")
                    
                    if buchanan_incidents:
                        print(f"   ✅ Buchanan's involvement: {', '.join(buchanan_incidents)}")
                    else:
                        print(f"   ⚠️ No incidents found for Buchanan in this match")
                else:
                    print(f"   ❌ Could not fetch incidents (status: {inc_response.status_code})")
            else:
                print(f"   ⏸️ Match not finished yet")
            
            print()
            
            # Small delay between requests
            await asyncio.sleep(0.3)

if __name__ == "__main__":
    asyncio.run(check_buchanan_dec6())
