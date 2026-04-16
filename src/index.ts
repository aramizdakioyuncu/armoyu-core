// Models
export * from './models/index';

// API Core
export * from './api/ApiClient';
export * from './api/ArmoyuApi';
export * from './api/Logger';

// Services
export * from './services/BaseService';
export * from './services/AuthService';
export * from './services/UserService';
export * from './services/SocketService';
export * from './services/BlogService';
export * from './services/ShopService';
export * from './services/ForumService';
export * from './services/SupportService';
export * from './services/RuleService';
export * from './services/ManagementService';
export * from './services/SiteInformationService';
export * from './services/GroupService';
export * from './services/SocialService';
export * from './services/ChatService';
export * from './services/SearchService';
export * from './services/EventService';
export * from './services/BusinessService';


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




