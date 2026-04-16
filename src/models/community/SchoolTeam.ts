import { BaseModel } from '../BaseModel';
import { User } from '../auth/User';

/**
 * Type of School Team (Traditional Sports or E-sports).
 */
export type TeamType = 'ESPORTS' | 'TRADITIONAL_SPORTS';

/**
 * Represents a School Team (Okul Takımı) for specific games or sports.
 */
export class SchoolTeam extends BaseModel {
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
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a SchoolTeam object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): SchoolTeam {
    if (BaseModel.usePreviousApi) {
      return SchoolTeam.legacyFromJSON(json);
    }
    return SchoolTeam.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): SchoolTeam {
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

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): SchoolTeam {
    return new SchoolTeam({});
  }
}
