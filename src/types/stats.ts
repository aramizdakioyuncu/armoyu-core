/**
 * Global Statistics Interface
 * Bu arayüz, sitemizin genelindeki tüm sayısal verileri tutmak için tasarlanmıştır.
 * İlerleyen aşamalarda bu veriler backend API üzerinden dinamik olarak beslenecektir.
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
