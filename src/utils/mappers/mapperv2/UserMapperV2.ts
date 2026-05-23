import { User, UserProfileDTO } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for User related V2 REST API responses.
 */
export class UserMapperV2 extends BaseMapper {
  /**
   * Maps V2 User response to User model.
   */
  static mapProfile(raw: any): User {
    const legacy = this.shouldReturnRaw<User>(raw);
    if (legacy) return legacy;

    if (!raw) return new User({} as any);

    const dto: UserProfileDTO = {
      id: this.toNumber(raw.id || raw.ID),
      username: raw.user_login || raw.username || '',
      displayName: raw.display_name || '',
      avatar: this.toImageUrl(raw.avatar || raw.ufakavatar),
      banner: this.toImageUrl(raw.arkaresim),
      level: this.toNumber(raw.seviye),
      levelXP: '0',
      points: this.toNumber(raw.bakiye || raw.populerlik),
      socials: {},
      stats: {
        friendsCount: 0,
        postsCount: 0,
        commentsCount: 0,
        groupsCount: 0,
        gamesCount: 0
      },
      rank: {},
      popularGames: []
    };

    return new User(dto);
  }
}
