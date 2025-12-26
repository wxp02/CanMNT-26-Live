# CanMNT 26 LIVE 🍁⚽

Real-time tracking dashboard for Canadian Men's National Team players leading up to the 2026 FIFA World Cup.

## 🎯 Overview

CanMNT 26 LIVE is a comprehensive web application that tracks Canadian national team players' performance in real-time by scraping live data from SoFaScore. The app features live match events, season statistics, and data-driven roster predictions.

## ✨ Features

### 📊 Command Center

- **Countdown Timer**: Days, hours, minutes, and seconds until Canada's opening match at BMO Field
- **Live Pulse**: Real-time match events (goals, assists, cards, substitutions) from CanMNT players worldwide
- **Quick Stats Dashboard**: Aggregated season totals across all tracked players

### 📖 The Ledger

- Comprehensive activity table with filtering by event type
- Detailed match context and timestamps
- League and team information for each event

### 🎯 War Room

- **Data-driven roster predictions** using form ratings
- **Four tiers of players**:
  - **The Locks** (75-100%): Guaranteed roster spots
  - **Probables** (60-75%): Strong contenders
  - **The Bubble** (45-60%): Fighting for spots
  - **Cold/Dropped** (<45%): Losing favor
- **Real season statistics** from SoFaScore:
  - Matches played across all club competitions
  - Minutes, goals, assists
  - Form ratings based on performance
  - Team and league information

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 16 (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Deployment Ready**: Vercel-optimized

### Backend

- **Framework**: FastAPI (Python)
- **Web Scraping**: tls_client (bypasses API restrictions)
- **Data Source**: SoFaScore API
- **Features**:
  - Async/await for concurrent requests
  - Automatic TLS fingerprinting
  - International competition filtering
  - Stats aggregation across multiple leagues

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Create virtual environment**

   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On macOS/Linux
   # OR
   venv\Scripts\activate  # On Windows
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Run the server**

   ```bash
   uvicorn main:app --reload --port 8000
   ```

   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**

   ```bash
   # Create .env.local file
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

### Running Both Simultaneously

**Option 1: Two Terminal Windows**

```bash
# Terminal 1 - Backend
cd backend && source venv/bin/activate && uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend && npm run dev
```

**Option 2: Single Command (Background)**

```bash
cd backend && source venv/bin/activate && uvicorn main:app --reload --port 8000 & cd ../frontend && npm run dev
```

## 📡 API Endpoints

### `GET /api/live-pulse`

Returns recent match events for tracked Canadian players.

**Response:**

```json
{
  "events": [
    {
      "id": 1,
      "player": "Jonathan David",
      "event": "Goal",
      "type": "goal",
      "context": "Juventus 2-1 Inter",
      "minute": "67'",
      "timestamp": "2 minutes ago",
      "league": "Serie A",
      "team": "Juventus"
    }
  ],
  "last_updated": "2025-12-26T05:14:29.507010+00:00"
}
```

### `GET /api/season-stats`

Returns aggregated 2025/26 season statistics for all players (club competitions only).

**Query Parameters:**

- `player` (optional): Filter by specific player name

**Response:**

```json
{
  "season": "2025/26",
  "players": {
    "Jonathan David": {
      "player": "Jonathan David",
      "team": "Juventus",
      "league": "All Competitions",
      "season": "2025/26",
      "matches": 22,
      "minutes": 955,
      "goals": 3,
      "assists": 1,
      "rating": 6.47,
      "form_rating": 65
    }
  },
  "count": 1,
  "last_updated": "2025-12-26T05:14:29.507010+00:00"
}
```

### `GET /health`

Health check endpoint.

## 📁 Project Structure

```
CanMNT 26 Live/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── sofascore_scraper.py    # SoFaScore data scraper
│   ├── models.py               # Pydantic models
│   ├── players.py              # Player database
│   ├── config.py               # Configuration
│   ├── requirements.txt        # Python dependencies
│   └── test_season_stats.py    # Test script
├── frontend/
│   ├── app/
│   │   ├── page.tsx           # Command Center
│   │   ├── ledger/page.tsx    # The Ledger
│   │   └── war-room/page.tsx  # War Room
│   ├── components/
│   │   ├── live-pulse.tsx     # Live events component
│   │   ├── roster-tiers.tsx   # Roster prediction tiers
│   │   └── ui/                # Reusable UI components
│   ├── lib/
│   │   ├── api.ts             # API client functions
│   │   └── utils.ts           # Utility functions
│   └── package.json
└── README.md
```

## 🎮 Tracked Players

Currently tracking 10+ Canadian national team players including:

- Alphonso Davies (Bayern Munich)
- Jonathan David (Juventus)
- Tajon Buchanan (Inter Milan)
- Stephen Eustáquio (FC Porto)
- Cyle Larin (Real Valladolid)
- Alistair Johnston (Celtic)
- Ismaël Koné (Watford)
- Maxime Crépeau (Portland Timbers)
- Kamal Miller (CF Montréal)
- Richie Laryea (Toronto FC)

## 🔍 Data Sources

- **Live Match Data**: SoFaScore API (via tls_client)
- **Season Statistics**: Aggregated from SoFaScore career stats
- **Competitions Tracked**:
  - Domestic leagues (Serie A, Bundesliga, Ligue 1, etc.)
  - UEFA Champions League
  - UEFA Europa League
  - Domestic cups
  - _(Excludes international competitions like Gold Cup, Nations League)_

## 🎨 Features Highlights

- **Real-time updates**: Events refresh every 60 seconds
- **Responsive design**: Works on mobile, tablet, and desktop
- **Dark mode optimized**: Beautiful UI with proper contrast
- **Type-safe**: Full TypeScript implementation on frontend
- **Fast & efficient**: Parallel API calls, optimized rendering
- **Production ready**: Error handling, loading states, fallback data

## 📝 Development

### Testing the Scraper

```bash
cd backend
source venv/bin/activate
python test_season_stats.py
```

### Checking API Health

```bash
curl http://localhost:8000/health
```

### Testing Specific Player

```bash
curl "http://localhost:8000/api/season-stats?player=Jonathan%20David" | python -m json.tool
```

## 🚧 Roadmap

- [ ] Add more Canadian players
- [ ] Historical performance charts
- [ ] Player comparison tool
- [ ] Email/push notifications for goals
- [ ] Match predictions based on form
- [ ] Export roster predictions to PDF

## 📄 License

MIT

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Built with ❤️ for Canada Soccer fans** 🇨🇦⚽
