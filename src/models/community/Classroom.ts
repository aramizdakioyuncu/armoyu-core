import { User } from '../auth/User';

/**
 * Represents a Classroom (Sınıf) in the ARMOYU education ecosystem.
 */
export class Classroom {
  id: string = '';
  name: string = '';
  password?: string = '';
  schoolId: string = '';
  members: User[] = [];
  teacher: User | null = null;
  memberCount: number = 0;

  constructor(data: Partial<Classroom>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a Classroom object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): Classroom {
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
}
