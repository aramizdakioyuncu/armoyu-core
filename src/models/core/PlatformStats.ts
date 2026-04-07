import { GlobalStats } from '../../types/stats';

/**
 * Platform Statistics Class
 * Bu sınıf, GlobalStats verisini sarmalar ve platform analitiği için yardımcı metodlar sunar.
 */
export class PlatformStats implements GlobalStats {
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

  constructor(data: GlobalStats) {
    this.totalPlayers = data.totalPlayers;
    this.malePlayers = data.malePlayers;
    this.femalePlayers = data.femalePlayers;
    this.totalForums = data.totalForums;
    this.totalPolls = data.totalPolls;
    this.activeUsers24h = data.activeUsers24h;
    this.totalMatchesPlayed = data.totalMatchesPlayed;
    this.totalGuilds = data.totalGuilds;
    this.monthlyVisitors = data.monthlyVisitors;
    this.totalNews = data.totalNews;
  }

  /**
   * Cinsiyet Dağılım Oranlarını Döndürür
   */
  getGenderDistribution() {
    const malePercent = Math.round((this.malePlayers / (this.malePlayers + this.femalePlayers)) * 100);
    const femalePercent = 100 - malePercent;
    return { malePercent, femalePercent };
  }

  /**
   * Bir metrik için büyüme oranını hesaplar (Mock Veri)
   */
  getGrowthRate(metric: keyof GlobalStats): number {
    // Gerçek bir veritabanında bu, dünkü veriye göre hesaplanırdı.
    // Şimdilik tutarlı olması için statik mock değerler dönüyoruz.
    const growthMap: Partial<Record<keyof GlobalStats, number>> = {
      totalPlayers: 12.4,
      activeUsers24h: 8.2,
      monthlyVisitors: 5.7,
      totalNews: 3.1,
      totalGuilds: 1.5,
    };
    return growthMap[metric] || 0;
  }

  /**
   * Harita verisi için günlük ziyaretçi trendini döndürür (Mock Veri)
   */
  getVisitorTrend() {
    return [45, 52, 48, 70, 61, 85, 92]; // Son 7 günün büyüme trendi (%)
  }

  /**
   * Forum, Anket ve Haberler bazında aktivite özeti
   */
  getActivityBreakdown() {
    return [
      { label: 'Forum Konuları', value: this.totalForums, color: '#3b82f6' },
      { label: 'Haber İçerikleri', value: this.totalNews, color: '#10b981' },
      { label: 'Aktif Anketler', value: this.totalPolls, color: '#f59e0b' },
    ];
  }
}
