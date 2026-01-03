#!/usr/bin/env python3
"""
Standalone scraper script to fetch events and save to database.
Can be run manually or via cron job.

Usage:
    python scrape_and_save.py
    
Or schedule with cron (every 30 minutes):
    */30 * * * * cd /path/to/backend && python scrape_and_save.py >> logs/scraper.log 2>&1
"""

import asyncio
import sys
from datetime import datetime, timezone
from sofascore_scraper import sofascore_scraper
from database import db_service


async def main():
    """Run the scraper and save events to database"""
    print(f"\n{'='*60}")
    print(f"🔄 Starting scraper at {datetime.now(timezone.utc).isoformat()}")
    print(f"{'='*60}\n")
    
    try:
        # Fetch events from SofaScore
        print("📡 Fetching events from SofaScore...")
        events = await sofascore_scraper.get_canadian_player_events()
        events_found = len(events)
        print(f"✅ Found {events_found} events")
        
        if events_found == 0:
            print("⚠️  No events found. Database not updated.")
            await db_service.log_scraper_run(
                events_found=0,
                success=True,
                error="No events found"
            )
            return
        
        # Save to database
        print("💾 Saving events to database...")
        events_saved = await db_service.save_events(events)
        print(f"✅ Saved {events_saved} events to database")
        
        # Log the scraper run
        await db_service.log_scraper_run(
            events_found=events_found,
            success=True
        )
        
        # Get database stats
        total_events = await db_service.get_event_count()
        print(f"📊 Total events in database: {total_events}")
        
        print(f"\n{'='*60}")
        print(f"✨ Scrape complete at {datetime.now(timezone.utc).isoformat()}")
        print(f"{'='*60}\n")
        
        return 0
        
    except Exception as e:
        error_msg = str(e)
        print(f"\n❌ ERROR: {error_msg}")
        
        import traceback
        traceback.print_exc()
        
        # Log failed run
        try:
            await db_service.log_scraper_run(
                events_found=0,
                success=False,
                error=error_msg
            )
        except:
            pass
        
        return 1
    
    finally:
        # Ensure database connection is closed
        await db_service.disconnect()


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
