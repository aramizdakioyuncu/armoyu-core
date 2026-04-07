/**
 * Represents a Media item (Fotoğraf/Video) in the aramizdakioyuncu.com platform.
 */
export declare class Media {
    title: string;
    count: number;
    author: string;
    date: string;
    category: string;
    image: string;
    constructor(data: Partial<Media>);
    /**
     * Instantiates a Media object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): Media;
}
