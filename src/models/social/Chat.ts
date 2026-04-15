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
    const resolveKey = (keys: string[]): any => {
      const foundKey = Object.keys(json).find(k => keys.includes(k.toLowerCase()));
      return foundKey ? json[foundKey] : undefined;
    };

    const id = resolveKey(['id', 'id_user', 'user_id', 'oyuncubakid', 'oyuncuid', 'arkadasid', 'id_arkadas', 'groupid', 'grupid', 'sohbetid']);
    const name = resolveKey(['name', 'displayname', 'user_displayname', 'oyuncuad', 'grupad', 'username', 'title', 'ad', 'adisoyadi']);
    const avatarRaw = resolveKey(['avatar', 'oyuncuminnakavatar', 'grup_minnakavatar', 'logo', 'foto', 'profil_fotosu']);
    const lastMsgRaw = resolveKey(['lastmessage', 'last_message', 'sonmesaj', 'son_mesaj']);
    const time = resolveKey(['time', 'zaman', 'tarih', 'last_message_time', 'guncelletarih', 'songorusme']);
    const unread = resolveKey(['unreadcount', 'unread_count', 'okunmamissayi', 'okunmamis_sayi', 'bildirim_sayi']);
    const onlineRaw = resolveKey(['isonline', 'is_online', 'oyuncu_online', 'durum']);
    const lastSeen = resolveKey(['lastseen', 'last_seen', 'songorulme', 'son_gorulme']);
    const isGroupRaw = resolveKey(['isgroup', 'is_group', 'is_clube', 'groupid', 'grupid']);

    return new Chat({
      id: String(id || ''),
      participants: Array.isArray(json.participants) ? json.participants.map((p: Record<string, any>) => User.fromJSON(p)) : [],
      name: name || '',
      avatar: typeof avatarRaw === 'string' ? avatarRaw : (avatarRaw?.media_URL || avatarRaw?.fotourl || ''),
      lastMessage: lastMsgRaw ? ChatMessage.fromJSON(lastMsgRaw) : null,
      time: time || '',
      unreadCount: Number(unread || 0),
      isOnline: onlineRaw === 1 || onlineRaw === true,
      lastSeen: lastSeen || '',
      updatedAt: json.updatedAt || json.updated_at || Date.now(),
      isGroup: !!isGroupRaw,
      isFavorite: !!json.isFavorite || !!json.is_favorite,
      messages: Array.isArray(json.messages) ? json.messages.map((m: any) => ChatMessage.fromJSON(m)) : (Array.isArray(json.liste) ? json.liste.map((m: any) => ChatMessage.fromJSON(m)) : []),
    });
  }
}
