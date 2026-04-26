import { PlatformStatsDTO, CountryDTO, ProvinceDTO, Country, Province } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Location and Platform Stats.
 * Version-aware structure: Entry point delegates to specific version mappers.
 */
export class LocationMapper extends BaseMapper {
  static mapStats(raw: any): PlatformStatsDTO {
    const legacy = this.shouldReturnRaw<PlatformStatsDTO>(raw);
    if (legacy) return legacy;
    if (!raw) return {} as PlatformStatsDTO;

    return this.mapStatsV1(raw);
  }

  // --- VERSION 1 ---

  private static mapStatsV1(raw: any): PlatformStatsDTO {
    return {
      activeUsers: this.toNumber(raw.aktif_sayi),
      totalUsers: this.toNumber(raw.oyuncu_sayi),
      totalGroups: this.toNumber(raw.grup_sayi),
      totalEvents: this.toNumber(raw.etkinlik_sayi),
      activeUsers24h: this.toNumber(raw.aktif_sayi_24)
    };
  }

  static mapCountry(raw: any): Country {
    const legacy = this.shouldReturnRaw<CountryDTO>(raw);
    if (legacy) return new Country(legacy);
    if (!raw) return new Country({} as CountryDTO);

    return new Country({
      id: this.toNumber(raw.country_ID || raw.ulkeID || raw.ID),
      name: raw.country_name || raw.ulkeadi || raw.baslik || raw.ad || '',
      code: raw.country_code || raw.code || '',
      phoneCode: this.toNumber(raw.country_phoneCode || raw.phoneCode)
    });
  }

  static mapCountryList(rawList: any[]): Country[] {
    return (rawList || []).map(item => this.mapCountry(item));
  }

  static mapProvince(raw: any): Province {
    const legacy = this.shouldReturnRaw<ProvinceDTO>(raw);
    if (legacy) return new Province(legacy);
    if (!raw) return new Province({} as ProvinceDTO);

    return new Province({
      id: this.toNumber(raw.province_ID || raw.sehirID || raw.ID),
      name: raw.province_name || raw.sehiradi || raw.baslik || raw.ad || '',
      countryId: raw.ulkeID ? this.toNumber(raw.ulkeID) : undefined,
      plateCode: this.toNumber(raw.province_plateCode || raw.plateCode),
      phoneCode: this.toNumber(raw.province_phoneCode || raw.phoneCode)
    });
  }

  static mapProvinceList(rawList: any[]): Province[] {
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
  private static mapStatsV2(raw: any): PlatformStatsDTO {
    return this.mapStatsV1(raw);
  }
}
