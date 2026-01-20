"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchPlayerMatches, fetchLivePulse } from "@/lib/api";

interface GameLogTableProps {
  filters: {
    eventType: string;
    timeRange: string;
    player: string;
  };
}

interface GameLogEntry {
  player: string;
  match: string;
  league: string;
  date: string;
  isSubstitute: boolean;
  rating: string;
  goals: number;
  assists: number;
  cards: string[];
  timestamp: number;
  matchId: string;
}

export function GameLogTable({ filters }: GameLogTableProps) {
  const [gameLogs, setGameLogs] = useState<GameLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    async function loadGameLogs() {
      try {
        setLoading(true);
        setError(null);

        // Fetch all player matches from the new API
        const matchesData = await fetchPlayerMatches();
        const matches = matchesData.matches || [];

        // Fetch events to overlay goals/assists/cards onto matches
        const eventsData = await fetchLivePulse();
        const events = eventsData.events || [];

        // Create a map to aggregate events by match
        const eventsByMatch = new Map<string, any>();
        events.forEach((event) => {
          const matchKey = `${event.player}-${event.context}`;
          if (!eventsByMatch.has(matchKey)) {
            eventsByMatch.set(matchKey, {
              goals: 0,
              assists: 0,
              cards: [],
            });
          }
          const matchEvents = eventsByMatch.get(matchKey)!;
          if (event.type === "goal") matchEvents.goals += 1;
          else if (event.type === "assist") matchEvents.assists += 1;
          else if (event.type === "card") matchEvents.cards.push(event.event);
        });

        // Build game log entries from matches
        const logs: GameLogEntry[] = matches.map((match) => {
          const matchContext = `${match.team} ${match.score} ${match.opponent}`;
          const matchKey = `${match.player}-${matchContext}`;
          const matchEvents = eventsByMatch.get(matchKey) || {
            goals: 0,
            assists: 0,
            cards: [],
          };

          return {
            player: match.player,
            match: matchContext,
            league: match.league,
            date: match.timestamp,
            isSubstitute: match.is_substitute,
            rating: match.rating?.toFixed(1) || "N/A",
            goals: matchEvents.goals,
            assists: matchEvents.assists,
            cards: matchEvents.cards,
            timestamp: new Date(match.match_time).getTime(),
            matchId: match.match_id,
          };
        });

        setGameLogs(logs);
      } catch (err) {
        console.error("Failed to load game logs:", err);
        setError("Failed to load game log data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadGameLogs();
    const interval = setInterval(loadGameLogs, 60000);
    return () => clearInterval(interval);
  }, []);

  // Apply filters
  const filteredGameLogs = gameLogs.filter((log) => {
    // Filter by player
    if (filters.player !== "all" && log.player !== filters.player) {
      return false;
    }

    // Filter by time range
    if (filters.timeRange !== "all") {
      const timestamp = log.date.toLowerCase();

      if (timestamp.includes("day")) {
        const daysMatch = timestamp.match(/(\d+)\s*day/);
        if (daysMatch) {
          const daysAgo = parseInt(daysMatch[1]);
          if (filters.timeRange === "7days" && daysAgo > 7) return false;
          if (filters.timeRange === "30days" && daysAgo > 30) return false;
        }
      }
    }

    return true;
  });

  // Sort by most recent
  const sortedGameLogs = [...filteredGameLogs].sort((a, b) => {
    return b.timestamp - a.timestamp;
  });

  // Pagination
  const totalPages = Math.ceil(sortedGameLogs.length / itemsPerPage);
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1);
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const paginatedGameLogs = sortedGameLogs.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.player, filters.timeRange]);

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card overflow-hidden p-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-muted-foreground">Loading game logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-border bg-card overflow-hidden p-12">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  if (sortedGameLogs.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card overflow-hidden p-12">
        <div className="text-center">
          <p className="text-muted-foreground">
            {gameLogs.length === 0
              ? "No game logs found. Logs will appear here when players are in action."
              : "No game logs match the selected filters."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Player</TableHead>
                <TableHead className="font-semibold">Match</TableHead>
                <TableHead className="font-semibold">League</TableHead>
                <TableHead className="font-semibold text-center">Sub</TableHead>
                <TableHead className="font-semibold text-center">
                  Rating
                </TableHead>
                <TableHead className="font-semibold text-center">G</TableHead>
                <TableHead className="font-semibold text-center">A</TableHead>
                <TableHead className="font-semibold text-center">
                  Cards
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedGameLogs.map((log, index) => {
                const uniqueKey = `${log.player}-${log.match}-${index}`;

                return (
                  <TableRow
                    key={uniqueKey}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {log.date}
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap">
                      {log.player}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {log.match}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {log.league}
                    </TableCell>
                    <TableCell className="text-center">
                      {log.isSubstitute ? (
                        <span className="text-orange-600 dark:text-orange-400">
                          ✓
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-mono text-xs">
                        {log.rating}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {log.goals > 0 ? (
                        <span className="text-green-600 dark:text-green-400">
                          {log.goals}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {log.assists > 0 ? (
                        <span className="text-blue-600 dark:text-blue-400">
                          {log.assists}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {log.cards.length > 0 ? (
                        <div className="flex gap-1 justify-center">
                          {log.cards.map((card, i) => (
                            <Badge
                              key={i}
                              variant="destructive"
                              className={cn(
                                "text-xs px-1.5 py-0",
                                card.includes("Yellow")
                                  ? "bg-yellow-500 hover:bg-yellow-600"
                                  : "bg-red-500 hover:bg-red-600",
                              )}
                            >
                              {card.includes("Yellow") ? "Y" : "R"}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, sortedGameLogs.length)} of{" "}
            {sortedGameLogs.length} matches
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={validCurrentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {validCurrentPage} of {totalPages}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={validCurrentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
