import { User } from '../auth/User';
import { Faculty } from './Faculty';
import { Classroom } from './Classroom';
import { SchoolTeam } from './SchoolTeam';
/**
 * Represents a School (Okul/Üniversite) in the ARMOYU education ecosystem.
 */
export declare class School {
    id: string;
    name: string;
    slug: string;
    logo: string;
    background?: string;
    description?: string;
    representative: User | null;
    faculties: Faculty[];
    teams: SchoolTeam[];
    classrooms: Classroom[];
    joinPassword?: string;
    isSocialFeedEnabled: boolean;
    memberCount: number;
    constructor(data: Partial<School>);
    /**
     * Instantiates a School object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): School;
}
