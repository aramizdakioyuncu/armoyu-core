import { ConversationDTO, MessageDTO, Conversation, Message } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Chat and Messaging.
 * Specialized for each endpoint.
 */
export class ChatMapper extends BaseMapper {
  /**
   * Specialized for Chat List (/0/0/sohbet/0/0/).
   */
  static mapChatItem(raw: any): Conversation {
    if (!raw) return new Conversation({} as ConversationDTO);

    return new Conversation({
      id: this.toNumber(raw.kullid),
      username: raw.kulladi || '',
      displayName: raw.adisoyadi || '',
      lastMessage: raw.sonmesaj || '',
      lastLogin: raw.songiris,
      unreadCount: this.toNumber(raw.bildirim),
      type: raw.sohbetturu === 'grup' ? 'grup' : 'ozel',
      avatar: this.toImageUrl(raw.chatImage?.media_URL || raw.chatImage?.media_minURL || raw.chatImage?.media_bigURL) || ''
    });
  }

  /**
   * Specialized for Chat Inbox (/0/0/sohbet/0/0/).
   */
  static mapInboxList(rawList: any[]): Conversation[] {
    return (rawList || []).map(item => this.mapChatItem(item));
  }

  /**
   * Specialized for Friends List (/0/0/sohbet/arkadaslarim/0/).
   */
  static mapFriendList(rawList: any[]): Conversation[] {
    return (rawList || []).map(item => this.mapChatItem(item));
  }

  /**
   * Specialized for Chat Message.
   */
  static mapMessageItem(raw: any): Message {
    if (!raw) return new Message({} as MessageDTO);

    return new Message({
      side: raw.sohbetkim === 'ben' ? 'ben' : 'sen',
      authorName: raw.adsoyad || '',
      authorAvatar: this.toImageUrl(raw.avatar) || '',
      authorColor: raw.renkkodu,
      content: raw.mesajicerik || '',
      date: raw.zaman || '',
      dateLabel: raw.zamantarih || '',
      timeLabel: raw.zamansaat || '',
      status: this.toNumber(raw.durum)
    });
  }

  /**
   * Specialized for Chat History.
   */
  static mapHistoryList(rawList: any[]): Message[] {
    return (rawList || []).map(item => this.mapMessageItem(item));
  }

  /**
   * Specialized for Chat Detail (/0/0/sohbetdetay/0/0/).
   */
  static mapDetailList(rawList: any[]): Message[] {
    return (rawList || []).map(item => this.mapMessageItem(item));
  }
}
