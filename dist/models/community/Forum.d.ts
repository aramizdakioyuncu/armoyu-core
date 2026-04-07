/**
 * Represents a Forum Board (Forum Bölümü) in the aramizdakioyuncu.com platform.
 */
export declare class Forum {
    id: string;
    name: string;
    desc: string;
    topicCount: number;
    postCount: number;
    lastPost?: {
        topicTitle: string;
        author: string;
        avatar: string;
        time: string;
    };
    constructor(data: Partial<Forum>);
    /**
     * Returns the absolute URL to the forum board.
     */
    getUrl(): string;
    /**
     * Instantiates a Forum object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): Forum;
}
