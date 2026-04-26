export interface ProjectDTO {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  banner?: string;
  url?: string;
  category?: string;
  status?: string;
}

export interface ModDTO {
  id: number;
  name: string;
  version?: string;
  gameId?: number;
  description?: string;
  logo?: string;
  downloadUrl?: string;
  authorId?: number;
  authorName?: string;
}

export interface ProjectScoreDTO {
  rank: number;
  playerId: number;
  playerName: string;
  score: number;
  date: string;
}
