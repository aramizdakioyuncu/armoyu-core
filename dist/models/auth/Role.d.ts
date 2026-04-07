/**
 * Represents a User Role in the aramizdakioyuncu.com platform.
 */
export declare class Role {
    id: string;
    name: string;
    color: string;
    permissions: string[];
    constructor(data: Partial<Role>);
    /**
     * Instantiates a Role object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): Role;
}
