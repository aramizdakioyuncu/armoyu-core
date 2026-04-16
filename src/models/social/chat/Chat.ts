import { BaseModel } from '../../BaseModel';
import { User } from '../../auth/User';
import { ChatMessage } from './Message';

/**
 * Represents a Chat conversation or summary.
 */
export class Chat extends BaseModel {
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
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a Chat object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): Chat {
    if (BaseModel.usePreviousApi) {
      return Chat.legacyFromJSON(json);
    }
    return Chat.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): Chat {
    const resolveKey = (keys: string[]): any => {
      const foundKey = Object.keys(json).find(k => keys.includes(k.toLowerCase()));
      return foundKey ? json[foundKey] : undefined;
    };

    // Priority for IDs: Prefer usernames for private chats to maintain UI consistency
    const id = resolveKey(['kulladi', 'username', 'oyuncukullaniciadi', 'id', 'id_user', 'user_id', 'oyuncubakid', 'oyuncuid', 'arkadasid', 'id_arkadas', 'groupid', 'grupid', 'sohbetid', 'kullid']);
    const name = resolveKey(['name', 'displayname', 'user_displayname', 'oyuncuad', 'grupad', 'username', 'title', 'ad', 'adisoyadi', 'kulladi']);
    
    // Aggressive avatar search including 'chatImage'
    let avatarRaw = resolveKey(['avatar', 'chatimage', 'image', 'oyuncu_avatar', 'oyuncuminnakavatar', 'player_avatar', 'arkadasfoto', 'oyuncufoto', 'oyuncuresim', 'profil_fotosu', 'logo', 'foto', 'resim', 'grup_minnakavatar', 'avatar_url']);
    
    // Heuristic: If no direct key found, try finding any key containing photo-related terms
    if (!avatarRaw) {
      const heuristicKey = Object.keys(json).find(k => {
        const lowerK = k.toLowerCase();
        return lowerK.includes('avatar') || lowerK.includes('foto') || lowerK.includes('resim') || lowerK.includes('image');
      });
      if (heuristicKey) avatarRaw = json[heuristicKey];
    }

    // Special nested check (json.oyuncu.avatar or json.arkadas.avatar)
    const nestedObj = json.oyuncu || json.arkadas || json.owner || json.user;
    if (!avatarRaw && nestedObj && typeof nestedObj === 'object') {
       const nestedUser = User.fromJSON(nestedObj);
       if (nestedUser.avatar) avatarRaw = nestedUser.avatar;
    }

    const lastMsgRaw = resolveKey(['lastmessage', 'last_message', 'sonmesaj', 'son_mesaj']);
    const time = resolveKey(['time', 'zaman', 'tarih', 'last_message_time', 'guncelletarih', 'songorusme', 'songiris']);
    const unread = resolveKey(['unreadcount', 'unread_count', 'okunmamissayi', 'okunmamis_sayi', 'bildirim_sayi', 'bildirim']);
    const onlineRaw = resolveKey(['isonline', 'is_online', 'oyuncu_online', 'durum']);
    const lastSeen = resolveKey(['lastseen', 'last_seen', 'songorulme', 'son_gorulme']);
    const isGroupRaw = resolveKey(['isgroup', 'is_group', 'is_clube', 'groupid', 'grupid']);

    return new Chat({
      id: String(id || ''),
      participants: Array.isArray(json.participants) ? json.participants.map((p: Record<string, any>) => User.fromJSON(p)) : [],
      name: name || '',
      avatar: typeof avatarRaw === 'string' ? avatarRaw : (avatarRaw?.media_URL || avatarRaw?.media_minURL || avatarRaw?.media_bigURL || avatarRaw?.fotourl || avatarRaw?.url || ''),
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

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): Chat {
    return new Chat({});
  }
}
