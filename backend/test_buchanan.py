#!/usr/bin/env python3
"""
Deep dive into Tajon Buchanan's matches to see why we're missing data
"""

import asyncio
from sofascore_scraper import sofascore_scraper
from datetime import datetime, timezone, timedelta


async def main():
    print("\n" + "="*80)
    print(" 🔍 DEEP DIVE: TAJON BUCHANAN MATCHES")
    print("="*80)
    
    player_name = "Tajon Buchanan"
    player_data = sofascore_scraper.sofascore_player_ids.get(player_name)
    player_id = player_data.get("id") if isinstance(player_data, dict) else player_data
    
    print(f"\n🏃 {player_name} (ID: {player_id})")
    
    url = f"{sofascore_scraper.base_url}/player/{player_id}/events/last/0"
    response = await asyncio.to_thread(sofascore_scraper.session.get, url)
    
    if response.status_code != 200:
        print(f"❌ Failed to fetch data")
        return
    
    data = response.json()
    events = data.get("events", [])
    
    print(f"\nTotal matches found: {len(events)}")
    
    cutoff_time = datetime.now(timezone.utc) - timedelta(days=200)
    
    for i, event in enumerate(events[:25], 1):
        match_time = event.get("startTimestamp", 0)
        event_datetime = datetime.fromtimestamp(match_time, tz=timezone.utc)
        
        # Skip old matches
        if event_datetime < cutoff_time:
            continue
        
        status = event.get("status", {}).get("type", "")
        if status not in ["finished"]:
            continue
        
        event_id_num = event.get("id")
        home_team = event.get("homeTeam", {}).get("name", "")
        away_team = event.get("awayTeam", {}).get("name", "")
        home_score = event.get("homeScore", {}).get("current", 0)
        away_score = event.get("awayScore", {}).get("current", 0)
        tournament = event.get("tournament", {}).get("name", "")
        
        days_ago = (datetime.now(timezone.utc) - event_datetime).days
        
        print(f"\n{'='*80}")
        print(f"Match {i}: {home_team} {home_score}-{away_score} {away_team}")
        print(f"League: {tournament}")
        print(f"Date: {event_datetime.strftime('%Y-%m-%d')} ({days_ago} days ago)")
        
        # Get incidents
        incidents_url = f"{sofascore_scraper.base_url}/event/{event_id_num}/incidents"
        inc_response = await asyncio.to_thread(sofascore_scraper.session.get, incidents_url)
        
        if inc_response.status_code == 200:
            incidents_data = inc_response.json()
            incidents = incidents_data.get("incidents", [])
            
            print(f"Total incidents: {len(incidents)}")
            
            # Check for Buchanan's involvement
            buchanan_incidents = []
            for incident in incidents:
                incident_player = incident.get("player", {})
                incident_player_id = incident_player.get("id")
                
                # Check if Buchanan is the player
                if incident_player_id == player_id:
                    incident_type = incident.get("incidentType", "")
                    incident_type_class = incident.get("incidentClass", "")
                    time = incident.get("time", 0)
                    buchanan_incidents.append(f"  ✅ {incident_type} (class: {incident_type_class}) at {time}'")
                
                # Check if Buchanan assisted
                assist_player = incident.get("assist1", {})
                if assist_player.get("id") == player_id:
                    time = incident.get("time", 0)
                    buchanan_incidents.append(f"  ✅ assist at {time}'")
            
            if buchanan_incidents:
                print("Buchanan's involvement:")
                for inc in buchanan_incidents:
                    print(inc)
            else:
                print("❌ No incidents found for Buchanan in this match")
        else:
            print(f"❌ Could not fetch incidents (status: {inc_response.status_code})")
        
        await asyncio.sleep(0.3)


if __name__ == "__main__":
    asyncio.run(main())
