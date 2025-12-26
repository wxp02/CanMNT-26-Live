# Canadian National Team Players to Track
# Add player IDs from API-Football here
CANADIAN_PLAYERS = {
    "Alphonso Davies": {
        "id": 162757,  # API-Football player ID
        "team": "Bayern Munich",
        "position": "Defender"
    },
    "Jonathan David": {
        "id": 163474,
        "team": "LOSC Lille",
        "position": "Forward"
    },
    "Tajon Buchanan": {
        "id": 149033,
        "team": "Inter Milan",
        "position": "Midfielder"
    },
    "Stephen Eustáquio": {
        "id": 35697,
        "team": "FC Porto",
        "position": "Midfielder"
    },
    "Cyle Larin": {
        "id": 37029,
        "team": "Real Valladolid",
        "position": "Forward"
    },
    "Kamal Miller": {
        "id": 164025,
        "team": "CF Montréal",
        "position": "Defender"
    },
    "Alistair Johnston": {
        "id": 279068,
        "team": "Celtic",
        "position": "Defender"
    },
    "Ismaël Koné": {
        "id": 306721,
        "team": "Watford",
        "position": "Midfielder"
    },
    "Richie Laryea": {
        "id": 67126,
        "team": "Toronto FC",
        "position": "Defender"
    },
    "Jonathan Osorio": {
        "id": 2928,
        "team": "Toronto FC",
        "position": "Midfielder"
    }
}

# Map API-Football player IDs for quick lookup
PLAYER_ID_MAP = {player["id"]: name for name, player in CANADIAN_PLAYERS.items()}
