import { User } from '../auth/User';
/**
 * Represents a Group/Community/Guild in the aramizdakioyuncu.com platform.
 */
export declare class Group {
    id: string;
    name: string;
    shortName: string;
    slug: string;
    description: string;
    avatar: string;
    logo: string;
    banner: string;
    coverImage: string;
    memberCount: number;
    isPrivate: boolean;
    category: string;
    tag: string;
    recruitment: string;
    date: string;
    owner: User | null;
    moderators: User[];
    members: User[];
    permissions: string[];
    constructor(data: Partial<Group>);
    /**
     * Instantiates a Group object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): Group;
}
