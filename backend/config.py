from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # API mode: "fotmob" or "rapidapi"
    api_mode: str = "fotmob"
    
    # Optional RapidAPI settings (for future use)
    rapidapi_key: Optional[str] = None
    rapidapi_host: str = "api-football-v1.p.rapidapi.com"
    
    port: int = 8000
    environment: str = "development"

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
