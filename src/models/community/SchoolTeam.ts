import { User } from '../auth/User';

export type TeamType = 'ESPORTS' | 'TRADITIONAL_SPORTS';

export interface SchoolTeam {
  id?: string | number;
  name?: string;
  gameOrSport?: string;
  type?: TeamType;
  logo?: string;
  schoolId?: string | number;
  captain?: User;
  coach?: User;
  members?: User[];
  memberCount?: number;
  achievements?: string[];
}



