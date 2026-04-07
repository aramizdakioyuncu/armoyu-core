import { User } from '../auth/User';
import { Faculty } from './Faculty';
import { Classroom } from './Classroom';
import { SchoolTeam } from './SchoolTeam';

/**
 * Represents a School (Okul/Üniversite) in the ARMOYU education ecosystem.
 */
export class School {
  id: string = '';
  name: string = '';
  slug: string = '';
  logo: string = '';
  background?: string = '';
  description?: string = '';
  
  representative: User | null = null;
  faculties: Faculty[] = [];
  teams: SchoolTeam[] = [];
  classrooms: Classroom[] = [];
  
  joinPassword?: string = '';
  isSocialFeedEnabled: boolean = true;
  memberCount: number = 0;

  constructor(data: Partial<School>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a School object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): School {
    return new School({
      id: json.id || '',
      name: json.name || '',
      slug: json.slug || '',
      logo: json.logo || '',
      background: json.background || '',
      description: json.description || '',
      representative: json.representative ? User.fromJSON(json.representative) : null,
      faculties: Array.isArray(json.faculties) ? json.faculties.map(Faculty.fromJSON) : [],
      teams: Array.isArray(json.teams) ? json.teams.map(SchoolTeam.fromJSON) : [],
      classrooms: Array.isArray(json.classrooms) ? json.classrooms.map(Classroom.fromJSON) : [],
      joinPassword: json.joinPassword || '',
      isSocialFeedEnabled: json.isSocialFeedEnabled !== undefined ? json.isSocialFeedEnabled : true,
      memberCount: json.memberCount || 0
    });
  }
}
