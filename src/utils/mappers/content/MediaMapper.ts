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

    return {
      id: this.toNumber(raw.media_ID || raw.fotoID),
      owner: {
        id: this.toNumber(raw.media_ownerID || raw.fotosahipID),
        username: raw.media_ownerusername || '',
        avatar: this.toImageUrl(raw.media_owneravatar) || ''
      },
      time: raw.media_time || raw.fotozaman || '',
      size: raw.media_size || '',
      category: (raw.fotokategori || '') as MediaCategory,
      isPublic: raw.fotopaylas === '1',
      type: raw.fotodosyatipi || '',
      url: {
        original: this.toImageUrl(raw.fotoorijinalurl) || '',
        large: this.toImageUrl(raw.fotoorijinalurl) || '',
        small: this.toImageUrl(raw.fotoufaklikurl) || '',
        thumb: this.toImageUrl(raw.fotominnakurl) || ''
      }
    };
  }

  /**
   * Maps a list from Gallery endpoint.
   */
  static mapGalleryList(rawList: any[]): MediaResponse[] {
    return (rawList || []).map(item => this.mapGalleryItem(item));
  }
}
