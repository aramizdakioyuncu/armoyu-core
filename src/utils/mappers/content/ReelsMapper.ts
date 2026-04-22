import { ReelsResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Reels content.
 * Specialized for each endpoint.
 */
export class ReelsMapper extends BaseMapper {
  /**
   * Specialized for General Reels List.
   */
  static mapReelsItem(raw: any): ReelsResponse {
    if (!raw) return {} as ReelsResponse;

    const owner = raw.reels_owner || {};
    const ownerAvatar = owner.owner_avatar || {};

    const media = raw.reels_media || {};
    const mediaInner = media.media_URL || {};

    return {
      id: this.toNumber(raw.reels_ID),
      owner: {
        id: this.toNumber(owner.owner_ID),
        displayName: owner.owner_displayname || '',
        username: owner.owner_username || '',
        avatar: this.toImageUrl(ownerAvatar) || ''
      },
      description: raw.reels_description || '',
      date: raw.reels_date || '',
      media: {
        id: this.toNumber(media.media_ID),
        url: this.toImageUrl(mediaInner) || ''
      },
      likeCount: this.toNumber(raw.reels_likecount),
      commentCount: this.toNumber(raw.reels_commentcount),
      status: this.toNumber(raw.reels_status, 1)
    };
  }

  /**
   * Maps a list from Reels List endpoint.
   */
  static mapReelsList(rawList: any[]): ReelsResponse[] {
    return (rawList || []).map(item => this.mapReelsItem(item));
  }
}
