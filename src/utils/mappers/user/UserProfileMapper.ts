import { User } from '../../../models/auth/User';
import { UserBaseMapper } from './UserBaseMapper';

/**
 * Specialized mapper for User Profiles.
 */
export class UserProfileMapper extends UserBaseMapper {
  static mapProfile(raw: any): User {
    if (!raw) return {} as User;

    const socials = raw.socailAccounts || raw.socialAccounts || raw.socials || {};
    
    return {
      ...this.mapCommonIdentity(raw),
      firstName: raw.ad || raw.firstName,
      lastName: raw.soyad || raw.lastName,
      displayName: raw.adsoyad || raw.displayName,
      ...this.mapCommonVisuals(raw),
      ...this.mapCommonStats(raw),
      ...this.mapProfileDetails(raw),
      socials: {
        discord: socials.discord || '',
        steam: socials.steam || '',
        instagram: socials.instagram || '',
        youtube: socials.youtube || '',
        twitch: socials.twitch || '',
        linkedin: socials.linkedin || '',
        facebook: socials.facebook || ''
      },
      friends: raw.arkadasliste || []
    };
  }

  static mapProfileDetails(raw: any) {
    const detail = raw.detailInfo || {};
    return {
      about: detail.about || raw.hakkinda || raw.about,
      registrationDate: raw.registeredDate || raw.kayittarih || raw.registrationDate,
      lastLoginDate: detail.lastloginDate || raw.son_giris_tarih || raw.lastLoginDate,
      rank: raw.roleName || raw.rutbe || raw.rank,
      rankColor: raw.roleColor || raw.rutberenk || raw.rankColor,
      isOnline: this.toBool(raw.isOnline),
      isFriend: raw.arkadasdurum !== undefined ? this.toBool(raw.arkadasdurum) : undefined,
      friendCount: this.toNumber(detail.friends || raw.arkadassayisi || raw.friendCount),
      clans: raw.defaultGroup || raw.gruplar || raw.clans
    };
  }
}
