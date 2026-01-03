#!/usr/bin/env python3
"""
Test script to fetch recent player events from SofaScore
"""

import asyncio
from sofascore_scraper import sofascore_scraper


async def main():
    print("\n" + "="*80)
    print(" 🍁 FETCHING CANADIAN PLAYER MATCH EVENTS")
    print("="*80)
    
    # Get player events
    events = await sofascore_scraper.get_canadian_player_events()
    
    if not events:
        print("\n❌ No events found!")
        return
    
    print(f"\n✅ Found {len(events)} events!\n")
    print("="*80)
    
    for event in events:
        print(f"\n🏃 {event.player}")
        print(f"   Event:     {event.event} ({event.type})")
        print(f"   Context:   {event.context}")
        print(f"   Minute:    {event.minute}")
        print(f"   League:    {event.league}")
        print(f"   Team:      {event.team}")
        print(f"   Timestamp: {event.timestamp}")
        print("-" * 80)


if __name__ == "__main__":
    asyncio.run(main())
