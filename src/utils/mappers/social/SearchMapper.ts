import { GlobalSearchResultResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Global Search results.
 */
export class SearchMapper extends BaseMapper {
  /**
   * Maps search results for players, groups, etc.
   */
  static mapSearchResult(raw: any): GlobalSearchResultResponse {
    if (!raw) return { id: 0, type: 'unknown', title: '', image: '', url: '' } as GlobalSearchResultResponse;

    return {
      id: this.toNumber(raw.ID || raw.id),
      type: raw.turu || raw.type || 'oyuncu',
      title: raw.Value || raw.title || raw.adsoyad || raw.ad || raw.name || '',
      displayName: raw.Value || '',
      username: raw.username || '',
      gender: raw.cins || undefined,
      image: this.toImageUrl(raw.avatar || raw.media_URL || raw.image || raw.oyuncuavatar) || '',
      url: raw.url || ''
    };
  }

  static mapSearchList(rawList: any[]): GlobalSearchResultResponse[] {
    return (rawList || []).map(item => this.mapSearchResult(item));
  }
}
