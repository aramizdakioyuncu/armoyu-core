import { User } from './User';
import { CartItem } from '../shop/CartItem';
import { Chat } from '../social/Chat';
import { Notification } from '../social/Notification';
export declare class Session {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    expiresAt: number | null;
    cart: CartItem[];
    myArticles: any[];
    chatList: Chat[];
    notifications: Notification[];
    constructor(data: Partial<Session>);
    /**
     * Checks if the session is still valid based on the expiration timestamp.
     */
    isValid(): boolean;
    /**
     * Static factory for creating a Session instance from a JSON object.
     */
    static fromJSON(json: any): Session;
}
