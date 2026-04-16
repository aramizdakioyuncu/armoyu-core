import { BaseModel } from '../../BaseModel';
import { User } from '../../auth/User';

/**
 * Represents a single message in a Chat.
 */
export class ChatMessage extends BaseModel {
  id: string = '';
  sender: User | null = null;
  content: string = '';
  timestamp: string = '';
  isSystem: boolean = false;

  constructor(data: Partial<ChatMessage>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a ChatMessage object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): ChatMessage {
    if (BaseModel.usePreviousApi) {
      return ChatMessage.legacyFromJSON(json);
    }
    return ChatMessage.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): ChatMessage {
    const resolveKey = (keys: string[]): any => {
      const foundKey = Object.keys(json).find(k => keys.includes(k.toLowerCase()));
      return foundKey ? json[foundKey] : undefined;
    };

    const id = resolveKey(['id', 'sohbetid', 'mesajid', 'id_sohbet', 'id_mesaj']);
    const senderRaw = resolveKey(['sender', 'sender_name', 'gonderen_ad', 'oyuncu_ad', 'gonderen', 'adsoyad', 'kulladi', 'adisoyadi']);
    const content = resolveKey(['content', 'text', 'icerik', 'mesaj', 'text_message', 'message', 'mesajicerik']);
    const timestamp = resolveKey(['timestamp', 'time', 'zaman', 'tarih', 'sent_at', 'paylasimzaman']);
    const isSystemRaw = resolveKey(['issystem', 'is_system', 'system_message', 'sistem']);
    const sohbetKim = resolveKey(['sohbetkim']);

    // Enhanced sender hydration for ChatMessage
    let sender: User | null = null;
    if (json.sender && typeof json.sender === 'object') {
      sender = User.fromJSON(json.sender);
    } else if (senderRaw) {
      // Create user with both name and username if possible to fix isSelf detection
      sender = User.fromJSON({ 
        displayname: String(senderRaw),
        username: String(resolveKey(['kulladi', 'username', 'oyuncukullaniciadi']) || senderRaw),
        avatar: resolveKey(['avatar', 'chatimage', 'image', 'oyuncu_avatar', 'oyuncuminnakavatar', 'player_avatar', 'arkadasfoto', 'oyuncufoto', 'foto'])
      });
    }

    const message = new ChatMessage({
      id: String(id || ''),
      sender: sender,
      content: String(content || ''),
      timestamp: String(timestamp || ''),
      isSystem: isSystemRaw === 1 || isSystemRaw === true || false,
    });

    // Handle "sen" / "ben" logic from sohbetkim if needed
    if (sohbetKim === 'sen' && message.sender) {
      // In this context, "sen" in the API response usually means the current user
    }

    return message;
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): ChatMessage {
    return new ChatMessage({});
  }
}
