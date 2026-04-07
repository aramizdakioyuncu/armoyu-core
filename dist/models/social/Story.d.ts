import { User } from '../auth/User';
/**
 * Represents a Story in the aramizdakioyuncu.com platform.
 */
export declare class Story {
    id: string;
    user: User | null;
    media: string;
    hasUnseen: boolean;
    isMe: boolean;
    constructor(data: Partial<Story>);
    /**
     * Instantiates a Story object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): Story;
}
