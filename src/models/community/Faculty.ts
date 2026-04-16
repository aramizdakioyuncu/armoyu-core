import { BaseModel } from '../BaseModel';
import { User } from '../auth/User';

/**
 * Represents a Faculty (Fakülte) within a School.
 */
export class Faculty extends BaseModel {
  id: string = '';
  name: string = '';
  schoolId: string = '';
  representative: User | null = null;
  memberCount: number = 0;

  constructor(data: Partial<Faculty>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a Faculty object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): Faculty {
    if (BaseModel.usePreviousApi) {
      return Faculty.legacyFromJSON(json);
    }
    return Faculty.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): Faculty {
    return new Faculty({
      id: json.id || '',
      name: json.name || '',
      schoolId: json.schoolId || '',
      representative: json.representative ? User.fromJSON(json.representative) : null,
      memberCount: json.memberCount || 0
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): Faculty {
    return new Faculty({});
  }
}
