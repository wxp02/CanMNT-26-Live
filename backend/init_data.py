"""
Initial data population script
Run this once after deployment to populate the database
"""
import asyncio
from sofascore_scraper import sofascore_scraper
from database import db_service


async def main():
    print("🚀 Starting initial data population...")
    
    # Connect to database
    await db_service.connect()
    print("✅ Connected to database")
    
    # Scrape events
    print("📊 Scraping player events...")
    events = await sofascore_scraper.get_canadian_player_events()
    print(f"Found {len(events)} events")
    
    # Save to database
    print("💾 Saving to database...")
    saved = await db_service.save_events(events)
    print(f"✅ Saved {saved} events to database")
    
    # Log the scraper run
    await db_service.log_scraper_run(
        events_found=len(events),
        success=True
    )
    
    # Disconnect
    await db_service.disconnect()
    print("🎉 Initial data population complete!")


if __name__ == "__main__":
    asyncio.run(main())
