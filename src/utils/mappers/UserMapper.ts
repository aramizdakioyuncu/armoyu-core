import { User } from '../../models/auth/User';
import { UserRankingMapper } from './user/UserRankingMapper';
import { UserProfileMapper } from './user/UserProfileMapper';
import { UserSocialMapper } from './user/UserSocialMapper';

/**
 * Facade for User mapping. Delegates to specialized mappers.
 * Maintains backward compatibility while allowing request-specific precision.
 */
export class UserMapper {
  static mapUser(raw: any, usePreviousVersion: boolean = false): User {
    if (usePreviousVersion) return raw;
    if (!raw) return {} as User;

    // Detect context if possible, or fallback to profile (most comprehensive)
    if (raw.oyuncuID && (raw.oyuncuseviye !== undefined || raw.oyuncupop !== undefined)) {
      return UserRankingMapper.mapRankingUser(raw);
    }

    return UserProfileMapper.mapProfile(raw);
  }

  // Domain-specific entry points
  static mapRankingUser(raw: any) { return UserRankingMapper.mapRankingUser(raw); }
  static mapProfile(raw: any) { return UserProfileMapper.mapProfile(raw); }
  static mapSocialUser(raw: any) { return UserSocialMapper.mapSocialUser(raw); }
  static mapSocialList(raw: any[], v?: boolean) { return UserSocialMapper.mapSocialList(raw, v); }
}
