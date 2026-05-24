import { Workplace, WorkplaceDTO } from '../../models';
import { BaseMapper } from '../mappers/BaseMapper';

/**
 * Mapper for Workplace V2 REST API responses.
 */
export class WorkplaceMapperV2 extends BaseMapper {
  static mapWorkplace(raw: any): Workplace | null {
    if (!raw) return null;
    return new Workplace({
      id: this.toNumber(raw.sirano),
      name: raw.kurumadi || '',
      type: raw.kurumturu || '',
      typeDetail: raw.kurumturudetay || '',
      logo: this.toImageUrl(raw.kurumlogo) || '',
      logoSmall: this.toImageUrl(raw.kurumlogoufaklik) || '',
      logoMini: this.toImageUrl(raw.kurumlogominnak) || '',
      photo: this.toImageUrl(raw.kurumfoto) || '',
      photoSmall: this.toImageUrl(raw.kurumfotoufaklik) || '',
      photoMini: this.toImageUrl(raw.kurumfotominnak) || '',
      shortName: raw.kurumkisaad || '',
      countryId: this.toNumber(raw.kurumulkesi),
      cityId: this.toNumber(raw.kurumili),
      districtId: this.toNumber(raw.kurumilcesi),
      urlSlug: raw.kurumurl || '',
      about: raw.kurumhakkinda || '',
      joinPassword: raw.kurumkatilimsifresi || '',
      memberCount: this.toNumber(raw.kurumoyuncusayisi),
      representative: raw.kurumtemsilci ?? null
    } as WorkplaceDTO);
  }

  static mapWorkplaceList(rawList: any[]): Workplace[] {
    return (rawList || []).map(item => this.mapWorkplace(item)).filter((n): n is Workplace => n !== null);
  }
}
