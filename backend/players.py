# Canadian National Team Players
# Structure: {name: {"id": sofascore_id, "position": position, "team": team}}
SOFASCORE_PLAYER_IDS = {
    "Alphonso Davies": {"id": 843665, "position": "LB", "team": "Bayern Munich"},
    "Jonathan David": {"id": 935564, "position": "ST", "team": "Juventus"},
    "Tajon Buchanan": {"id": 973290, "position": "RM", "team": "Villarreal CF"},
    "Stephen Eustáquio": {"id": 886223, "position": "CM", "team": "FC Porto"},
    "Cyle Larin": {"id": 790179, "position": "ST", "team": "Feyenoord"},
    "Alistair Johnston": {"id": 984419, "position": "RB", "team": "Celtic"},
    "Ismaël Koné": {"id": 1134351, "position": "CM", "team": "Sassuolo"},
    "Maxime Crépeau": {"id": 155736, "position": "GK", "team": "Portland Timbers"},
    "Kamal Miller": {"id": 934841, "position": "CB", "team": "Portland Timbers"},
    "Richie Laryea": {"id": 829207, "position": "RB", "team": "Toronto FC"},
    "Dayne St. Clair": {"id": 973286, "position": "GK", "team": "Minnesota United"},
    "Owen Goodman": {"id": 1087790, "position": "GK", "team": "Huddersfield Town"},
    "Zorhan Bassong": {"id": 976163, "position": "CB", "team": "Sporting Kansas City"},
    "Joel Waterman": {"id": 1020472, "position": "CB", "team": "Chicago Fire"},
    "Derek Cornelius": {"id": 801411, "position": "CB", "team": "Rangers"},
    "Alfie Jones": {"id": 845426, "position": "CB", "team": "Middlesbrough"},
    "Niko Sigur": {"id": 1411145, "position": "CB", "team": "HNK Hajduk Split"},
    "Mathieu Choinière": {"id": 937255, "position": "CM", "team": "Los Angeles FC"},
    "Junior Hoilett": {"id": 33478, "position": "LW", "team": "Hibernian"},
    "Jacob Shaffelburg": {"id": 976313, "position": "LW", "team": "Nashville SC"},
    "Nathan-Dylan Saliba": {"id": 1093229, "position": "CM", "team": "RSC Anderlecht"},
    "Ali Ahmed": {"id": 1464637, "position": "LM", "team": "Vancouver Whitecaps"},
    "Jonathan Osorio": {"id": 273031, "position": "CM", "team": "Toronto FC"},
    "Jayden Nelson": {"id": 1002489, "position": "RW", "team": "Austin FC"},
    "Tani Oluwaseyi": {"id": 1172477, "position": "ST", "team": "Villarreal CF"},
    "Theo Bair": {"id": 936848, "position": "ST", "team": "FC Lausanne-Sport"},
    "Promise David": {"id": 1119328, "position": "ST", "team": "Royale Union Saint-Gilloise"},
    "Moise Bombito": {"id": 1469180, "position": "CB", "team": "OGC Nice"}
}

# Map player IDs for quick lookup (ID -> name)
PLAYER_ID_MAP = {player["id"]: name for name, player in SOFASCORE_PLAYER_IDS.items()}
