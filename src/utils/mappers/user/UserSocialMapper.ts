import { User } from '../../../models/auth/User';
import { UserBaseMapper } from './UserBaseMapper';

/**
 * Specialized mapper for User Social operations (Search, Friends List).
 */
export class UserSocialMapper extends UserBaseMapper {
  static mapSocialUser(raw: any): User {
    if (!raw) return {} as User;

    return {
      ...this.mapCommonIdentity(raw),
      firstName: raw.ad || raw.firstName,
      lastName: raw.soyad || raw.lastName,
      displayName: raw.adsoyad || raw.displayName,
      ...this.mapCommonVisuals(raw),
      ...this.mapCommonStats(raw),
      isFriend: raw.arkadasdurum !== undefined ? this.toBool(raw.arkadasdurum) : undefined
    };
  }

  static mapSocialList(rawList: any[], usePreviousVersion: boolean = false): User[] {
    if (usePreviousVersion) return rawList;
    return (rawList || []).map(item => this.mapSocialUser(item));
  }
}
