/**
 * Represents a Workplace (İşyeri/Ofis) in the aramizdakioyuncu.com platform.
 */
export declare class Workplace {
    id: string;
    name: string;
    description: string;
    location: string;
    logo: string;
    website: string;
    establishedDate: string;
    constructor(data: Partial<Workplace>);
    /**
     * Instantiates a Workplace object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): Workplace;
}
