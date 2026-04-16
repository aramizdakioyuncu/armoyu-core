import { BaseModel } from '../BaseModel';

/**
 * Represents a Badge or Achievement earned by a user.
 */
export class UserBadge extends BaseModel {
  id: string = '';
  name: string = '';
  description: string = '';
  icon: string = '';
  color: string = '';
  earnedAt?: string = '';

  constructor(data: Partial<UserBadge>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a UserBadge object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): UserBadge {
    if (BaseModel.usePreviousApi) {
      return UserBadge.legacyFromJSON(json);
    }
    return UserBadge.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): UserBadge {
    return new UserBadge({
      id: String(json.id || json.rozet_id || ''),
      name: json.name || json.rozet_ad || json.title || '',
      description: json.description || json.rozet_aciklama || '',
      icon: json.icon || json.rozet_icon || json.image_url || '',
      color: json.color || json.rozet_renk || '#808080',
      earnedAt: json.earnedAt || json.kazanma_tarihi || json.date || ''
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): UserBadge {
    return new UserBadge({});
  }
}

/**
 * Helper to handle badge data structures (Legacy Compatibility).
 */
export const mapBadgeFromJSON = (json: any): UserBadge => {
  return UserBadge.fromJSON(json);
};
