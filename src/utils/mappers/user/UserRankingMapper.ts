import { User } from '../../../models/auth/User';
import { UserBaseMapper } from './UserBaseMapper';

/**
 * Specialized mapper for User Rankings (XP, Popularity).
 * Handles the 'oyuncu*' prefix fields characteristic of ranking responses.
 */
export class UserRankingMapper extends UserBaseMapper {
  static mapRankingUser(raw: any): User {
    if (!raw) return {} as User;

    const displayName = raw.oyuncuadsoyad || raw.adsoyad || raw.displayName;
    const { firstName, lastName } = this.splitDisplayName(displayName);

    return {
      ...this.mapCommonIdentity(raw),
      firstName: raw.ad || firstName,
      lastName: raw.soyad || lastName,
      displayName: displayName,
      ...this.mapCommonVisuals(raw),
      ...this.mapCommonStats(raw)
    };
  }
}
