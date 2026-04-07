import { User } from '../auth/User';
import { ChatMessage } from './ChatMessage';

/**
 * Represents a Chat conversation or summary.
 */
export class Chat {
  id: string = '';
  participants: User[] = [];
  name: string = '';
  avatar: string = '';
  lastMessage: ChatMessage | null = null;
  time: string = '';
  unreadCount: number = 0;
  isOnline: boolean = false;
  lastSeen: string = '';
  updatedAt: number = 0;
  isGroup: boolean = false;
  isFavorite: boolean = false;
  messages: ChatMessage[] = [];

  constructor(data: Partial<Chat>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a Chat object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): Chat {
    return new Chat({
      id: json.id || '',
      participants: Array.isArray(json.participants) ? json.participants.map((p: Record<string, any>) => User.fromJSON(p)) : [],
      name: json.name || '',
      avatar: json.avatar || '',
      lastMessage: json.lastMessage ? ChatMessage.fromJSON(json.lastMessage) : (json.last_message ? ChatMessage.fromJSON(json.last_message) : null),
      time: json.time || '',
      unreadCount: json.unreadCount || json.unread_count || 0,
      isOnline: json.isOnline || json.is_online || false,
      lastSeen: json.lastSeen || json.last_seen || '',
      updatedAt: json.updatedAt || json.updated_at || 0,
      isGroup: json.isGroup || json.is_group || false,
      isFavorite: json.isFavorite || json.is_favorite || false,
      messages: Array.isArray(json.messages) ? json.messages.map((m: any) => ChatMessage.fromJSON(m)) : [],
    });
  }
}
