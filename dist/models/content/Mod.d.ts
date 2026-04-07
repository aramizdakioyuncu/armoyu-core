import { User } from '../auth/User';
/**
 * Represents a Game Mod (Oyun Modu) in the aramizdakioyuncu.com platform.
 */
export declare class Mod {
    id: string;
    name: string;
    game: string;
    version: string;
    author: User | null;
    description: string;
    downloads: string;
    image: string;
    isFeatured: boolean;
    constructor(data: Partial<Mod>);
    /**
     * Instantiates a Mod object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): Mod;
}
