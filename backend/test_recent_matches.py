#!/usr/bin/env python3
"""
Test script to check what recent matches are available
"""

import asyncio
from sofascore_scraper import sofascore_scraper
from datetime import datetime, timezone


async def main():
    print("\n" + "="*80)
    print(" 🔍 CHECKING RECENT MATCHES FOR CANADIAN PLAYERS")
    print("="*80)
    
    # Check a few players
    test_players = ["Tajon Buchanan", "Jonathan David", "Theo Bair"]
    
    for player_name in test_players:
        player_data = sofascore_scraper.sofascore_player_ids.get(player_name)
        if not player_data:
            continue
            
        player_id = player_data.get("id") if isinstance(player_data, dict) else player_data
        
        print(f"\n{'='*80}")
        print(f"🏃 {player_name} (ID: {player_id})")
        print("="*80)
        
        url = f"{sofascore_scraper.base_url}/player/{player_id}/events/last/0"
        response = await asyncio.to_thread(sofascore_scraper.session.get, url)
        
        if response.status_code == 200:
            data = response.json()
            events = data.get("events", [])
            
            print(f"Total matches found: {len(events)}")
            print("\nLast 5 matches:")
            
            for i, event in enumerate(events[:5], 1):
                match_time = event.get("startTimestamp", 0)
                event_datetime = datetime.fromtimestamp(match_time, tz=timezone.utc)
                now = datetime.now(timezone.utc)
                days_ago = (now - event_datetime).days
                
                status = event.get("status", {}).get("type", "")
                home_team = event.get("homeTeam", {}).get("name", "")
                away_team = event.get("awayTeam", {}).get("name", "")
                home_score = event.get("homeScore", {}).get("current", 0)
                away_score = event.get("awayScore", {}).get("current", 0)
                tournament = event.get("tournament", {}).get("name", "")
                
                print(f"\n  {i}. {home_team} {home_score}-{away_score} {away_team}")
                print(f"     League: {tournament}")
                print(f"     Status: {status}")
                print(f"     Date: {event_datetime.strftime('%Y-%m-%d')} ({days_ago} days ago)")
        else:
            print(f"❌ Failed to fetch data (status: {response.status_code})")
        
        await asyncio.sleep(0.5)


if __name__ == "__main__":
    asyncio.run(main())
