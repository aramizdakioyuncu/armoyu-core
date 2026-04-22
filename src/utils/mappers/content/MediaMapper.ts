import { MediaResponse, MediaCategory } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Gallery and Media operations.
 * Specialized for each endpoint.
 */
export class MediaMapper extends BaseMapper {
  /**
   * Specialized for Gallery Item (/0/0/medya/0/0/).
   */
  static mapGalleryItem(raw: any): MediaResponse {
    if (!raw) return {} as MediaResponse;

    const time = raw.media_time || raw.fotozaman || raw.created_at || raw.tarih || '';

    return {
      id: this.toNumber(raw.media_ID || raw.fotoID || raw.mediaID),
      owner: {
        id: this.toNumber(raw.media_ownerID || raw.fotosahipID || raw.media_owner_ID),
        username: raw.media_ownerusername || raw.media_owner_username || '',
        avatar: this.toImageUrl(raw.media_owneravatar || raw.media_owner_avatar) || ''
      },
      time: time,
      size: raw.media_size || raw.fotomyboyut || raw.boyut || '',
      category: (raw.media_category || raw.fotokategori || raw.category || '') as MediaCategory,
      isPublic: raw.fotopaylas === '1',
      type: raw.fotodosyatipi || raw.media_type || '',
      url: {
        original: this.toImageUrl(raw.media_URL || raw.media_url || raw.fotoorijinalurl) || '',
        large: this.toImageUrl(raw.media_bigURL || raw.media_big_url || raw.fotoorijinalurl) || '',
        small: this.toImageUrl(raw.media_minURL || raw.media_min_url || raw.fotoufaklikurl) || '',
        thumb: this.toImageUrl(raw.media_minURL || raw.media_min_url || raw.fotominnakurl) || ''
      },
      title: raw.media_name || raw.baslik || raw.fotobaslik || raw.media_baslik || time || 'İsimsiz Medya'
    } as any;
  }

  /**
   * Maps a list from Gallery endpoint.
   */
  static mapGalleryList(rawList: any[]): MediaResponse[] {
    return (rawList || []).map(item => this.mapGalleryItem(item));
  }
}
