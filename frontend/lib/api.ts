// API configuration and utility functions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface PlayerSeasonStats {
  player: string;
  team: string;
  hardcoded_team: string;
  position: string;
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
  playerName: string,
): Promise<SeasonStatsResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/season-stats?player=${encodeURIComponent(
        playerName,
      )}`,
      {
        cache: "no-store",
      },
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
  unix_timestamp?: number; // Optional: Unix timestamp for accurate sorting
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
export interface PlayerMatch {
  match_id: string;
  player: string;
  team: string;
  opponent: string;
  score: string;
  league: string;
  match_time: string;
  timestamp: string;
  is_substitute: boolean;
  rating: number | null;
}

export interface PlayerMatchesResponse {
  matches: PlayerMatch[];
  count: number;
  last_updated: string;
}

/**
 * Fetch all player match appearances
 */
export async function fetchPlayerMatches(
  playerName?: string,
): Promise<PlayerMatchesResponse> {
  try {
    const url = playerName
      ? `${API_BASE_URL}/api/player-matches?player=${encodeURIComponent(
          playerName,
        )}`
      : `${API_BASE_URL}/api/player-matches`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch player matches: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching player matches:", error);
    throw error;
  }
}
