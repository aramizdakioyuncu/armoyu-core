import { BaseModel } from '../BaseModel';
import { GlobalStats } from '../../types/stats';

/**
 * Platform Statistics Class
 * Bu sınıf, GlobalStats verisini sarmalar ve platform analitiği için yardımcı metodlar sunar.
 */
export class PlatformStats extends BaseModel implements GlobalStats {
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
    super();
    this.totalPlayers = data.totalPlayers || 0;
    this.malePlayers = data.malePlayers || 0;
    this.femalePlayers = data.femalePlayers || 0;
    this.totalForums = data.totalForums || 0;
    this.totalPolls = data.totalPolls || 0;
    this.activeUsers24h = data.activeUsers24h || 0;
    this.totalMatchesPlayed = data.totalMatchesPlayed || 0;
    this.totalGuilds = data.totalGuilds || 0;
    this.monthlyVisitors = data.monthlyVisitors || 0;
    this.totalNews = data.totalNews || 0;
  }

  /**
   * Instantiates a PlatformStats object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): PlatformStats {
    if (BaseModel.usePreviousApi) {
      return PlatformStats.legacyFromJSON(json);
    }
    return PlatformStats.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): PlatformStats {
    return new PlatformStats({
      totalPlayers: json.totalPlayers || json.toplam_oyuncu || 0,
      malePlayers: json.malePlayers || json.erkek_oyuncu || 0,
      femalePlayers: json.femalePlayers || json.kadin_oyuncu || 0,
      totalForums: json.totalForums || json.toplam_forum || 0,
      totalPolls: json.totalPolls || json.toplam_anket || 0,
      activeUsers24h: json.activeUsers24h || json.aktif_24s || 0,
      totalMatchesPlayed: json.totalMatchesPlayed || json.toplam_mac || 0,
      totalGuilds: json.totalGuilds || json.toplam_lonca || 0,
      monthlyVisitors: json.monthlyVisitors || json.aylik_ziyaretci || 0,
      totalNews: json.totalNews || json.toplam_haber || 0,
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): PlatformStats {
    return new PlatformStats({} as any);
  }

  /**
   * Cinsiyet Dağılım Oranlarını Döndürür
   */
  getGenderDistribution() {
    const total = this.malePlayers + this.femalePlayers;
    if (total === 0) return { malePercent: 0, femalePercent: 0 };
    const malePercent = Math.round((this.malePlayers / total) * 100);
    const femalePercent = 100 - malePercent;
    return { malePercent, femalePercent };
  }

  /**
   * Bir metrik için büyüme oranını hesaplar (Mock Veri)
   */
  getGrowthRate(metric: keyof GlobalStats): number {
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
