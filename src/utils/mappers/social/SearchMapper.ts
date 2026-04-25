import { GlobalSearchResultResponse, TagResponse, GlobalSearchRawResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Global Search results.
 */
export class SearchMapper extends BaseMapper {
  /**
   * Maps search results for players, groups, etc.
   */
  static mapSearchResult(raw: GlobalSearchRawResponse): GlobalSearchResultResponse {
    if (!raw) return { id: 0, type: 'unknown', title: '', image: '', url: '' } as GlobalSearchResultResponse;

    return {
      id: this.toNumber(raw.ID),
      type: raw.turu || 'oyuncu',
      title: raw.Value || '',
      displayName: raw.Value || '',
      username: raw.username || '',
      gender: raw.cins || undefined,
      image: this.toImageUrl(raw.avatar) || '',
      url: raw.url || ''
    };
  }

  static mapSearchList(rawList: GlobalSearchRawResponse[]): GlobalSearchResultResponse[] {
    return (rawList || []).map(item => this.mapSearchResult(item));
  }

  /**
   * Maps tag search results.
   */
  static mapTag(raw: any): TagResponse {
    return {
      id: this.toNumber(raw.hashtag_ID),
      value: raw.hashtag_value || '',
      useCount: this.toNumber(raw.hashtag_numberofuses),
      firstDate: raw.hashtag_firstdate || ''
    };
  }

  static mapTagList(rawList: any[]): TagResponse[] {
    return (rawList || []).map(item => this.mapTag(item));
  }
}
