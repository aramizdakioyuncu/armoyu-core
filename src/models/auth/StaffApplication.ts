/**
 * Represents an application to join the official team.
 */
export class StaffApplication {
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
    Object.assign(this, data);
  }

  /**
   * Instantiates a StaffApplication object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): StaffApplication {
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
}
