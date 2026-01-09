#!/bin/bash
# CanMNT 26 LIVE - Data Update Script

echo "🔄 Updating CanMNT 26 LIVE data..."
echo ""

# Update match events
echo "📊 Updating match events..."
curl -X POST https://canmnt-26-live-backend.onrender.com/api/scrape-events
echo ""
echo ""

# Update season stats
echo "📈 Updating season statistics..."
curl -X POST https://canmnt-26-live-backend.onrender.com/api/scrape-season-stats
echo ""
echo ""

echo "✅ Data update complete!"
echo "Visit https://canmnt.live to see the updates"
