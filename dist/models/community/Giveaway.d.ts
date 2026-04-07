/**
 * Represents a Giveaway (Çekiliş) in the aramizdakioyuncu.com platform.
 */
export declare class Giveaway {
    id: string;
    title: string;
    prize: string;
    status: 'active' | 'ended';
    participants: number;
    timeLeft: string;
    image: string;
    constructor(data: Partial<Giveaway>);
    /**
     * Returns true if the giveaway is currently active.
     */
    isActive(): boolean;
    /**
     * Instantiates a Giveaway object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): Giveaway;
}
