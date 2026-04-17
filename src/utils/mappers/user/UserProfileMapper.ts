import { User } from '../../../models/auth/User';
import { UserBaseMapper } from './UserBaseMapper';

/**
 * Specialized mapper for User Profiles.
 */
export class UserProfileMapper extends UserBaseMapper {
  static mapProfile(raw: any): User {
    if (!raw) return {} as User;

    return {
      ...this.mapCommonIdentity(raw),
      firstName: raw.ad || raw.firstName,
      lastName: raw.soyad || raw.lastName,
      displayName: raw.adsoyad || raw.displayName,
      ...this.mapCommonVisuals(raw),
      ...this.mapCommonStats(raw),
      ...this.mapProfileDetails(raw)
    };
  }

  static mapProfileDetails(raw: any) {
    return {
      about: raw.hakkinda || raw.about,
      registrationDate: raw.kayittarih || raw.registrationDate,
      lastLoginDate: raw.son_giris_tarih || raw.lastLoginDate,
      rank: raw.rutbe || raw.rank,
      rankColor: raw.rutberenk || raw.rankColor,
      isOnline: this.toBool(raw.isOnline),
      isFriend: raw.arkadasdurum !== undefined ? this.toBool(raw.arkadasdurum) : undefined,
      friendCount: this.toNumber(raw.arkadassayisi || raw.friendCount),
      clans: raw.gruplar || raw.clans
    };
  }
}
