import { User } from '../auth/User';
/**
 * Represents a "Note" (Instagram-style status bubble) in the aramizdakioyuncu.com platform.
 */
export declare class Note {
    id: string;
    user: User | null;
    note: string;
    isMe: boolean;
    constructor(data: Partial<Note>);
    /**
     * Instantiates a Note object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): Note;
}
