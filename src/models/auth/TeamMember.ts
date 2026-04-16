import { BaseModel } from '../BaseModel';

/**
 * Represents a member of the platform's official team (staff).
 */
export class TeamMember extends BaseModel {
  id: number = 0;
  displayName: string = '';
  avatar: string = '';
  social: Record<string, string> = {};
  roleId: number = 0;
  roleName: string = '';
  roleCategory: string = '';
  roleColor: string = '';

  constructor(data: Partial<TeamMember>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a TeamMember object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): TeamMember {
    if (BaseModel.usePreviousApi) {
      return TeamMember.legacyFromJSON(json);
    }
    return TeamMember.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): TeamMember {
    return new TeamMember({
      id: Number(json.player_ID || 0),
      displayName: json.player_name || '',
      avatar: json.player_avatar?.media_URL || '',
      social: json.player_social || {},
      roleId: Number(json.player_role?.roleID || 0),
      roleName: json.player_role?.roleName || '',
      roleCategory: json.player_role?.rolecategory || '',
      roleColor: json.player_role?.roleColor || ''
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): TeamMember {
    return new TeamMember({});
  }
}
