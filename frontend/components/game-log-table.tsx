"use client";

import { Wrench } from "lucide-react";

interface GameLogTableProps {
  filters: {
    eventType: string;
    timeRange: string;
    player: string;
  };
}

export function GameLogTable({ filters }: GameLogTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden p-16">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-amber-500/10">
            <Wrench className="h-12 w-12 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-foreground">Coming Soon</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            We're building something exciting! Match logs will be available here
            soon with detailed player performance data from every game.
          </p>
        </div>
      </div>
    </div>
  );
}
