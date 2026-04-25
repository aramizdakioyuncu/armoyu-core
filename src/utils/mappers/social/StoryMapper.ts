import { StoryResponse, StoryItemResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Stories (Hikaye) related API responses.
 * 
 * API Response Structure:
 * Each item in icerik[] is an AUTHOR with nested stories:
 * {
 *   oyuncu_ID, oyuncu_adsoyad, oyuncu_kadi, oyuncu_avatar,
 *   hikaye_sayisi,
 *   hikaye_icerik: [{ hikaye_ID, hikaye_durum, hikaye_sahip, hikaye_zaman, hikaye_medya, ... }]
 * }
 */
export class StoryMapper extends BaseMapper {
  static mapStory(raw: any): StoryResponse {
    const legacy = this.shouldReturnRaw<StoryResponse>(raw);
    if (legacy) return legacy;
    if (!raw) return {} as StoryResponse;

    // hikaye_icerik dizisindeki her öğeyi StoryItemResponse'a çevir
    const rawItems = Array.isArray(raw.hikaye_icerik) ? raw.hikaye_icerik : [];
    const items = rawItems.map((item: any) => this.mapStoryItem(item));

    return {
      authorId: this.toNumber(raw.oyuncu_ID),
      authorName: raw.oyuncu_adsoyad || '',
      authorUsername: raw.oyuncu_kadi || raw.oyuncu_adsoyad || '',
      authorAvatar: this.toImageUrl(raw.oyuncu_avatar) || '',
      storyCount: this.toNumber(raw.hikaye_sayisi) || items.length,
      items: items
    };
  }

  static mapStoryItem(raw: any): StoryItemResponse {
    return {
      id: this.toNumber(raw.hikaye_ID || raw.hikayeID),
      status: this.toNumber(raw.hikaye_durum),
      ownerId: this.toNumber(raw.hikaye_sahip || raw.oyuncu_ID),
      mediaUrl: this.toImageUrl(raw.hikaye_medya || raw.hikayemedya),
      createdAt: raw.hikaye_zaman || raw.hikayezaman || '',
      isMe: this.toBool(raw.hikayeben),
      isSeen: this.toBool(raw.hikaye_bengoruntulenme), // Benim izlemem
      isLiked: this.toBool(raw.hikaye_benbegeni), // Benim beğenmem
      likeCount: this.toNumber(raw.hikaye_begeni || raw.hikayebegeni || 0),
      viewCount: this.toNumber(raw.hikaye_goruntulenme || raw.hikayegoruntulenme || 0),
      authorName: raw.oyuncuadi || raw.oyuncu_adsoyad || '',
      authorAvatar: this.toImageUrl(raw.oyuncuavatar || raw.oyuncu_avatar)
    };
  }

  static mapStoryList(rawList: any[]): StoryResponse[] {
    return (rawList || []).map(item => this.mapStory(item));
  }
}
