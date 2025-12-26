// API configuration and utility functions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface PlayerSeasonStats {
  player: string;
  team: string;
  league: string;
  season: string;
  matches: number;
  minutes: number;
  goals: number;
  assists: number;
  rating: number;
  form_rating: number;
}

export interface SeasonStatsResponse {
  season: string;
  players: Record<string, PlayerSeasonStats>;
  count: number;
  last_updated: string;
}

/**
 * Fetch current season statistics for all Canadian players
 */
export async function fetchSeasonStats(): Promise<SeasonStatsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/season-stats`, {
      cache: "no-store", // Always get fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch season stats: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching season stats:", error);
    throw error;
  }
}

/**
 * Fetch season statistics for a specific player
 */
export async function fetchPlayerStats(
  playerName: string
): Promise<SeasonStatsResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/season-stats?player=${encodeURIComponent(
        playerName
      )}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch player stats: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching stats for ${playerName}:`, error);
    throw error;
  }
}

export interface PlayerEvent {
  id: number;
  player: string;
  event: string;
  type: string;
  context: string;
  minute: string;
  timestamp: string;
  league: string;
  team: string;
}

export interface LivePulseResponse {
  events: PlayerEvent[];
  last_updated: string;
}

/**
 * Fetch live player events
 */
export async function fetchLivePulse(): Promise<LivePulseResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/live-pulse`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch live pulse: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching live pulse:", error);
    throw error;
  }
}
