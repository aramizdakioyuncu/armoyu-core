import { ConversationDTO } from '../../dto/social/ChatDTO';

export class Conversation implements ConversationDTO {
  id: number;
  username: string;
  displayName: string;
  lastMessage: string;
  lastLogin?: string;
  unreadCount: number;
  type: 'ozel' | 'grup';
  avatar: string;

  constructor(data: ConversationDTO) {
    this.id = data.id;
    this.username = data.username;
    this.displayName = data.displayName;
    this.lastMessage = data.lastMessage;
    this.lastLogin = data.lastLogin;
    this.unreadCount = data.unreadCount;
    this.type = data.type;
    this.avatar = data.avatar;
  }

  /**
   * Returns true if there are unread messages in this conversation.
   */
  get hasUnread(): boolean {
    return this.unreadCount > 0;
  }

  /**
   * Returns a clean URL for the chat conversation.
   */
  get chatUrl(): string {
    return `/mesajlar/${this.username}`;
  }

  /**
   * Returns true if the conversation is a group chat.
   */
  get isGroup(): boolean {
    return this.type === 'grup';
  }

  /**
   * Factory method to create a Conversation from a DTO.
   */
  static fromJSON(data: ConversationDTO): Conversation {
    return new Conversation(data);
  }

  /**
   * Converts the entity back to a DTO for API submission.
   */
  toJSON(): ConversationDTO {
    return {
      id: this.id,
      username: this.username,
      displayName: this.displayName,
      lastMessage: this.lastMessage,
      lastLogin: this.lastLogin,
      unreadCount: this.unreadCount,
      type: this.type,
      avatar: this.avatar
    };
  }
}
