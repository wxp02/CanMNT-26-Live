from pydantic import BaseModel
from typing import Literal, Optional


class PlayerEvent(BaseModel):
    id: int
    player: str
    event: str
    type: Literal["goal", "assist", "card", "substitution"]
    context: str
    minute: str
    timestamp: str
    league: str
    team: Optional[str] = None
    unix_timestamp: Optional[int] = None  # For sorting by actual time


class LivePulseResponse(BaseModel):
    events: list[PlayerEvent]
    last_updated: str
