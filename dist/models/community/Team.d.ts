/**
 * Represents a Sports Team (Takım) in the aramizdakioyuncu.com platform.
 */
export declare class Team {
    id: string;
    name: string;
    logo: string;
    primaryColor: string;
    shortName: string;
    constructor(data: Partial<Team>);
    static fromJSON(json: any): Team;
}
