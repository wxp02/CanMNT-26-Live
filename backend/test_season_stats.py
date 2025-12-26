#!/usr/bin/env python3
"""
Test script to fetch and display season statistics for Canadian players
"""
import asyncio
from sofascore_scraper import sofascore_scraper


async def main():
    print("=" * 80)
    print("🍁 CANADIAN PLAYERS - 2025/26 SEASON STATISTICS")
    print("=" * 80)
    print()
    
    # Fetch all player stats
    stats = await sofascore_scraper.get_player_season_stats()
    
    if not stats:
        print("❌ No stats found!")
        return
    
    # Display stats in a nice format
    print(f"\n📊 Found stats for {len(stats)} player(s):\n")
    
    for player_name, player_stats in stats.items():
        print(f"{'=' * 60}")
        print(f"🏃 {player_stats['player']}")
        print(f"{'=' * 60}")
        print(f"   Team:     {player_stats['team']}")
        print(f"   League:   {player_stats['league']}")
        print(f"   Season:   {player_stats['season']}")
        print(f"   Matches:  {player_stats['matches']}")
        print(f"   Minutes:  {player_stats['minutes']}")
        print(f"   Goals:    {player_stats['goals']}")
        print(f"   Assists:  {player_stats['assists']}")
        print(f"   Rating:   {player_stats['rating']}")
        print(f"   Form:     {player_stats['form_rating']}/100")
        print()


if __name__ == "__main__":
    asyncio.run(main())
