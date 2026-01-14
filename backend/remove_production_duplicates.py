"""
Script to remove duplicate entries from PRODUCTION database.
Run this ONCE after deploying the duplicate fix.

Usage (on Render or wherever your production backend is running):
    python remove_production_duplicates.py
"""
import asyncio
from database import db_service


async def remove_duplicates():
    """Remove duplicate events from the production database"""
    await db_service.connect()
    
    print("🔍 Finding duplicate events in PRODUCTION database...")
    
    # Get all events
    all_events = await db_service.db.playerevent.find_many(
        order={'matchTime': 'desc'}
    )
    
    print(f"Found {len(all_events)} total events")
    
    # Track unique events by their natural key
    seen = set()
    duplicates_to_delete = []
    
    for event in all_events:
        # Natural key: player + event type + minute + context (match)
        natural_key = (
            event.player,
            event.eventType,
            event.minute,
            event.context
        )
        
        if natural_key in seen:
            # This is a duplicate
            duplicates_to_delete.append(event.id)
            print(f"  ❌ Duplicate: {event.player} - {event.event} at {event.minute} in {event.context}")
        else:
            seen.add(natural_key)
    
    if duplicates_to_delete:
        print(f"\n🗑️  Deleting {len(duplicates_to_delete)} duplicate entries...")
        
        # Delete duplicates
        result = await db_service.db.playerevent.delete_many(
            where={'id': {'in': duplicates_to_delete}}
        )
        
        print(f"✅ Deleted {result} duplicate entries")
    else:
        print("✅ No duplicates found!")
    
    # Show final count
    final_count = await db_service.db.playerevent.count()
    print(f"\n📊 Final database count: {final_count} unique events")
    
    await db_service.disconnect()
    print("✅ Done!")


if __name__ == "__main__":
    asyncio.run(remove_duplicates())
