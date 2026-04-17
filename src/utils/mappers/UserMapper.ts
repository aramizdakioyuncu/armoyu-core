import { User } from '../../models/auth/User';
import { BaseMapper } from './BaseMapper';

/**
 * Mapper for User related data structures.
 */
export class UserMapper extends BaseMapper {
  /**
   * Maps raw user data from API to standardized User interface.
   * Maintains backward compatibility.
   */
  static mapUser(raw: any, usePreviousVersion: boolean = false): User {
    const legacy = this.shouldReturnRaw<User>(raw, usePreviousVersion);
    if (legacy) return legacy;
    if (!raw) return {} as User;

    return {
      ...this.mapUserIdentity(raw),
      ...this.mapUserVisuals(raw),
      ...this.mapUserStats(raw),
      ...this.mapUserSocial(raw)
    };
  }

  /**
   * Modern v2 mapping for User.
   */
  static mapUserV2(raw: any): User {
    return this.mapUser(raw, false);
  }

  /**
   * Atomic: Maps identity related fields.
   */
  static mapUserIdentity(raw: any) {
    return {
      id: this.toNumber(raw.oyuncuID || raw.id || raw.ID),
      username: raw.kullaniciadi || raw.username,
      firstName: raw.ad || raw.firstName,
      lastName: raw.soyad || raw.lastName,
      displayName: raw.adsoyad || raw.displayName,
      tag: raw.oyuncuetiket || raw.tag
    };
  }

  /**
   * Atomic: Maps visual related fields.
   */
  static mapUserVisuals(raw: any) {
    return {
      avatar: raw.avatar,
      avatarSmall: raw.avatarufak || raw.avatarSmall,
      avatarThumbnail: raw.avatarminnak || raw.avatarThumbnail,
      banner: raw.arkaplan || raw.banner,
      rankImage: raw.rutberesim || raw.rankImage
    };
  }

  /**
   * Atomic: Maps statistics related fields.
   */
  static mapUserStats(raw: any) {
    return {
      level: this.toNumber(raw.seviye || raw.level),
      xp: this.toNumber(raw.xp),
      xpNext: this.toNumber(raw.xp_next || raw.xpNext),
      points: this.toNumber(raw.puan || raw.points),
      popularity: this.toNumber(raw.populerlik || raw.popularity)
    };
  }

  /**
   * Atomic: Maps social and ranking fields.
   */
  static mapUserSocial(raw: any) {
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
