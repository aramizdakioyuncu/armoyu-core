import { User } from '../auth/User';
/**
 * Type of School Team (Traditional Sports or E-sports).
 */
export type TeamType = 'ESPORTS' | 'TRADITIONAL_SPORTS';
/**
 * Represents a School Team (Okul Takımı) for specific games or sports.
 */
export declare class SchoolTeam {
    id: string;
    name: string;
    gameOrSport: string;
    type: TeamType;
    logo?: string;
    schoolId: string;
    captain: User | null;
    coach: User | null;
    members: User[];
    memberCount: number;
    achievements: string[];
    constructor(data: Partial<SchoolTeam>);
    /**
     * Instantiates a SchoolTeam object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): SchoolTeam;
}
