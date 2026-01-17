"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, TrendingUp, Waves, TrendingDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { fetchSeasonStats, PlayerSeasonStats } from "@/lib/api";

interface Player {
  name: string;
  position: string;
  form: number;
  probability: number;
  minutesPlayed: number;
  goals: number;
  assists: number;
  league: string;
  team?: string;
}

// Hardcoded roster probabilities based on analysis
const ROSTER_PROBABILITIES: Record<string, number> = {
  // The Locks (75%-100% Probability)
  "Alphonso Davies": 100,
  "Jonathan David": 100,
  "Stephen Eustáquio": 100,
  "Tajon Buchanan": 100,
  "Alistair Johnston": 100,
  "Ismaël Koné": 100,
  "Moise Bombito": 95,
  "Dayne St. Clair": 90,
  "Richie Laryea": 90,
  "Ali Ahmed": 90,
  "Promise David": 85,
  "Niko Sigur": 85,
  "Derek Cornelius": 85,
  "Maxime Crépeau": 78,

  // The Bubble (60%-75% Probability)
  "Nathan-Dylan Saliba": 74,
  "Tani Oluwaseyi": 73,
  "Jacob Shaffelburg": 72,
  "Mathieu Choinière": 65,
  "Alfie Jones": 62,
  "Jayden Nelson": 61,

  // Outside Looking In (40-60% Probability)
  "Joel Waterman": 59,
  "Theo Bair": 50,
  "Kamal Miller": 45,
  "Jonathan Osorio": 40,
  "Cyle Larin": 40,

  // Cold/Dropped
  "Junior Hoilett": 25,
  "Owen Goodman": 20,
  "Zorhan Bassong": 15,
};

interface PlayersByTier {
  locks: Player[];
  probables: Player[];
  bubble: Player[];
  cold: Player[];
}

const mockPlayers: PlayersByTier = {
  locks: [
    {
      name: "Alphonso Davies",
      position: "LB",
      form: 85,
      probability: 100,
      minutesPlayed: 1620,
      goals: 3,
      assists: 8,
      league: "Bundesliga",
    },
    {
      name: "Jonathan David",
      position: "ST",
      form: 92,
      probability: 100,
      minutesPlayed: 1580,
      goals: 15,
      assists: 4,
      league: "Ligue 1",
    },
    {
      name: "Stephen Eustáquio",
      position: "CM",
      form: 78,
      probability: 100,
      minutesPlayed: 1450,
      goals: 2,
      assists: 5,
      league: "Primeira Liga",
    },
    {
      name: "Maxime Crépeau",
      position: "GK",
      form: 81,
      probability: 80,
      minutesPlayed: 1620,
      goals: 0,
      assists: 0,
      league: "MLS",
    },
  ],
  probables: [
    {
      name: "Tajon Buchanan",
      position: "RW",
      form: 74,
      probability: 100,
      minutesPlayed: 1120,
      goals: 4,
      assists: 6,
      league: "Serie A",
    },
    {
      name: "Cyle Larin",
      position: "ST",
      form: 76,
      probability: 40,
      minutesPlayed: 1340,
      goals: 9,
      assists: 2,
      league: "La Liga",
    },
    {
      name: "Alistair Johnston",
      position: "RB",
      form: 79,
      probability: 100,
      minutesPlayed: 1480,
      goals: 1,
      assists: 4,
      league: "Scottish Premiership",
    },
    {
      name: "Ismaël Koné",
      position: "CM",
      form: 72,
      probability: 100,
      minutesPlayed: 1260,
      goals: 3,
      assists: 7,
      league: "Championship",
    },
  ],
  bubble: [
    {
      name: "Jonathan Osorio",
      position: "CM",
      form: 68,
      probability: 40,
      minutesPlayed: 980,
      goals: 2,
      assists: 3,
      league: "MLS",
    },
    {
      name: "Derek Cornelius",
      position: "CB",
      form: 71,
      probability: 80,
      minutesPlayed: 1150,
      goals: 1,
      assists: 1,
      league: "Ligue 1",
    },
    {
      name: "Richie Laryea",
      position: "RB",
      form: 66,
      probability: 90,
      minutesPlayed: 890,
      goals: 0,
      assists: 5,
      league: "MLS",
    },
    {
      name: "Liam Millar",
      position: "LW",
      form: 69,
      probability: 30,
      minutesPlayed: 1020,
      goals: 4,
      assists: 2,
      league: "Championship",
    },
  ],
  cold: [
    {
      name: "Lucas Cavallini",
      position: "ST",
      form: 54,
      probability: 10,
      minutesPlayed: 520,
      goals: 1,
      assists: 1,
      league: "MLS",
    },
    {
      name: "Samuel Piette",
      position: "CDM",
      form: 58,
      probability: 15,
      minutesPlayed: 680,
      goals: 0,
      assists: 2,
      league: "MLS",
    },
  ],
};

function PlayerCard({ player, tier }: { player: any; tier: string }) {
  const getTierColor = () => {
    switch (tier) {
      case "locks":
        return "text-lock";
      case "probables":
        return "text-probable";
      case "bubble":
        return "text-bubble";
      default:
        return "text-cold";
    }
  };

  return (
    <Card className="p-4 bg-card border-border hover:border-foreground/20 transition-colors">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">{player.name}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {player.position}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {player.team}
              </Badge>
            </div>
          </div>
          <div className={`text-2xl font-bold ${getTierColor()}`}>
            {player.probability}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Form Rating</span>
            <span className="font-medium">{player.form}/100</span>
          </div>
          <Progress value={player.form} className="h-1.5" />
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
          <div className="space-y-0.5">
            <div className="text-xs text-muted-foreground">Minutes</div>
            <div className="text-sm font-semibold">{player.minutesPlayed}'</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xs text-muted-foreground">Goals</div>
            <div className="text-sm font-semibold text-goal">
              {player.goals}
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xs text-muted-foreground">Assists</div>
            <div className="text-sm font-semibold text-assist">
              {player.assists}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Categorize players into tiers based on probability
function categorizePlayers(
  statsData: Record<string, PlayerSeasonStats>,
): PlayersByTier {
  const players: Player[] = Object.values(statsData).map((stats) => {
    const probability = ROSTER_PROBABILITIES[stats.player] || 0;
    return {
      name: stats.player,
      position: stats.position || "MF",
      form: Math.round(stats.form_rating),
      probability: probability,
      minutesPlayed: stats.minutes,
      goals: stats.goals,
      assists: stats.assists,
      league: stats.league,
      team: stats.hardcoded_team || stats.team,
    };
  });

  // Sort by probability first, then form rating
  players.sort((a, b) => {
    if (b.probability !== a.probability) {
      return b.probability - a.probability;
    }
    return b.form - a.form;
  });

  // Categorize into tiers based on probability
  const locks = players.filter((p) => p.probability >= 75);
  const probables = players.filter(
    (p) => p.probability >= 60 && p.probability < 75,
  );
  const bubble = players.filter(
    (p) => p.probability >= 40 && p.probability < 60,
  );
  const cold = players.filter((p) => p.probability < 40);

  return { locks, probables, bubble, cold };
}

export function RosterTiers() {
  const [players, setPlayers] = useState<PlayersByTier>(mockPlayers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        console.log("Fetching season stats from API...");
        const data = await fetchSeasonStats();
        console.log("Received data:", data);

        if (data.players && Object.keys(data.players).length > 0) {
          console.log(
            `Categorizing ${Object.keys(data.players).length} players...`,
          );
          const categorized = categorizePlayers(data.players);
          console.log("Categorized players:", categorized);
          setPlayers(categorized);
        } else {
          // Use mock data if no real data available
          console.warn("No player data available, using mock data");
        }
      } catch (err) {
        console.error("Failed to load season stats:", err);
        setError(
          `Failed to load player stats: ${
            err instanceof Error ? err.message : "Unknown error"
          }`,
        );
        // Keep mock data on error
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-12">
      {/* Loading/Error State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-muted-foreground">
            Loading player statistics...
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-4 text-sm text-yellow-600 dark:text-yellow-400">
          {error}
        </div>
      )}

      {!loading && (
        <>
          {/* The Locks */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-lock/10">
                <Lock className="h-6 w-6 text-lock" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  The Locks
                </h2>
                <p className="text-sm text-muted-foreground">
                  Guaranteed roster spots • 75%-100% Probability
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {players.locks.length > 0 ? (
                players.locks.map((player) => (
                  <PlayerCard key={player.name} player={player} tier="locks" />
                ))
              ) : (
                <p className="text-muted-foreground col-span-4">
                  No players in this tier yet.
                </p>
              )}
            </div>
          </div>

          {/* Probables */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-probable/10">
                <TrendingUp className="h-6 w-6 text-probable" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Probables
                </h2>
                <p className="text-sm text-muted-foreground">
                  Strong contenders • 60%-75% Probability
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {players.probables.length > 0 ? (
                players.probables.map((player) => (
                  <PlayerCard
                    key={player.name}
                    player={player}
                    tier="probables"
                  />
                ))
              ) : (
                <p className="text-muted-foreground col-span-4">
                  No players in this tier yet.
                </p>
              )}
            </div>
          </div>

          {/* The Bubble */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-bubble/10">
                <Waves className="h-6 w-6 text-bubble" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  The Bubble
                </h2>
                <p className="text-sm text-muted-foreground">
                  Fighting for spots • 40-60% Probability
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {players.bubble.length > 0 ? (
                players.bubble.map((player) => (
                  <PlayerCard key={player.name} player={player} tier="bubble" />
                ))
              ) : (
                <p className="text-muted-foreground col-span-4">
                  No players in this tier yet.
                </p>
              )}
            </div>
          </div>

          {/* Cold/Dropped */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cold/10">
                <TrendingDown className="h-6 w-6 text-cold" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Cold/Dropped
                </h2>
                <p className="text-sm text-muted-foreground">
                  Losing favor • Less than 40% Probability
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {players.cold.length > 0 ? (
                players.cold.map((player) => (
                  <PlayerCard key={player.name} player={player} tier="cold" />
                ))
              ) : (
                <p className="text-muted-foreground col-span-4">
                  No players in this tier yet.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
