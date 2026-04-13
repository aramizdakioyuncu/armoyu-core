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
    return new ChatMessage({
      id: String(json.id || json.sohbetID || json.mesajID || json.id_sohbet || ''),
      sender: json.sender ? User.fromJSON(json.sender) : (json.sender_name || json.gonderen_ad || json.oyuncu_ad ? new User({ displayName: json.sender_name || json.gonderen_ad || json.oyuncu_ad }) : null),
      content: json.content || json.text || json.icerik || json.mesaj || json.text_message || '',
      timestamp: json.timestamp || json.time || json.zaman || json.tarih || json.sent_at || '',
      isSystem: json.isSystem || json.is_system || json.system_message === 1 || false,
    });
  }
}
