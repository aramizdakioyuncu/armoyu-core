export interface LeaderboardEntryResponse {
  rank?: number;
  userId?: string | number;
  username?: string;
  score?: number;
  level?: number;
}

export interface LeaderboardResponse {
  category?: string;
  entries?: LeaderboardEntryResponse[];
  updatedAt?: string;
}
