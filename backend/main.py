from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
from models import LivePulseResponse, PlayerEvent
# from api_service import football_api
from sofascore_scraper import sofascore_scraper
from config import settings

app = FastAPI(
    title="CanMNT 26 Live API",
    description="Backend API for tracking Canadian National Team players' live match events",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
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
            "/api/live-pulse": "Get live player events",
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
    Get current season (2025/26) statistics for Canadian players from SofaScore.
    
    Query Parameters:
        - player (optional): Specific player name to fetch stats for
    
    Returns:
        - Dictionary of player stats including matches, minutes, goals, assists, rating
    """
    try:
        print(f"\n📊 Fetching season stats{f' for {player}' if player else ' for all players'}...")
        stats = await sofascore_scraper.get_player_season_stats(player)
        
        return {
            "season": "2025/26",
            "players": stats,
            "count": len(stats),
            "last_updated": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        print(f"❌ Error in get_season_stats: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/live-pulse", response_model=LivePulseResponse)
async def get_live_pulse():
    """
    Get recent events for tracked Canadian national team players.
    
    Returns:
        - events: List of recent player events (goals, assists, cards, etc.)
        - last_updated: Timestamp of when the data was fetched
    """
    try:
        # Fetch events from SofaScore
        events = await sofascore_scraper.get_canadian_player_events()
        
        # If no events found, use mock data for demonstration
        if not events:
            print("No live events found, using mock data")
            events = get_mock_events()
        
        return LivePulseResponse(
            events=events,
            last_updated=datetime.now(timezone.utc).isoformat()
        )
    except Exception as e:
        print(f"Error in get_live_pulse: {e}")
        import traceback
        traceback.print_exc()
        # Return mock data on error
        return LivePulseResponse(
            events=get_mock_events(),
            last_updated=datetime.now(timezone.utc).isoformat()
        )


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
