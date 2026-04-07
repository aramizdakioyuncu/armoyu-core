import { User } from '../auth/User';
import { ChatMessage } from './ChatMessage';
/**
 * Represents a Chat conversation or summary.
 */
export declare class Chat {
    id: string;
    participants: User[];
    name: string;
    avatar: string;
    lastMessage: ChatMessage | null;
    time: string;
    unreadCount: number;
    isOnline: boolean;
    lastSeen: string;
    updatedAt: number;
    isGroup: boolean;
    isFavorite: boolean;
    messages: ChatMessage[];
    constructor(data: Partial<Chat>);
    /**
     * Instantiates a Chat object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): Chat;
}
