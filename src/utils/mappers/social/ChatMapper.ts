import { ChatResponse, ChatMessageResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Chat and Messaging related data structures.
 * Version-aware structure: Entry point delegates to specific version mappers.
 */
export class ChatMapper extends BaseMapper {
  static mapChat(raw: any): ChatResponse {
    const legacy = this.shouldReturnRaw<ChatResponse>(raw);
    if (legacy) return legacy;
    if (!raw) return {} as ChatResponse;

    return {
      id: this.toNumber(raw.kullid),
      username: raw.kulladi || '',
      displayName: raw.adisoyadi || '',
      lastMessage: raw.sonmesaj || '',
      lastLogin: raw.songiris,
      unreadCount: this.toNumber(raw.bildirim),
      type: raw.sohbetturu === 'grup' ? 'grup' : 'ozel',
      avatar: this.toImageUrl(raw.chatImage?.media_URL || raw.chatImage?.media_minURL) || ''
    };
  }

  static mapChatList(rawList: any[]): ChatResponse[] {
    return (rawList || []).map(item => this.mapChat(item));
  }

  static mapMessage(raw: any): ChatMessageResponse {
    const legacy = this.shouldReturnRaw<ChatMessageResponse>(raw);
    if (legacy) return legacy;
    if (!raw) return {} as ChatMessageResponse;

    return {
      side: raw.sohbetkim === 'ben' ? 'ben' : 'sen',
      authorName: raw.adsoyad || '',
      authorAvatar: this.toImageUrl(raw.avatar) || '',
      authorColor: raw.renkkodu,
      content: raw.mesajicerik || '',
      date: raw.zaman || '',
      dateLabel: raw.zamantarih || '',
      timeLabel: raw.zamansaat || '',
      status: this.toNumber(raw.durum)
    };
  }

  static mapMessageList(rawList: any[]): ChatMessageResponse[] {
    return (rawList || []).map(item => this.mapMessage(item));
  }
}
