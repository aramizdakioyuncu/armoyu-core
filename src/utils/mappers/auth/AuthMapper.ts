import { LoginResponse, MeResponse, UserResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Authentication related API responses.
 * Strictly specialized for the Login and Identity pages.
 */
export class AuthMapper extends BaseMapper {
  /**
   * Specifically for the Login response.
   */
  static mapLogin(raw: any, token?: string): LoginResponse {
    const legacy = this.shouldReturnRaw<LoginResponse>(raw);
    if (legacy) return legacy;
    if (!raw) return { user: { id: 0, username: '', displayName: '', avatar: '' }, token: '' } as LoginResponse;

    // The legacy API often returns the user data directly in 'icerik'
    const userRaw = raw.user || raw.icerik || raw;

    return {
      user: this.mapUser(userRaw),
      token: token || raw.token || raw.aciklama || '',
      session: {
        id: this.toNumber(raw.oturum_ID),
        ip: raw.oturum_IP || '',
        device: raw.oturum_cihaz || '',
        date: raw.oturum_zaman || raw.detailInfo?.lastloginDate || ''
      }
    };
  }

  /**
   * Specifically for the 'Me' / Identity check page.
   */
  static mapMe(raw: any): MeResponse {
    const legacy = this.shouldReturnRaw<MeResponse>(raw);
    if (legacy) return legacy;
    if (!raw) return {} as MeResponse;

    const data = raw.icerik || raw;
    return this.mapUser(data);
  }

  /**
   * Internal helper to map the rich user data found in Login and Me responses.
   */
  private static mapUser(raw: any): UserResponse {
    const detail = raw.detailInfo || {};
    const role = raw.userRole || {};
    const job = raw.job || {};
    const socials = raw.socailAccounts || raw.socials || {};

    return {
      id: this.toNumber(raw.playerID || raw.ID || raw.oyuncuID),
      username: raw.username || raw.kullaniciadi || '',
      displayName: raw.adsoyad || raw.displayName || raw.adisoyadi || '',
      firstName: raw.firstName || '',
      lastName: raw.lastName || '',

      avatar: this.toImageUrl(raw.avatar?.media_URL || raw.oyuncuavatar || raw.avatar),
      banner: this.toImageUrl(raw.banner?.media_URL || raw.oyuncuarplan || raw.banner),
      wallpaper: this.toImageUrl(raw.wallpaper?.media_URL || raw.wallpaper),

      about: detail.about || raw.durum_notu || '',
      email: detail.email || raw.eposta || '',
      gender: raw.cinsiyet || '',
      zodiac: raw.burc || '',
      location: detail.province?.province_name ? `${detail.province.province_name}, ${detail.country?.country_name}` : (detail.location || ''),
      city: detail.province?.province_name || '',
      country: detail.country?.country_name || '',

      level: this.toNumber(raw.level || raw.seviye),
      levelColor: raw.levelColor || '',
      xp: this.toNumber(raw.levelXP || raw.xp),
      xpNext: this.toNumber(raw.levelXPNext || raw.nextLevelXP),
      points: this.toNumber(raw.onur_puani || raw.ODP || raw.para),

      rank: role.roleName || '',
      rankTitle: role.roleName || '',
      rankCategory: role.rolecategory || '',
      rankColor: role.roleColor || '',

      jobTitle: job.job_name || '',
      memberNumber: raw.kulno || '',

      friendCount: this.toNumber(detail.friends),
      postCount: this.toNumber(detail.posts),
      awardCount: this.toNumber(detail.awards),
      gameCount: this.toNumber(raw.mevcutoyunsayisi),
      mutualFriendsCount: this.toNumber(raw.ortakarkadaslar),

      friendStatusText: raw.arkadasdurumaciklama || '',
      isFriend: raw.arkadasdurum === '1' || raw.arkadasdurum === 1,
      registrationDate: raw.registeredDate || '',
      lastSeen: detail.lastloginDateV2 || '',

      favTeam: raw.favTeam ? {
        id: this.toNumber(raw.favTeam.team_ID),
        name: raw.favTeam.team_name,
        logo: raw.favTeam.team_logo
      } : undefined,

      socials: {
        instagram: socials.instagram,
        twitter: socials.twitter || socials.x,
        facebook: socials.facebook,
        youtube: socials.youtube,
        discord: socials.discord,
        twitch: socials.twitch,
        steam: socials.steam
      },

      isSocial: !!(socials.instagram || socials.discord || socials.steam)
    };
  }
}
