export interface LeaderboardEntry {
  rank?: number;
  userId?: string | number;
  username?: string;
  score?: number;
  level?: number;
}

export interface Leaderboard {
  category?: string;
  entries?: LeaderboardEntry[];
  updatedAt?: string;
}



