export * from './models/index';
export * from './api/ApiClient';
export * from './api/ArmoyuApi';
export * from './api/Logger';
export * from './services/BaseService';
export * from './services/AuthService';
export * from './services/UserService';
export * from './services/SocialService';
export * from './services/SocketService';
export * from './services/BlogService';
export * from './services/ShopService';
export * from './services/ForumService';
export * from './services/SupportService';
export * from './services/RuleService';
/**
 * Global Platform Statistics
 */
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
