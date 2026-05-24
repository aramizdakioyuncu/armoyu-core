import { ReelsResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

export class ReelsMapper extends BaseMapper {
  // V1 list item: flat structure with reels_ID, reels_owner{}, reels_media{}
  static mapReelsItemV1(raw: any): ReelsResponse {
    if (!raw) return {} as ReelsResponse;

    const owner = raw.reels_owner || {};
    const media = raw.reels_media || {};

    return {
      id: this.toNumber(raw.reels_ID),
      owner: {
        id: this.toNumber(owner.owner_ID),
        displayName: owner.owner_displayname || '',
        username: owner.owner_username || '',
        avatar: this.toImageUrl(owner.owner_avatar) || ''
      },
      description: raw.reels_description || '',
      date: raw.reels_date || '',
      media: {
        id: this.toNumber(media.media_ID),
        url: this.toImageUrl(media.media_URL) || ''
      },
      likeCount: this.toNumber(raw.reels_likecount),
      commentCount: this.toNumber(raw.reels_commentcount),
      status: this.toNumber(raw.reels_status, 1)
    };
  }

  // V2 list item: { reel: { sreels_* }, owner: { id, login, name, avatar } }
  // V2 create response: flat sreels_* object (no wrapper)
  static mapReelsItemV2(raw: any): ReelsResponse {
    if (!raw) return {} as ReelsResponse;

    // list endpoint wraps in { reel, owner }; create returns flat sreels_* directly
    const reel = raw.reel || raw;
    const ownerObj = raw.owner;

    return {
      id: this.toNumber(reel.sreels_id),
      owner: {
        id: ownerObj ? this.toNumber(ownerObj.id) : this.toNumber(reel.user_id || reel.sreels_owner),
        displayName: ownerObj ? (ownerObj.name || '') : (reel.display_name || ''),
        username: ownerObj ? (ownerObj.login || '') : (reel.user_login || ''),
        avatar: ownerObj ? (ownerObj.avatar || '') : (reel.avatar || '')
      },
      description: reel.sreels_description || '',
      date: reel.sreels_date || '',
      media: {
        id: this.toNumber(reel.sreels_media),
        url: reel.sreels_media_norm || reel.sreels_media_high || '',
        high: reel.sreels_media_high,
        norm: reel.sreels_media_norm,
        min: reel.sreels_media_min
      },
      likeCount: this.toNumber(reel.sreels_likecount),
      commentCount: this.toNumber(reel.sreels_commentcount),
      status: reel.sreels_status
    };
  }

  // Keep legacy alias used by V1 service
  static mapReelsItem(raw: any): ReelsResponse {
    return this.mapReelsItemV1(raw);
  }

  static mapReelsList(rawList: any[]): ReelsResponse[] {
    return (rawList || []).map(item => this.mapReelsItem(item));
  }

  static mapReelsListV2(rawList: any[]): ReelsResponse[] {
    return (rawList || []).map(item => this.mapReelsItemV2(item));
  }
}
