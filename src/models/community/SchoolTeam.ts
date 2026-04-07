import { User } from '../auth/User';

/**
 * Type of School Team (Traditional Sports or E-sports).
 */
export type TeamType = 'ESPORTS' | 'TRADITIONAL_SPORTS';

/**
 * Represents a School Team (Okul Takımı) for specific games or sports.
 */
export class SchoolTeam {
  id: string = '';
  name: string = ''; // e.g., "UAV FB", "ARMOYU CS2"
  gameOrSport: string = ''; // e.g., "Football", "Volleyball", "Counter-Strike 2"
  type: TeamType = 'ESPORTS';
  logo?: string = '';
  
  schoolId: string = '';
  captain: User | null = null;
  coach: User | null = null;
  members: User[] = [];
  memberCount: number = 0;
  
  achievements: string[] = [];

  constructor(data: Partial<SchoolTeam>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a SchoolTeam object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): SchoolTeam {
    return new SchoolTeam({
      id: json.id || '',
      name: json.name || '',
      gameOrSport: json.gameOrSport || json.game_or_sport || '',
      type: (json.type as TeamType) || 'ESPORTS',
      logo: json.logo || '',
      schoolId: json.schoolId || '',
      captain: json.captain ? User.fromJSON(json.captain) : null,
      coach: json.coach ? User.fromJSON(json.coach) : null,
      members: Array.isArray(json.members) ? json.members.map(User.fromJSON) : [],
      memberCount: json.memberCount || 0,
      achievements: json.achievements || []
    });
  }
}
