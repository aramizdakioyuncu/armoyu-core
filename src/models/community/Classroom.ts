import { BaseModel } from '../BaseModel';
import { User } from '../auth/User';

/**
 * Represents a Classroom (Sınıf) in the ARMOYU education ecosystem.
 */
export class Classroom extends BaseModel {
  id: string = '';
  name: string = '';
  password?: string = '';
  schoolId: string = '';
  members: User[] = [];
  teacher: User | null = null;
  memberCount: number = 0;

  constructor(data: Partial<Classroom>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a Classroom object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): Classroom {
    if (BaseModel.usePreviousApi) {
      return Classroom.legacyFromJSON(json);
    }
    return Classroom.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): Classroom {
    return new Classroom({
      id: json.id || '',
      name: json.name || '',
      password: json.password || '',
      schoolId: json.schoolId || '',
      members: Array.isArray(json.members) ? json.members.map(User.fromJSON) : [],
      teacher: json.teacher ? User.fromJSON(json.teacher) : null,
      memberCount: json.memberCount || 0
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): Classroom {
    return new Classroom({});
  }
}
