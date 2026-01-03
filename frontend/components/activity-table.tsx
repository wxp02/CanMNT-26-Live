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
import { fetchLivePulse, PlayerEvent } from "@/lib/api";

interface ActivityTableProps {
  filters: {
    eventType: string;
    timeRange: string;
    player: string;
  };
}

export function ActivityTable({ filters }: ActivityTableProps) {
  const [activities, setActivities] = useState<PlayerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  useEffect(() => {
    async function loadActivities() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchLivePulse();
        setActivities(data.events || []);
      } catch (err) {
        console.error("Failed to load activities:", err);
        setError("Failed to load activity data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
    // Refresh every 60 seconds
    const interval = setInterval(loadActivities, 60000);
    return () => clearInterval(interval);
  }, []);

  // Apply filters
  const filteredActivities = activities.filter((activity) => {
    // Filter by event type
    if (filters.eventType !== "all" && activity.type !== filters.eventType) {
      return false;
    }

    // Filter by player
    if (filters.player !== "all" && activity.player !== filters.player) {
      return false;
    }

    // Filter by time range
    if (filters.timeRange !== "all") {
      const now = new Date();
      const timestamp = activity.timestamp.toLowerCase();

      // Parse relative timestamps
      if (timestamp.includes("day")) {
        const daysMatch = timestamp.match(/(\d+)\s*day/);
        if (daysMatch) {
          const daysAgo = parseInt(daysMatch[1]);
          if (filters.timeRange === "7days" && daysAgo > 7) return false;
          if (filters.timeRange === "30days" && daysAgo > 30) return false;
        }
      } else if (timestamp.includes("hour")) {
        // Events within hours are always included
      } else if (
        timestamp.includes("minute") ||
        timestamp.includes("just now")
      ) {
        // Events within minutes are always included
      }
    }

    return true;
  });
  // Pagination
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = filteredActivities.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);
  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card overflow-hidden p-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-muted-foreground">Loading activity data...</p>
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

  if (filteredActivities.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card overflow-hidden p-12">
        <div className="text-center">
          <p className="text-muted-foreground">
            {activities.length === 0
              ? "No recent activity found. Events will appear here when players are in action."
              : "No activities match the selected filters."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Timestamp</TableHead>
              <TableHead className="font-semibold">Player</TableHead>
              <TableHead className="font-semibold">Event</TableHead>
              <TableHead className="font-semibold">Game</TableHead>
              <TableHead className="font-semibold">League</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedActivities.map((activity) => {
              return (
                <TableRow key={activity.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    <div>{activity.timestamp}</div>
                    <div className="text-xs">{activity.minute}</div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {activity.player}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        activity.type === "goal"
                          ? "default"
                          : activity.type === "assist"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {activity.event}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {activity.context}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {activity.league}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, filteredActivities.length)} of{" "}
            {filteredActivities.length} events
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
