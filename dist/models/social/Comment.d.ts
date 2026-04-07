import { User } from '../auth/User';
/**
 * Represents a Comment (Yorum) in the aramizdakioyuncu.com platform.
 */
export declare class Comment {
    id: string;
    author: User | null;
    text: string;
    date: string;
    replies: Comment[];
    constructor(data: Partial<Comment>);
    /**
     * Adds a reply to the comment.
     */
    addReply(reply: Comment): void;
    /**
     * Instantiates a Comment object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): Comment;
}
