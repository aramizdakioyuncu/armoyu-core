import { GlobalStats } from '../../types/stats';
/**
 * Platform Statistics Class
 * Bu sınıf, GlobalStats verisini sarmalar ve platform analitiği için yardımcı metodlar sunar.
 */
export declare class PlatformStats implements GlobalStats {
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
    constructor(data: GlobalStats);
    /**
     * Cinsiyet Dağılım Oranlarını Döndürür
     */
    getGenderDistribution(): {
        malePercent: number;
        femalePercent: number;
    };
    /**
     * Bir metrik için büyüme oranını hesaplar (Mock Veri)
     */
    getGrowthRate(metric: keyof GlobalStats): number;
    /**
     * Harita verisi için günlük ziyaretçi trendini döndürür (Mock Veri)
     */
    getVisitorTrend(): number[];
    /**
     * Forum, Anket ve Haberler bazında aktivite özeti
     */
    getActivityBreakdown(): {
        label: string;
        value: number;
        color: string;
    }[];
}
