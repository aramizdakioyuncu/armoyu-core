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
      id: json.id || '',
      sender: json.sender ? User.fromJSON(json.sender) : (json.sender_name ? new User({ displayName: json.sender_name }) : null),
      content: json.content || json.text || '',
      timestamp: json.timestamp || json.time || '',
      isSystem: json.isSystem || json.is_system || false,
    });
  }
}
