"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data - in production, this would be filtered based on props
const mockActivities = [
  {
    id: 1,
    timestamp: "Dec 14, 2024 - 14:30 EST",
    minute: "67'",
    player: "Alphonso Davies",
    event: "Goal",
    type: "goal",
    context: "Made it 3-1",
    opponent: "Borussia Dortmund",
    league: "Bundesliga",
  },
  {
    id: 2,
    timestamp: "Dec 14, 2024 - 12:15 EST",
    minute: "54'",
    player: "Jonathan David",
    event: "Assist",
    type: "assist",
    context: "Made it 2-0",
    opponent: "Lyon",
    league: "Ligue 1",
  },
  {
    id: 3,
    timestamp: "Dec 14, 2024 - 09:45 EST",
    minute: "23'",
    player: "Tajon Buchanan",
    event: "Goal",
    type: "goal",
    context: "Made it 1-0",
    opponent: "Napoli",
    league: "Serie A",
  },
  {
    id: 4,
    timestamp: "Dec 13, 2024 - 16:20 EST",
    minute: "78'",
    player: "Stephen Eustáquio",
    event: "Yellow Card",
    type: "card",
    context: "Tactical Foul",
    opponent: "Benfica",
    league: "Primeira Liga",
  },
  {
    id: 5,
    timestamp: "Dec 13, 2024 - 14:00 EST",
    minute: "89'",
    player: "Cyle Larin",
    event: "Goal",
    type: "goal",
    context: "Made it 2-1",
    opponent: "Real Betis",
    league: "La Liga",
  },
  {
    id: 6,
    timestamp: "Dec 12, 2024 - 15:30 EST",
    minute: "12'",
    player: "Alphonso Davies",
    event: "Assist",
    type: "assist",
    context: "Made it 1-0",
    opponent: "FC Augsburg",
    league: "Bundesliga",
  },
  {
    id: 7,
    timestamp: "Dec 11, 2024 - 13:45 EST",
    minute: "56'",
    player: "Jonathan David",
    event: "Goal",
    type: "goal",
    context: "Made it 2-1",
    opponent: "Marseille",
    league: "Ligue 1",
  },
  {
    id: 8,
    timestamp: "Dec 10, 2024 - 16:00 EST",
    minute: "90+2'",
    player: "Cyle Larin",
    event: "Goal",
    type: "goal",
    context: "Made it 3-2",
    opponent: "Valencia",
    league: "La Liga",
  },
]

interface ActivityTableProps {
  filters: {
    eventType: string
    timeRange: string
    player: string
  }
}

export function ActivityTable({ filters }: ActivityTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Timestamp</TableHead>
            <TableHead className="font-semibold">Player</TableHead>
            <TableHead className="font-semibold">Event</TableHead>
            <TableHead className="font-semibold">Context</TableHead>
            <TableHead className="font-semibold">Opponent</TableHead>
            <TableHead className="font-semibold">League</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockActivities.map((activity) => (
            <TableRow key={activity.id} className="hover:bg-muted/50">
              <TableCell className="font-mono text-sm text-muted-foreground">
                <div>{activity.timestamp}</div>
                <div className="text-xs">{activity.minute}</div>
              </TableCell>
              <TableCell className="font-medium">{activity.player}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    activity.type === "goal" ? "default" : activity.type === "assist" ? "secondary" : "destructive"
                  }
                >
                  {activity.event}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{activity.context}</TableCell>
              <TableCell className="text-sm">{activity.opponent}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {activity.league}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
