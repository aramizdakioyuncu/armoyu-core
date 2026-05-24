import { Message, MessageDTO, MessageSide } from '../../models';
import { BaseMapper } from '../mappers/BaseMapper';

/**
 * Mapper for Chat V2 REST API responses.
 * Key difference from V1: sohbetkim is boolean (true = other party, false = me).
 */
export class ChatMapperV2 extends BaseMapper {
  /**
   * Maps a single V2 message item to a Message entity.
   * sohbetkim: true → 'sen' (other party), false → 'ben' (me)
   */
  static mapMessageItem(raw: any): Message {
    if (!raw) return new Message({} as MessageDTO);

    return new Message({
      side: raw.sohbetkim === true ? MessageSide.OTHER : MessageSide.ME,
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
   * Maps a list of V2 message items.
   */
  static mapMessageList(rawList: any[]): Message[] {
    return (rawList || []).map(item => this.mapMessageItem(item));
  }
}
