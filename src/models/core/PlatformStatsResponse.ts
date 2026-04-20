export interface PlatformStatsResponse {
  userCount?: number;
  postCount?: number;
  groupCount?: number;
  activeUsersOnline?: number;
  
  // From GlobalStats
  totalPlayers?: number;
  malePlayers?: number;
  femalePlayers?: number;
  totalForums?: number;
  totalPolls?: number;
  activeUsers24h?: number;
  totalMatchesPlayed?: number;
  totalGuilds?: number;
  monthlyVisitors?: number;
  totalNews?: number;
  activeUsers?: number;
  totalUsers?: number;
  totalGroups?: number;
  totalEvents?: number;
}
