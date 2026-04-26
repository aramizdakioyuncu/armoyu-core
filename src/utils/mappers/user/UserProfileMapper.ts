import { UserProfileDTO, UserSocialsDTO, UserGameDTO, User } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for full User Profile details.
 * Supports both standard legacy fields and the rich nested fields seen in modern legacy responses.
 */
export class UserProfileMapper extends BaseMapper {
  static mapProfile(raw: any): User {
    const legacy = this.shouldReturnRaw<UserProfileDTO>(raw);
    if (legacy) return new User(legacy);
    if (!raw) return new User({} as UserProfileDTO);

    const detail = raw.detailInfo || {};
    const stats = raw.istatistik || {};
    const rank = raw.userRole || {};
    const favTeam = raw.favTeam || {};
    const job = raw.job || {};

    return new User({
      id: this.toNumber(raw.playerID || raw.ID || raw.oyuncuID),
      username: raw.username || raw.kullaniciadi || '',
      displayName: raw.displayName || raw.adsoyad || '',
      firstName: raw.firstName || '',
      lastName: raw.lastName || '',
      avatar: raw.avatar?.media_URL || this.toImageUrl(raw.oyuncuavatar) || '',
      banner: raw.banner?.media_URL || this.toImageUrl(raw.oyuncuarplan) || '',
      wallpaper: raw.wallpaper?.media_URL || '',
      level: this.toNumber(raw.level || raw.seviye),
      levelXP: raw.levelXP || '',
      levelColor: raw.levelColor || '',
      points: this.toNumber(raw.points || raw.para),
      gender: raw.cinsiyet || '',
      location: detail.province?.province_name || '',
      province: detail.province?.province_name || '',
      country: detail.country?.country_name || '',
      status: detail.about || '',
      horoscope: raw.burc || '',
      odp: raw.ODP || '',
      inviteCode: detail.inviteCode || '',
      birthday: detail.birthdayDate || '',
      age: this.toNumber(detail.age),
      lastLogin: detail.lastloginDateV2 || '',
      registeredDate: raw.registeredDate || '',
      job: {
        name: raw.job?.job_name || '',
        shortName: raw.job?.job_shortName || ''
      },
      stats: {
        friendsCount: this.toNumber(detail.friends),
        postsCount: this.toNumber(detail.posts),
        commentsCount: this.toNumber(stats.toplam_yorum),
        groupsCount: this.toNumber(stats.toplam_grup),
        gamesCount: this.toNumber(raw.mevcutoyunsayisi),
        commonFriendsCount: this.toNumber(raw.ortakarkadaslar)
      },
      rank: {
        id: this.toNumber(rank.roleID),
        name: rank.roleName || '',
        category: rank.rolecategory || '',
        color: rank.roleColor || '',
        logo: this.toImageUrl(rank.roleLogo) || ''
      },
      socials: this.mapSocials(raw.socailAccounts || raw.sosyalmedya),
      favoriteTeam: {
        id: this.toNumber(favTeam.team_ID),
        name: favTeam.team_name || '',
        logo: this.toImageUrl(favTeam.team_logo) || ''
      },
      popularGames: this.mapGames(raw.popularGames)
    });
  }

  static mapSocials(raw: any): UserSocialsDTO {
    if (!raw) return {};
    return {
      instagram: raw.instagram,
      twitter: raw.twitter || raw.x,
      facebook: raw.facebook,
      youtube: raw.youtube,
      discord: raw.discord,
      twitch: raw.twitch,
      steam: raw.steam,
      linkedin: raw.linkedin,
      github: raw.github,
      reddit: raw.reddit
    };
  }

  static mapGames(rawList: any[]): UserGameDTO[] {
    if (!Array.isArray(rawList)) return [];
    return rawList.map(g => ({
      id: this.toNumber(g.game_ID),
      name: g.game_name || '',
      shortName: g.game_shortName || '',
      logo: this.toImageUrl(g.game_logo?.media_URL) || '',
      score: this.toNumber(g.game_score),
      money: this.toNumber(g.game_money),
      role: g.game_role?.role_name || ''
    }));
  }
}
