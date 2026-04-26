import { GlobalSearchResultDTO, TagDTO, SearchResult, Tag, GlobalSearchRawResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Global Search results.
 */
export class SearchMapper extends BaseMapper {
  /**
   * Maps search results for players, groups, etc.
   */
  static mapSearchResult(raw: GlobalSearchRawResponse): SearchResult {
    const legacy = this.shouldReturnRaw<GlobalSearchResultDTO>(raw);
    if (legacy) return new SearchResult(legacy);
    if (!raw) return new SearchResult({ id: 0, type: 'unknown', title: '', image: '', url: '' } as GlobalSearchResultDTO);

    return new SearchResult({
      id: this.toNumber(raw.ID),
      type: raw.turu || 'oyuncu',
      title: raw.Value || '',
      displayName: raw.Value || '',
      username: raw.username || '',
      gender: raw.cins || undefined,
      image: this.toImageUrl(raw.avatar) || '',
      url: raw.url || ''
    });
  }

  static mapSearchList(rawList: GlobalSearchRawResponse[]): SearchResult[] {
    return (rawList || []).map(item => this.mapSearchResult(item));
  }

  /**
   * Maps tag search results.
   */
  static mapTag(raw: any): Tag {
    const legacy = this.shouldReturnRaw<TagDTO>(raw);
    if (legacy) return new Tag(legacy);
    
    return new Tag({
      id: this.toNumber(raw.hashtag_ID),
      value: raw.hashtag_value || '',
      useCount: this.toNumber(raw.hashtag_numberofuses),
      firstDate: raw.hashtag_firstdate || ''
    });
  }

  static mapTagList(rawList: any[]): Tag[] {
    return (rawList || []).map(item => this.mapTag(item));
  }
}
