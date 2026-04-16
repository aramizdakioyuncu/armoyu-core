import { BaseModel } from '../../BaseModel';
import { User } from '../../auth/User';

/**
 * Represents a User that has been blocked.
 */
export class BlockedUser extends BaseModel {
  user: User | null = null;
  blockedAt: string = '';
  reason?: string;

  constructor(data: Partial<BlockedUser>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a BlockedUser object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): BlockedUser {
    if (BaseModel.usePreviousApi) {
      return BlockedUser.legacyFromJSON(json);
    }
    return BlockedUser.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): BlockedUser {
    return new BlockedUser({
      user: json.user ? User.fromJSON(json.user) : (json.oyuncu ? User.fromJSON(json.oyuncu) : null),
      blockedAt: json.blockedAt || json.tarih || '',
      reason: json.reason || json.sebep || ''
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): BlockedUser {
    return new BlockedUser({});
  }
}
