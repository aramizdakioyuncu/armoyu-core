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

    return {
      authorId: this.toNumber(raw.oyuncu_ID),
      authorName: raw.oyuncu_adsoyad,
      authorUsername: raw.oyuncu_kadi,
      authorAvatar: this.toImageUrl(raw.oyuncu_avatar),
      storyCount: this.toNumber(raw.hikaye_sayisi),
      items: Array.isArray(raw.hikaye_icerik) ? raw.hikaye_icerik.map((item: any) => this.mapStoryItem(item)) : []
    };
  }

  static mapStoryItem(raw: any): StoryItemResponse {
    return {
      id: this.toNumber(raw.hikaye_ID),
      status: this.toNumber(raw.hikaye_durum),
      ownerId: this.toNumber(raw.hikaye_sahip),
      mediaUrl: this.toImageUrl(raw.hikaye_medya),
      createdAt: raw.hikaye_zaman,
      isLiked: this.toBool(raw.hikaye_benbegeni),
      isViewed: this.toBool(raw.hikaye_bengoruntulenme)
    };
  }

  static mapStoryList(rawList: any[]): StoryResponse[] {
    return (rawList || []).map(item => this.mapStory(item));
  }
}
