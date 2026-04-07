import { User } from '../auth/User';
/**
 * Represents a Classroom (Sınıf) in the ARMOYU education ecosystem.
 */
export declare class Classroom {
    id: string;
    name: string;
    password?: string;
    schoolId: string;
    members: User[];
    teacher: User | null;
    memberCount: number;
    constructor(data: Partial<Classroom>);
    /**
     * Instantiates a Classroom object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): Classroom;
}
