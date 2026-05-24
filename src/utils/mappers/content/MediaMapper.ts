import { MediaResponse, MediaCategory, MediaUploadResultDTO } from '../../../models';
import { BaseMapper } from '../BaseMapper';

export class MediaMapper extends BaseMapper {
  static mapGalleryItem(raw: any): MediaResponse {
    if (!raw) return {} as MediaResponse;

    const time = raw.media_time || raw.fotozaman || raw.created_at || raw.tarih || '';

    // V2: media_owner is a nested object { player_ID, player_userlogin, player_avatar }
    // V1: flat fields like media_ownerID, media_ownerusername
    const owner = raw.media_owner;
    const ownerId = owner
      ? this.toNumber(owner.player_ID)
      : this.toNumber(raw.media_ownerID || raw.fotosahipID || raw.media_owner_ID);
    const ownerUsername = owner
      ? (owner.player_userlogin || '')
      : (raw.media_ownerusername || raw.media_owner_username || '');
    const ownerAvatar = owner
      ? (this.toImageUrl(owner.player_avatar) || '')
      : (this.toImageUrl(raw.media_owneravatar || raw.media_owner_avatar) || '');

    return {
      id: this.toNumber(raw.media_ID || raw.fotoID || raw.mediaID),
      owner: {
        id: ownerId,
        username: ownerUsername,
        avatar: ownerAvatar
      },
      time,
      size: raw.media_size || raw.fotomyboyut || raw.boyut || '',
      category: (raw.media_category || raw.fotokategori || raw.category || '') as MediaCategory,
      isPublic: raw.fotopaylas === '1',
      type: raw.media_filetype || raw.fotodosyatipi || raw.media_type || '',
      url: {
        original: this.toImageUrl(raw.media_URL || raw.media_url || raw.fotoorijinalurl) || '',
        large: this.toImageUrl(raw.media_bigURL || raw.media_big_url || raw.fotoorijinalurl) || '',
        small: this.toImageUrl(raw.media_URL || raw.media_url || raw.fotoufaklikurl) || '',
        thumb: this.toImageUrl(raw.media_minURL || raw.media_min_url || raw.fotominnakurl) || ''
      },
      title: raw.media_name || raw.baslik || raw.fotobaslik || raw.media_baslik || time || 'İsimsiz Medya'
    } as any;
  }

  static mapGalleryList(rawList: any[]): MediaResponse[] {
    return (rawList || []).map(item => this.mapGalleryItem(item));
  }

  static mapUploadResult(raw: any): MediaUploadResultDTO {
    if (!raw) return {} as MediaUploadResultDTO;
    const record = raw.record || {};
    return {
      url: raw.url || record.urladresi || '',
      key: raw.key || '',
      mediaId: this.toNumber(record.sirano),
      category: record.kategori || '',
      fileType: record.galeridosyaturu || '',
      fileSize: record.galeridosyaboyut || ''
    };
  }
}
