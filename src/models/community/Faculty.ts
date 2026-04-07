import { User } from '../auth/User';

/**
 * Represents a Faculty (Fakülte) within a School.
 */
export class Faculty {
  id: string = '';
  name: string = '';
  schoolId: string = '';
  representative: User | null = null;
  memberCount: number = 0;

  constructor(data: Partial<Faculty>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a Faculty object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): Faculty {
    return new Faculty({
      id: json.id || '',
      name: json.name || '',
      schoolId: json.schoolId || '',
      representative: json.representative ? User.fromJSON(json.representative) : null,
      memberCount: json.memberCount || 0
    });
  }
}
