#!/usr/bin/env python3
"""
Quick script to check database status
Usage: python check_db.py
"""

import asyncio
from database import db_service
from datetime import datetime


async def main():
    print("\n" + "="*60)
    print("📊 Database Status")
    print("="*60 + "\n")
    
    # Get total count
    total = await db_service.get_event_count()
    print(f"Total events in database: {total}")
    
    # Get last scrape time
    last_scrape = await db_service.get_latest_scrape_time()
    if last_scrape:
        time_diff = datetime.now(last_scrape.tzinfo) - last_scrape
        hours_ago = time_diff.total_seconds() / 3600
        print(f"Last successful scrape: {last_scrape.isoformat()}")
        print(f"                       ({hours_ago:.1f} hours ago)")
    else:
        print("Last successful scrape: Never")
    
    # Get recent events
    print(f"\nFetching recent events...\n")
    events = await db_service.get_recent_events()
    
    if events:
        print(f"Sample of {min(10, len(events))} most recent events:\n")
        for i, event in enumerate(events[:10], 1):
            print(f"{i:2}. {event.player:20} - {event.event:12} in {event.league}")
    else:
        print("⚠️  No events found in database")
    
    # Player stats
    print(f"\n{'='*60}")
    print("Top 10 Players by Event Count")
    print("="*60 + "\n")
    
    player_counts = {}
    for event in events:
        player_counts[event.player] = player_counts.get(event.player, 0) + 1
    
    top_players = sorted(player_counts.items(), key=lambda x: x[1], reverse=True)[:10]
    for i, (player, count) in enumerate(top_players, 1):
        print(f"{i:2}. {player:25} - {count:3} events")
    
    print("\n" + "="*60 + "\n")
    
    await db_service.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
