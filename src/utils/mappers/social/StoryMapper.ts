import { StoryResponse, StoryItemResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Stories (Hikaye) related API responses.
 * Strict mapping: Targeting exact legacy fields for V1.
 */
export class StoryMapper extends BaseMapper {
  static mapStory(raw: any): StoryResponse {
    const legacy = this.shouldReturnRaw<StoryResponse>(raw);
    if (legacy) return legacy;
    if (!raw) return {} as StoryResponse;

    const item = this.mapStoryItem(raw);

    return {
      authorId: item.ownerId || 0,
      authorName: item.authorName || '',
      authorUsername: item.authorName || '',
      authorAvatar: item.authorAvatar || '',
      storyCount: 1,
      items: [item]
    };
  }

  static mapStoryItem(raw: any): StoryItemResponse {
    return {
      id: this.toNumber(raw.hikayeID || raw.hikaye_ID),
      status: this.toNumber(raw.hikaye_durum),
      ownerId: this.toNumber(raw.hikaye_sahip || raw.oyuncu_ID),
      mediaUrl: this.toImageUrl(raw.hikayemedya || raw.hikaye_medya),
      createdAt: raw.hikayezaman || raw.hikaye_zaman,
      isMe: this.toBool(raw.hikayeben),
      authorName: raw.oyuncuadi || raw.oyuncu_adsoyad,
      authorAvatar: this.toImageUrl(raw.oyuncuavatar || raw.oyuncu_avatar)
    };
  }

  static mapStoryList(rawList: any[]): StoryResponse[] {
    return (rawList || []).map(item => this.mapStory(item));
  }
}
