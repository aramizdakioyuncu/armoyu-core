/**
 * Represents a Sports Team (Takım) in the aramizdakioyuncu.com platform.
 */
export declare class Team {
    id: string;
    name: string;
    shortName: string;
    slug: string;
    logo: string;
    banner: string;
    primaryColor: string;
    category: string;
    description: string;
    foundedDate: string;
    website: string;
    constructor(data: Partial<Team>);
    static fromJSON(json: any): Team;
}
