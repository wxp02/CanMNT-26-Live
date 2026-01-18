#!/usr/bin/env python3
"""
Scrape season statistics and save to database
"""

import asyncio
from sofascore_scraper import sofascore_scraper
from database import db_service


async def main():
    """Scrape season stats and save to database"""
    print("\n📊 Starting season stats scrape...\n")
    
    try:
        # Connect to database
        await db_service.connect()
        
        # Fetch stats from SofaScore
        print("Fetching season stats from SofaScore...")
        stats = await sofascore_scraper.get_player_season_stats()
        print(f"\n✅ Found stats for {len(stats)} players\n")
        
        # Save to database
        print("💾 Saving to database...")
        saved = await db_service.save_season_stats(stats)
        print(f"✅ Saved stats for {saved} players\n")
        
        # Log the scraper run
        await db_service.log_stats_scraper_run(
            players_found=len(stats),
            success=True
        )
        
        return 0
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return 1
        
    finally:
        await db_service.disconnect()


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    exit(exit_code)
