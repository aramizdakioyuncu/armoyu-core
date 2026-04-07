// Models
export * from './models/index';

// Services
export * from './services/AuthService';
export * from './services/UserService';
export * from './services/SocialService';
export * from './services/SocketService';

// API
export * from './api/ApiClient';

export interface GlobalStats {
  totalPlayers: number;
  malePlayers: number;
  femalePlayers: number;
  totalForums: number;
  totalPolls: number;
  activeUsers24h: number;
  totalMatchesPlayed: number;
  totalGuilds: number;
  monthlyVisitors: number;
  totalNews: number;
}
