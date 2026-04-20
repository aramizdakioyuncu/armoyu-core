import { UserProfileResponse, UserSocialsResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for full User Profile details.
 * Supports both standard legacy fields and the rich nested fields seen in modern legacy responses.
 */
export class UserProfileMapper extends BaseMapper {
  static mapProfile(raw: any): UserProfileResponse {
    const legacy = this.shouldReturnRaw<UserProfileResponse>(raw);
    if (legacy) return legacy;
    if (!raw) return {} as UserProfileResponse;

    const detail = raw.detailInfo || {};
    const stats = raw.istatistik || {};
    const rank = raw.userRole || raw.rutbe || {};

    return {
      id: this.toNumber(raw.playerID || raw.ID || raw.oyuncuID),
      username: raw.username || raw.kullaniciadi,
      displayName: raw.displayName || raw.adsoyad,
      avatar: raw.avatar?.media_URL || this.toImageUrl(raw.oyuncuavatar),
      banner: raw.banner?.media_URL || this.toImageUrl(raw.oyuncuarplan),
      level: this.toNumber(raw.level || raw.seviye),
      xp: this.toNumber(raw.levelXP || raw.xp),
      xpNext: this.toNumber(raw.gecerli_xp),
      points: this.toNumber(raw.points || raw.para),
      gender: raw.cinsiyet,
      location: raw.city || detail.province?.province_name,
      status: raw.durum_notu || detail.about,
      stats: {
        friendsCount: this.toNumber(detail.friends || stats.toplam_arkadas),
        postsCount: this.toNumber(detail.posts || stats.toplam_paylasim),
        commentsCount: this.toNumber(stats.toplam_yorum),
        groupsCount: this.toNumber(stats.toplam_grup)
      },
      rank: {
        name: rank.roleName || rank.rutbe_ad,
        logo: this.toImageUrl(rank.roleLogo || rank.rutbe_logo)
      },
      socials: this.mapSocials(raw.socailAccounts || raw.sosyalmedya)
    };
  }

  static mapSocials(raw: any): UserSocialsResponse {
    if (!raw) return {};
    return {
      instagram: raw.instagram,
      twitter: raw.twitter || raw.x,
      facebook: raw.facebook,
      youtube: raw.youtube,
      discord: raw.discord,
      twitch: raw.twitch,
      steam: raw.steam
    };
  }
}
