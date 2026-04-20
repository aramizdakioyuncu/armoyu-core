import { UserResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Specialized mapper for User Social operations (Search, Friends List).
 * Handles fields specific to social relationship responses.
 * Dedicated to the Social/Friends Page.
 */
export class UserSocialMapper extends BaseMapper {
  static mapSocialUser(raw: any): UserResponse {
    const legacy = this.shouldReturnRaw<UserResponse>(raw);
    if (legacy) return legacy;
    if (!raw) return {} as UserResponse;

    return {
      id: this.toNumber(raw.oyuncuID || raw.ID),
      username: raw.oyuncukullaniciadi || raw.kullaniciadi || '',
      displayName: raw.oyuncuadsoyad || raw.adsoyad || '',
      firstName: raw.ad,
      lastName: raw.soyad,
      avatar: this.toImageUrl(raw.oyuncuavatar),
      level: this.toNumber(raw.oyuncuseviye),
      xp: this.toNumber(raw.oyuncuseviyexp),
      points: this.toNumber(raw.puan),
      popularity: this.toNumber(raw.oyuncupop),
      isFriend: raw.arkadasdurum !== undefined ? this.toBool(raw.arkadasdurum) : undefined
    };
  }

  static mapSocialList(rawList: any[]): UserResponse[] {
    return (rawList || []).map(item => this.mapSocialUser(item));
  }
}
