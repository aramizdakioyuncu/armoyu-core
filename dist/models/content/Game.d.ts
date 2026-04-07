/**
 * Represents a Game in the aramizdakioyuncu.com platform.
 */
export declare class Game {
    id: string;
    name: string;
    slug: string;
    logo: string;
    poster: string;
    category: string;
    developer: string;
    description: string;
    constructor(data: Partial<Game>);
    /**
     * Instantiates a Game object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): Game;
}
