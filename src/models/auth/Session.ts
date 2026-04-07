import { User } from './User';
import { CartItem } from '../shop/CartItem';
import { Chat } from '../social/Chat';
import { Notification } from '../social/Notification';

export class Session {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null; // Timestamp
  cart: CartItem[];
  myArticles: any[];
  chatList: Chat[];
  notifications: Notification[];

  constructor(data: Partial<Session>) {
    this.user = data.user || null;
    this.token = data.token || null;
    this.refreshToken = data.refreshToken || null;
    this.expiresAt = data.expiresAt || null;
    this.cart = data.cart || [];
    this.myArticles = data.myArticles || [];
    this.chatList = data.chatList || [];
    this.notifications = data.notifications || [];
  }

  /**
   * Checks if the session is still valid based on the expiration timestamp.
   */
  isValid(): boolean {
    if (!this.token || !this.expiresAt) return false;
    return Date.now() < this.expiresAt;
  }

  /**
   * Static factory for creating a Session instance from a JSON object.
   */
  static fromJSON(json: any): Session {
    return new Session({
      user: json.user ? User.fromJSON(json.user) : null,
      token: json.token || json.jwt_token || null,
      refreshToken: json.refreshToken || json.refresh_token || null,
      expiresAt: json.expiresAt || json.expires_at || (Date.now() + 3600 * 1000), // Default 1 hour
      cart: Array.isArray(json.cart) ? json.cart.map((i: any) => CartItem.fromJSON(i)) : [],
      myArticles: json.myArticles || [],
      chatList: Array.isArray(json.chatList) ? json.chatList.map((c: any) => Chat.fromJSON(c)) : [],
      notifications: Array.isArray(json.notifications) ? json.notifications.map((n: any) => Notification.fromJSON(n)) : [],
    });
  }
}
