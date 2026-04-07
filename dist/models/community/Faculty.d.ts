import { User } from '../auth/User';
/**
 * Represents a Faculty (Fakülte) within a School.
 */
export declare class Faculty {
    id: string;
    name: string;
    schoolId: string;
    representative: User | null;
    memberCount: number;
    constructor(data: Partial<Faculty>);
    /**
     * Instantiates a Faculty object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): Faculty;
}
