import { UserResponse } from '../auth/UserResponse';

export type TeamType = 'ESPORTS' | 'TRADITIONAL_SPORTS';

export interface SchoolTeamResponse {
  id?: string | number;
  name?: string;
  gameOrSport?: string;
  type?: TeamType;
  logo?: string;
  schoolId?: string | number;
  captain?: UserResponse;
  coach?: UserResponse;
  members?: UserResponse[];
  memberCount?: number;
  achievements?: string[];
}
