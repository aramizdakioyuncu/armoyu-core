import { BaseModel } from '../BaseModel';

/**
 * Represents an application to join the official team.
 */
export class StaffApplication extends BaseModel {
  id: number = 0;
  userId: number = 0;
  userDisplayName: string = '';
  userAvatar: string = '';
  positionId: number = 0;
  positionDepartment: string = '';
  positionName: string = '';
  date: string = '';
  status: number = 0;

  constructor(data: Partial<StaffApplication>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a StaffApplication object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): StaffApplication {
    if (BaseModel.usePreviousApi) {
      return StaffApplication.legacyFromJSON(json);
    }
    return StaffApplication.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): StaffApplication {
    return new StaffApplication({
      id: Number(json.application_ID || 0),
      userId: Number(json.sapplication_user?.player_ID || 0),
      userDisplayName: json.sapplication_user?.player_displayname || '',
      userAvatar: json.sapplication_user?.player_avatar?.media_URL || '',
      positionId: Number(json.sapplication_position?.position_ID || 0),
      positionDepartment: json.sapplication_position?.position_department || '',
      positionName: json.sapplication_position?.position_name || '',
      date: json.sapplication_date || '',
      status: Number(json.sapplication_status || 0)
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): StaffApplication {
    return new StaffApplication({});
  }
}
