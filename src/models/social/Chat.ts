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
      id: String(json.id || json.id_user || json.user_id || json.arkadasID || json.oyuncubakid || json.oyuncuID || json.groupID || json.grupID || ''),
      participants: Array.isArray(json.participants) ? json.participants.map((p: Record<string, any>) => User.fromJSON(p)) : [],
      name: json.name || json.displayname || json.displayName || json.user_displayname || json.oyuncuad || json.grupad || json.username || json.title || '',
      avatar: typeof json.avatar === 'string' ? json.avatar : (json.avatar?.media_URL || json.oyuncuminnakavatar || json.grup_minnakavatar || json.logo || json.avatar || ''),
      lastMessage: json.lastMessage ? ChatMessage.fromJSON(json.lastMessage) : (json.last_message ? ChatMessage.fromJSON(json.last_message) : null),
      time: json.time || json.zaman || json.tarih || json.last_message_time || '',
      unreadCount: json.unreadCount || json.unread_count || json.okunmamis_sayi || 0,
      isOnline: json.isOnline || json.is_online || json.oyuncu_online === 1 || false,
      lastSeen: json.lastSeen || json.last_seen || json.son_gorulme || '',
      updatedAt: json.updatedAt || json.updated_at || 0,
      isGroup: json.isGroup || json.is_group || json.grupID !== undefined || false,
      isFavorite: json.isFavorite || json.is_favorite || false,
      messages: Array.isArray(json.messages) ? json.messages.map((m: any) => ChatMessage.fromJSON(m)) : (Array.isArray(json.liste) ? json.liste.map((m: any) => ChatMessage.fromJSON(m)) : []),
    });
  }
}
