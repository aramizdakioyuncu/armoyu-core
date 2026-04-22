import { PlatformStatsResponse, CountryResponse, ProvinceResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Location and Platform Stats.
 * Version-aware structure: Entry point delegates to specific version mappers.
 */
export class LocationMapper extends BaseMapper {
  static mapStats(raw: any): PlatformStatsResponse {
    const legacy = this.shouldReturnRaw<PlatformStatsResponse>(raw);
    if (legacy) return legacy;
    if (!raw) return {} as PlatformStatsResponse;

    return this.mapStatsV1(raw);
  }

  // --- VERSION 1 ---

  private static mapStatsV1(raw: any): PlatformStatsResponse {
    return {
      activeUsers: this.toNumber(raw.aktif_sayi),
      totalUsers: this.toNumber(raw.oyuncu_sayi),
      totalGroups: this.toNumber(raw.grup_sayi),
      totalEvents: this.toNumber(raw.etkinlik_sayi),
      activeUsers24h: this.toNumber(raw.aktif_sayi_24)
    };
  }

  static mapCountry(raw: any): CountryResponse {
    return {
      id: this.toNumber(raw.country_ID || raw.ulkeID || raw.ID),
      name: raw.country_name || raw.ulkeadi || raw.baslik || raw.ad,
      code: raw.country_code || raw.code || '',
      phoneCode: raw.country_phoneCode || raw.phoneCode || 0
    };
  }

  static mapCountryList(rawList: any[]): CountryResponse[] {
    return (rawList || []).map(item => this.mapCountry(item));
  }

  static mapProvince(raw: any): ProvinceResponse {
    return {
      id: this.toNumber(raw.province_ID || raw.sehirID || raw.ID),
      name: raw.province_name || raw.sehiradi || raw.baslik || raw.ad,
      plateCode: raw.province_plateCode || raw.plateCode || 0,
      phoneCode: raw.province_phoneCode || raw.phoneCode || 0
    };
  }

  static mapProvinceList(rawList: any[]): ProvinceResponse[] {
    return (rawList || []).map(item => this.mapProvince(item));
  }

  static mapLocation(raw: any): any {
    if (!raw) return null;
    return {
      id: this.toNumber(raw.ID),
      name: raw.baslik || raw.ad
    };
  }

  // --- VERSION 2 ---
  private static mapStatsV2(raw: any): PlatformStatsResponse {
    return this.mapStatsV1(raw);
  }
}
