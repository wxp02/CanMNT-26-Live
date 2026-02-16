# CanMNT 26 LIVE 🍁⚽

Real-time tracking dashboard for Canadian Men's National Team players leading up to the 2026 FIFA World Cup.

**Live at:** [canmnt.live](https://canmnt.live)

## 🎯 Overview

CanMNT 26 LIVE is a full-stack web application that tracks Canadian national team players' performance in real-time. The app scrapes live data from SofaScore, stores it in a PostgreSQL database, and features automated updates every 4 hours via GitHub Actions.

## ✨ Features

### 📊 Command Center (Home Page)

- **Countdown Timer**: Real-time countdown to Canada's opening match at BMO Field (June 11, 2026)
- **Live Pulse**: Recent match events (goals, assists, cards, substitutions) from CanMNT players worldwide
- **Quick Stats Dashboard**: Aggregated season totals across all tracked players
- **Auto-refresh**: Updates every 60 seconds for live data

### 📖 The Ledger

- Comprehensive activity table with filtering by event type (All, Goals, Assists, Cards, Subs)
- Detailed match context and timestamps
- League and team information for each event
- Searchable and sortable data table

### 🎯 War Room

- **Data-driven roster predictions** using performance-based form ratings
- **Four tiers of players**:
  - **The Locks** (75-100%): Guaranteed roster spots
  - **Probables** (60-75%): Strong contenders
  - **The Bubble** (45-60%): Fighting for roster spots
  - **Cold/Dropped** (<45%): Losing favor or out of form
- **Real season statistics** from SofaScore:
  - Matches played across all club competitions
  - Minutes, goals, assists
  - Form ratings based on recent performance
  - Team and league information
- **Game log table**: Recent matches for each player

### 📄 Additional Pages

- **About**: Project background, mission, and team
- **Privacy Policy**: Data collection and usage transparency

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Analytics**: Vercel Analytics
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Deployment**: Vercel

### Backend

- **Framework**: FastAPI (Python 3.8+)
- **Database**: PostgreSQL with Prisma ORM
- **Web Scraping**: tls_client (bypasses API restrictions)
- **Data Source**: SofaScore API
- **Deployment**: Render
- **Key Features**:
  - Async/await for concurrent requests
  - Automatic TLS fingerprinting
  - Database-backed caching
  - Automated duplicate cleanup
  - International competition filtering
  - Stats aggregation across multiple leagues

### Automation

- **GitHub Actions**: Automated data updates every 4 hours
- **Alternative Options**: Cron jobs, Python scheduler, Render Cron Jobs, macOS Launch Agent
- **Scripts**: Shell scripts for manual updates and local automation

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 18+
- PostgreSQL (local or cloud)
- npm or yarn

### Environment Variables

Create `.env` files for both backend and frontend:

**Backend `.env`:**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/canmnt_live"
ENVIRONMENT="development"
```

**Frontend `.env.local`:**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

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

4. **Setup database**

   ```bash
   # Generate Prisma client
   prisma generate

   # Run migrations
   prisma migrate deploy

   # Initialize with sample data (optional)
   python init_data.py
   ```

5. **Run the server**

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

3. **Run the development server**

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

## 🔄 Data Updates

The app features multiple ways to update data automatically:

### Automated Updates (Production)

- **GitHub Actions**: Runs every 4 hours automatically (configured in `.github/workflows/update-data.yml`)
- **Render Cron Jobs**: Alternative cloud-based scheduling

### Manual Updates

```bash
# Run the update script
./update-data.sh

# Or run individual scripts
python backend/scrape_and_save.py           # Scrape match events
python backend/scrape_season_stats.py       # Scrape season stats
curl -X POST <your-api-url>/api/cleanup-duplicates  # Clean duplicates
```

### Local Automation

```bash
# Setup cron job (macOS/Linux)
./setup-cron.sh

# Or run Python scheduler
cd backend && python auto_updater.py
```

See [AUTOMATION_OPTIONS.md](AUTOMATION_OPTIONS.md) for detailed automation setup instructions.

## 📡 API Endpoints

### Public Endpoints (GET)

#### `GET /`

API documentation and endpoint list.

#### `GET /health`

Health check endpoint.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2026-02-16T10:30:00.000000+00:00",
  "environment": "production"
}
```

#### `GET /api/live-pulse`

Returns recent match events for tracked Canadian players from the database.

**Response:**

```json
{
  "events": [
    {
      "id": "uuid",
      "player": "Jonathan David",
      "event": "Goal",
      "type": "goal",
      "context": "Juventus 2-1 Inter",
      "minute": "67'",
      "timestamp": "2 hours ago",
      "league": "Serie A",
      "team": "Juventus"
    }
  ],
  "last_updated": "2026-02-16T10:30:00.000000+00:00"
}
```

#### `GET /api/season-stats`

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
      "position": "ST",
      "team": "Juventus",
      "league": "All Competitions",
      "season": "2025/26",
      "matches": 28,
      "minutes": 2341,
      "goals": 15,
      "assists": 4,
      "rating": 7.21,
      "formRating": 72
    }
  },
  "count": 29,
  "last_updated": "2026-02-16T10:30:00.000000+00:00"
}
```

#### `GET /api/player-matches`

Returns recent match history for a specific player.

**Query Parameters:**

- `player` (required): Player name
- `limit` (optional): Number of matches to return (default: 10)

#### `GET /api/db-stats`

Returns database statistics (event counts, player counts, last scraper runs).

#### `GET /api/test-scraper`

Test scraper functionality with live data (for debugging).

### Admin Endpoints (POST)

#### `POST /api/scrape-events`

Manually trigger the scraper to fetch and save match events to the database.

**Response:**

```json
{
  "events_found": 45,
  "events_saved": 12,
  "events_updated": 3,
  "success": true
}
```

#### `POST /api/scrape-season-stats`

Manually trigger the scraper to fetch and save season statistics.

**Response:**

```json
{
  "players_found": 29,
  "players_saved": 29,
  "success": true
}
```

#### `POST /api/scrape-player-matches`

Manually trigger the scraper to fetch and save recent player matches.

**Response:**

```json
{
  "matches_found": 150,
  "matches_saved": 37,
  "success": true
}
```

#### `POST /api/cleanup-duplicates`

Remove duplicate events from the database.

**Response:**

```json
{
  "duplicates_removed": 8,
  "success": true
}
```

## 📁 Project Structure

```
CanMNT 26 Live/
├── backend/
│   ├── main.py                         # FastAPI application
│   ├── sofascore_scraper.py            # SofaScore data scraper
│   ├── models.py                       # Pydantic models
│   ├── players.py                      # Player database (29 players)
│   ├── database.py                     # Database service layer
│   ├── config.py                       # Configuration settings
│   ├── schema.prisma                   # Prisma database schema
│   ├── requirements.txt                # Python dependencies
│   ├── api_service.py                  # API service utilities
│   ├── build.sh                        # Production build script
│   ├── check_db.py                     # Database verification
│   ├── init_data.py                    # Database initialization
│   ├── scrape_and_save.py             # Standalone event scraper
│   ├── scrape_season_stats.py         # Standalone stats scraper
│   ├── remove_production_duplicates.py # Cleanup utility
│   ├── auto_updater.py                 # Python-based scheduler
│   ├── migrations/                     # Prisma migrations
│   │   ├── 20260104055554_init/
│   │   └── 20260120041730_add_player_matches/
│   └── tests/                          # Test files
│       ├── test_buchanan.py
│       ├── test_dec6.py
│       ├── test_events.py
│       ├── test_recent_matches.py
│       └── test_season_stats.py
├── frontend/
│   ├── app/
│   │   ├── page.tsx                   # Command Center (home)
│   │   ├── layout.tsx                 # Root layout
│   │   ├── globals.css                # Global styles
│   │   ├── ledger/page.tsx            # The Ledger
│   │   ├── war-room/page.tsx          # War Room
│   │   ├── about/page.tsx             # About page
│   │   └── privacy/page.tsx           # Privacy Policy
│   ├── components/
│   │   ├── live-pulse.tsx             # Live events component
│   │   ├── roster-tiers.tsx           # Roster prediction tiers
│   │   ├── activity-table.tsx         # Event activity table
│   │   ├── activity-filters.tsx       # Event filters
│   │   ├── game-log-table.tsx         # Player match history
│   │   ├── countdown-timer.tsx        # World Cup countdown
│   │   ├── footer.tsx                 # Site footer
│   │   ├── mobile-nav.tsx             # Mobile navigation
│   │   └── ui/                        # Reusable UI components
│   ├── lib/
│   │   ├── api.ts                     # API client functions
│   │   └── utils.ts                   # Utility functions
│   ├── public/
│   │   └── ads.txt                    # Google AdSense
│   └── package.json
├── .github/
│   └── workflows/
│       └── update-data.yml            # GitHub Actions workflow
├── update-data.sh                      # Manual update script
├── setup-cron.sh                       # Cron setup helper
├── AUTOMATION_OPTIONS.md               # Automation guide
└── README.md
```

## 🎮 Tracked Players (29 Total)

### Goalkeepers (3)

- Maxime Crépeau (Portland Timbers - MLS)
- Dayne St. Clair (Minnesota United - MLS)
- Owen Goodman (Huddersfield Town - EFL Championship)

### Defenders (9)

- Alphonso Davies (Bayern Munich - Bundesliga)
- Alistair Johnston (Celtic - Scottish Premiership)
- Kamal Miller (Portland Timbers - MLS)
- Richie Laryea (Toronto FC - MLS)
- Zorhan Bassong (Sporting Kansas City - MLS)
- Joel Waterman (Chicago Fire - MLS)
- Derek Cornelius (Rangers - Scottish Premiership)
- Alfie Jones (Middlesbrough - EFL Championship)
- Niko Sigur (HNK Hajduk Split - Croatian First League)
- Moise Bombito (OGC Nice - Ligue 1)

### Midfielders (9)

- Stephen Eustáquio (FC Porto - Primeira Liga)
- Tajon Buchanan (Villarreal CF - La Liga)
- Ismaël Koné (Sassuolo - Serie B)
- Mathieu Choinière (Los Angeles FC - MLS)
- Nathan-Dylan Saliba (RSC Anderlecht - Belgian Pro League)
- Ali Ahmed (Norwich City - EFL Championship)
- Jonathan Osorio (Toronto FC - MLS)
- Junior Hoilett (Hibernian - Scottish Premiership)

### Forwards (8)

- Jonathan David (Juventus - Serie A)
- Cyle Larin (Feyenoord - Eredivisie)
- Jacob Shaffelburg (Nashville SC - MLS)
- Jayden Nelson (Austin FC - MLS)
- Tani Oluwaseyi (Villarreal CF - La Liga)
- Theo Bair (FC Lausanne-Sport - Swiss Super League)
- Promise David (Royale Union Saint-Gilloise - Belgian Pro League)
- Liam Millar (Hull City - EFL Championship)

## 🔍 Data Sources & Methodology

- **Primary Data Source**: SofaScore API (via tls_client)
- **Scraping Method**: Bypasses API restrictions using TLS fingerprinting
- **Update Frequency**: Every 4 hours (automated via GitHub Actions)
- **Database**: PostgreSQL with Prisma ORM for reliable data persistence
- **Competitions Tracked**:
  - Domestic leagues (Serie A, Bundesliga, Ligue 1, Premier League, MLS, etc.)
  - UEFA Champions League & Europa League
  - Domestic cups and secondary competitions
  - _(Excludes international competitions like Gold Cup, Nations League)_

## 🎨 Features Highlights

- ✅ **Real-time updates**: Events refresh automatically every 60 seconds
- ✅ **Responsive design**: Optimized for mobile, tablet, and desktop
- ✅ **Dark mode**: Beautiful UI with proper contrast and accessibility
- ✅ **Type-safe**: Full TypeScript implementation on frontend
- ✅ **Fast & efficient**: Parallel API calls, optimized rendering, database caching
- ✅ **Production ready**: Error handling, loading states, fallback data
- ✅ **SEO optimized**: Meta tags, Open Graph, proper semantic HTML
- ✅ **Analytics**: Vercel Analytics for traffic insights
- ✅ **Automated**: Self-updating via GitHub Actions every 4 hours

## 🔧 Development Commands

### Backend

```bash
# Run development server
uvicorn main:app --reload --port 8000

# Run Prisma Studio (database GUI)
prisma studio

# Generate Prisma client
prisma generate

# Create new migration
prisma migrate dev --name your_migration_name

# Deploy migrations
prisma migrate deploy

# Reset database (warning: deletes all data)
prisma migrate reset

# Run tests
python -m pytest tests/

# Check database
python check_db.py

# Scrape data manually
python scrape_and_save.py
python scrape_season_stats.py
```

### Frontend

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

### Testing API Endpoints

```bash
# Health check
curl http://localhost:8000/health

# Get live pulse
curl http://localhost:8000/api/live-pulse | python -m json.tool

# Get season stats
curl http://localhost:8000/api/season-stats | python -m json.tool

# Get specific player stats
curl "http://localhost:8000/api/season-stats?player=Jonathan%20David" | python -m json.tool

# Trigger scraper (POST)
curl -X POST http://localhost:8000/api/scrape-events

# Get database stats
curl http://localhost:8000/api/db-stats | python -m json.tool
```

## 🚀 Deployment

### Backend (Render)

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `ENVIRONMENT`: "production"
4. Build command: `./build.sh`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set root directory to `frontend`
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL
4. Deploy automatically on push to main branch

### Database (Render PostgreSQL)

1. Create a PostgreSQL database on Render
2. Copy the internal database URL
3. Add to backend environment variables
4. Run migrations via Render Shell:
   ```bash
   prisma migrate deploy
   ```

## 🗓️ Important Dates

- **Canada's Opening Match**: June 11, 2026 at BMO Field, Toronto
- **FIFA World Cup 2026**: June 11 - July 19, 2026
- **Host Cities**: Canada, USA, Mexico

## 📝 Development Roadmap

### Completed ✅

- [x] Real-time match event tracking
- [x] Season statistics aggregation
- [x] Roster prediction algorithm
- [x] Database integration (PostgreSQL + Prisma)
- [x] Automated data updates (GitHub Actions)
- [x] Production deployment
- [x] About and Privacy pages
- [x] Game log tracking
- [x] 29 players tracked

### Upcoming 🚧

- [ ] Player profile pages with detailed stats
- [ ] Historical performance charts and trends
- [ ] Player comparison tool
- [ ] Email/push notifications for goals and events
- [ ] Match predictions based on form
- [ ] Export roster predictions to PDF
- [ ] Advanced filtering and search
- [ ] Social sharing features
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Acknowledgments

- **Data Source**: SofaScore for providing comprehensive football data
- **UI Components**: shadcn/ui and Radix UI for beautiful, accessible components
- **Community**: Thanks to all Canadian football fans for the support

## 📧 Contact & Links

- **Live Site**: [canmnt.live](https://canmnt.live)
- **Issues**: [GitHub Issues](https://github.com/yourusername/canmnt-26-live/issues)
- **Privacy Policy**: [canmnt.live/privacy](https://canmnt.live/privacy)

---

**Built with ❤️ for Canada Soccer fans** 🇨🇦⚽

_Tracking the path to 2026 World Cup glory, one match at a time._
