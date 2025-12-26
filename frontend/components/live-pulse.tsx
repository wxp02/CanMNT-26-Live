"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

interface PlayerEvent {
  id: number;
  player: string;
  event: string;
  type: "goal" | "assist" | "card" | "substitution";
  context: string;
  minute: string;
  timestamp: string;
  league: string;
  team?: string;
}

interface LivePulseResponse {
  events: PlayerEvent[];
  last_updated: string;
}

export function LivePulse() {
  const [events, setEvents] = useState<PlayerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/live-pulse");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data: LivePulseResponse = await response.json();
      setEvents(data.events);
      setError(null);
    } catch (err) {
      console.error("Error fetching live pulse:", err);
      setError("Unable to load live events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch immediately
    fetchEvents();

    // Refresh every 60 seconds
    const interval = setInterval(fetchEvents, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="flex gap-4">
              <div className="h-12 w-12 bg-muted rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">{error}</p>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          No recent events to display
        </p>
      </Card>
    );
  }
  return (
    <div className="space-y-3">
      {events.map((event) => (
        <Card
          key={event.id}
          className={`p-4 border-l-4 transition-all hover:shadow-md ${
            event.type === "goal"
              ? "border-l-goal bg-goal/5"
              : event.type === "assist"
              ? "border-l-assist bg-assist/5"
              : "border-l-destructive bg-destructive/5"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <Avatar className="h-12 w-12 mt-1">
                <AvatarImage
                  src={`/.jpg?height=48&width=48&query=${encodeURIComponent(
                    event.player + " headshot"
                  )}`}
                  alt={event.player}
                />
                <AvatarFallback>
                  {event.player
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-foreground">
                    {event.player}
                  </span>
                  <Badge
                    variant={
                      event.type === "goal"
                        ? "default"
                        : event.type === "assist"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {event.event}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {event.minute}
                  </span>
                </div>

                <div className="text-sm text-muted-foreground">
                  {event.context}
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {event.league}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {event.timestamp}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
