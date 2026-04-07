import { User } from '../auth/User';
/**
 * Represents a single message in a Chat.
 */
export declare class ChatMessage {
    id: string;
    sender: User | null;
    content: string;
    timestamp: string;
    isSystem: boolean;
    constructor(data: Partial<ChatMessage>);
    /**
     * Instantiates a ChatMessage object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): ChatMessage;
}
