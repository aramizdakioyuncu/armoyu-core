import { User } from '../auth/User';

/**
 * Represents a single message in a Chat.
 */
export class ChatMessage {
  id: string = '';
  sender: User | null = null;
  content: string = '';
  timestamp: string = '';
  isSystem: boolean = false;

  constructor(data: Partial<ChatMessage>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a ChatMessage object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): ChatMessage {
    const resolveKey = (keys: string[]): any => {
      const foundKey = Object.keys(json).find(k => keys.includes(k.toLowerCase()));
      return foundKey ? json[foundKey] : undefined;
    };

    const id = resolveKey(['id', 'sohbetid', 'mesajid', 'id_sohbet', 'id_mesaj']);
    const senderRaw = resolveKey(['sender', 'sender_name', 'gonderen_ad', 'oyuncu_ad', 'gonderen', 'adsoyad']);
    const content = resolveKey(['content', 'text', 'icerik', 'mesaj', 'text_message', 'message', 'mesajicerik']);
    const timestamp = resolveKey(['timestamp', 'time', 'zaman', 'tarih', 'sent_at', 'paylasimzaman']);
    const isSystemRaw = resolveKey(['issystem', 'is_system', 'system_message', 'sistem']);
    const sohbetKim = resolveKey(['sohbetkim']);

    const message = new ChatMessage({
      id: String(id || ''),
      sender: json.sender ? User.fromJSON(json.sender) : (senderRaw ? new User({ displayName: String(senderRaw) }) : null),
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
}
