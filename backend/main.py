from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
from models import LivePulseResponse, PlayerEvent
from sofascore_scraper import sofascore_scraper
from config import settings
from database import db_service
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to database
    print("🔌 Connecting to database...")
    await db_service.connect()
    print("✅ Database connected")
    yield
    # Shutdown: Disconnect from database
    print("🔌 Disconnecting from database...")
    await db_service.disconnect()
    print("✅ Database disconnected")

app = FastAPI(
    title="CanMNT 26 Live API",
    description="Backend API for tracking Canadian National Team players' live match events",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "https://canmnt.live",  # Production domain
        "https://www.canmnt.live",  # Production domain with www
        "https://canmnt-26-live-frontend.onrender.com",  # Render frontend URL
        "https://*.onrender.com",  # Allow all Render preview URLs
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "CanMNT 26 Live API",
        "status": "running",
        "endpoints": {
            "/api/live-pulse": "Get live player events (from database)",
            "/api/scrape-events": "Manually trigger scraper to update database (POST)",
            "/api/db-stats": "Get database statistics",
            "/api/season-stats": "Get current season statistics for all players",
            "/api/season-stats?player=Jonathan David": "Get stats for specific player",
            "/health": "Health check"
        }
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "environment": settings.environment
    }


@app.get("/api/season-stats")
async def get_season_stats(player: str = None):
    """
    Get current season (2025/26) statistics for Canadian players from database cache.
    Data is updated periodically via /api/scrape-season-stats
    
    Query Parameters:
        - player (optional): Specific player name to fetch stats for
    
    Returns:
        - Dictionary of player stats including matches, minutes, goals, assists, rating
    """
    try:
        print(f"\n📊 Fetching cached season stats{f' for {player}' if player else ' for all players'}...")
        
        # Get stats from database
        stats = await db_service.get_season_stats(player)
        
        # Get last scrape time
        last_scrape = await db_service.get_latest_stats_scrape_time()
        last_updated = last_scrape.isoformat() if last_scrape else datetime.now(timezone.utc).isoformat()
        
        if not stats:
            print("⚠️  No season stats found in database. Run /api/scrape-season-stats to populate data.")
        
        return {
            "season": "2025/26",
            "players": stats,
            "count": len(stats),
            "last_updated": last_updated
        }
    except Exception as e:
        print(f"❌ Error in get_season_stats: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/scrape-season-stats")
async def scrape_season_stats():
    """
    Manually trigger the scraper to fetch and save season statistics.
    This should be called periodically to update the cached stats.
    
    Returns:
        - players_found: Number of players with stats fetched
        - players_saved: Number of player stats saved to database
        - success: Whether the scrape was successful
    """
    try:
        print("\n🔄 Starting season stats scrape...")
        
        # Fetch stats from SofaScore
        stats = await sofascore_scraper.get_player_season_stats()
        players_found = len(stats)
        print(f"Found stats for {players_found} players")
        
        # Save to database
        players_saved = await db_service.save_season_stats(stats)
        print(f"Saved stats for {players_saved} players")
        
        # Log the scraper run
        await db_service.log_stats_scraper_run(
            players_found=players_found,
            success=True
        )
        
        print(f"✅ Season stats scrape complete: {players_found} found, {players_saved} saved")
        
        return {
            "players_found": players_found,
            "players_saved": players_saved,
            "success": True,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        print(f"❌ Error in scrape_season_stats: {e}")
        import traceback
        traceback.print_exc()
        
        # Log failed run
        await db_service.log_stats_scraper_run(
            players_found=0,
            success=False,
            error=str(e)
        )
        
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/live-pulse", response_model=LivePulseResponse)
async def get_live_pulse():
    """
    Get recent events for tracked Canadian national team players from database.
    Data is cached and updated periodically by the scraper.
    
    Returns:
        - events: List of recent player events (goals, assists, cards, etc.)
        - last_updated: Timestamp of when the data was last scraped
    """
    try:
        # Fetch events from database instead of scraping
        events = await db_service.get_recent_events()
        
        # Get last scrape time
        last_scrape = await db_service.get_latest_scrape_time()
        last_updated = last_scrape.isoformat() if last_scrape else datetime.now(timezone.utc).isoformat()
        
        # If no events in database, return empty list
        if not events:
            print("⚠️  No events found in database. Run the scraper to populate data.")
            return LivePulseResponse(
                events=[],
                last_updated=last_updated
            )
        
        print(f"✅ Returned {len(events)} events from database")
        return LivePulseResponse(
            events=events,
            last_updated=last_updated
        )
    except Exception as e:
        print(f"❌ Error in get_live_pulse: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/scrape-events")
async def scrape_events():
    """
    Manually trigger the scraper to fetch and save new events.
    This endpoint should be called periodically (e.g., every 15-30 minutes) 
    or on-demand when you want to refresh the data.
    
    Returns:
        - events_found: Number of events fetched from SofaScore
        - events_saved: Number of events saved to database
        - success: Whether the scrape was successful
    """
    try:
        print("\n🔄 Starting manual scrape...")
        
        # Fetch events from SofaScore
        events = await sofascore_scraper.get_canadian_player_events()
        events_found = len(events)
        
        # Save to database
        events_saved = await db_service.save_events(events)
        
        # Log the scraper run
        await db_service.log_scraper_run(
            events_found=events_found,
            success=True
        )
        
        print(f"✅ Scrape complete: {events_found} found, {events_saved} saved")
        
        return {
            "success": True,
            "events_found": events_found,
            "events_saved": events_saved,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Scrape failed: {error_msg}")
        
        # Log failed run
        await db_service.log_scraper_run(
            events_found=0,
            success=False,
            error=error_msg
        )
        
        raise HTTPException(status_code=500, detail=error_msg)


@app.get("/api/test-scraper")
async def test_scraper():
    """
    Test the SofaScore scraper to see if it can fetch data.
    Returns diagnostic information about what the scraper is able to access.
    """
    try:
        print("\n🧪 Testing scraper connection...")
        
        # Test with one player (Jonathan David)
        test_player = "Jonathan David"
        player_id = 935564
        
        import tls_client
        session = tls_client.Session(
            client_identifier="chrome_120",
            random_tls_extension_order=True
        )
        
        # Test basic player endpoint
        url = f"https://api.sofascore.com/api/v1/player/{player_id}/events/last/0"
        
        import asyncio
        response = await asyncio.to_thread(session.get, url)
        
        return {
            "status_code": response.status_code,
            "can_connect": response.status_code == 200,
            "url_tested": url,
            "response_size": len(response.content) if response.content else 0,
            "player_tested": test_player,
            "message": "Check if status_code is 200. If not, SofaScore may be blocking requests."
        }
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return {
            "error": str(e),
            "can_connect": False,
            "message": "Scraper test failed"
        }


@app.get("/api/db-stats")
async def get_db_stats():
    """
    Get database statistics
    
    Returns:
        - total_events: Total number of events in database
        - last_scrape: Timestamp of last successful scrape
    """
    try:
        total = await db_service.get_event_count()
        last_scrape = await db_service.get_latest_scrape_time()
        
        return {
            "total_events": total,
            "last_scrape": last_scrape.isoformat() if last_scrape else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def get_mock_events() -> list[PlayerEvent]:
    """Mock events for development/testing when no live matches"""
    return [
        PlayerEvent(
            id=1,
            player="Alphonso Davies",
            event="Goal",
            type="goal",
            context="Bayern Munich 3-1 Borussia Dortmund",
            minute="67'",
            timestamp="2 minutes ago",
            league="Bundesliga",
            team="Bayern Munich"
        ),
        PlayerEvent(
            id=2,
            player="Jonathan David",
            event="Assist",
            type="assist",
            context="Lille 2-0 Lyon",
            minute="54'",
            timestamp="18 minutes ago",
            league="Ligue 1",
            team="LOSC Lille"
        ),
        PlayerEvent(
            id=3,
            player="Tajon Buchanan",
            event="Goal",
            type="goal",
            context="Inter Milan 1-0 Napoli",
            minute="23'",
            timestamp="1 hour ago",
            league="Serie A",
            team="Inter Milan"
        ),
        PlayerEvent(
            id=4,
            player="Stephen Eustáquio",
            event="Yellow Card",
            type="card",
            context="Porto 1-1 Benfica",
            minute="78'",
            timestamp="3 hours ago",
            league="Primeira Liga",
            team="FC Porto"
        ),
        PlayerEvent(
            id=5,
            player="Cyle Larin",
            event="Goal",
            type="goal",
            context="Real Valladolid 2-1 Real Betis",
            minute="89'",
            timestamp="5 hours ago",
            league="La Liga",
            team="Real Valladolid"
        ),
        PlayerEvent(
            id=6,
            player="Alphonso Davies",
            event="Assist",
            type="assist",
            context="Bayern Munich 2-0 RB Leipzig",
            minute="34'",
            timestamp="8 hours ago",
            league="Bundesliga",
            team="Bayern Munich"
        ),
        PlayerEvent(
            id=7,
            player="Kamal Miller",
            event="Yellow Card",
            type="card",
            context="CF Montréal 1-1 Atlanta United",
            minute="82'",
            timestamp="12 hours ago",
            league="MLS",
            team="CF Montréal"
        ),
        PlayerEvent(
            id=8,
            player="Jonathan David",
            event="Goal",
            type="goal",
            context="Lille 3-2 Marseille",
            minute="90+2'",
            timestamp="1 day ago",
            league="Ligue 1",
            team="LOSC Lille"
        ),
    ]


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=settings.environment == "development"
    )
