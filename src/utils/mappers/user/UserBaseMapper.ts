import { User } from '../../../models/auth/User';
import { BaseMapper } from '../BaseMapper';

/**
 * Shared base logic for User mapping to keep specialized mappers DRY and small.
 */
export class UserBaseMapper extends BaseMapper {
  static mapCommonIdentity(raw: any) {
    return {
      id: this.toNumber(raw.oyuncuID || raw.id || raw.ID),
      username: raw.oyuncukullaniciadi || raw.kullaniciadi || raw.username,
      tag: raw.oyuncuetiket || raw.tag
    };
  }

  static mapCommonVisuals(raw: any) {
    return {
      avatar: raw.oyuncuavatar || raw.avatar,
      avatarSmall: raw.avatarufak || raw.avatarSmall,
      avatarThumbnail: raw.avatarminnak || raw.avatarThumbnail,
      banner: raw.arkaplan || raw.banner,
      rankImage: raw.rutberesim || raw.rankImage
    };
  }

  static mapCommonStats(raw: any) {
    return {
      level: this.toNumber(raw.oyuncuseviye || raw.seviye || raw.level),
      xp: this.toNumber(raw.oyuncuseviyexp || raw.xp),
      xpNext: this.toNumber(raw.xp_next || raw.xpNext),
      points: this.toNumber(raw.puan || raw.points),
      popularity: this.toNumber(raw.oyuncupop || raw.populerlik || raw.popularity)
    };
  }

  static splitDisplayName(displayName: string) {
    if (!displayName) return { firstName: undefined, lastName: undefined };
    const parts = displayName.trim().split(' ');
    if (parts.length > 1) {
      const lastName = parts.pop();
      const firstName = parts.join(' ');
      return { firstName, lastName };
    }
    return { firstName: displayName, lastName: undefined };
  }
}
