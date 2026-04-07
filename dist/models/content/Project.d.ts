import { User } from '../auth/User';
import { Group } from '../community/Group';
export interface ProjectAuthor {
    user: User;
    role: string;
}
/**
 * Represents a Project in the aramizdakioyuncu.com platform.
 */
export declare class Project {
    id: string;
    name: string;
    description: string;
    status: string;
    image: string;
    url: string;
    githubUrl: string;
    authors: ProjectAuthor[];
    group: Group | null;
    techStack: string[];
    constructor(data: Partial<Project>);
    /**
     * Instantiates a Project object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): Project;
}
