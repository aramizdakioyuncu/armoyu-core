import { BaseService } from '../services/BaseService';
import { SearchResult, Tag, ServiceResponse, SearchCategory } from '../models';
import { SearchMapper } from '../utils/mappers/social/SearchMapper';
import { SearchOptions } from '../v1/SearchServiceV1';

export class SearchServiceV2 extends BaseService {
  async search(query: string, page: number = 1, options?: SearchOptions): Promise<ServiceResponse<SearchResult[]>> {
    try {
      let url = `/v1/search?q=${encodeURIComponent(query)}&page=${page}`;
      if (options?.limit) url += `&limit=${options.limit}`;
      if (options?.filter) url += `&filter=${encodeURIComponent(options.filter)}`;
      const response = await this.client.get<any>(url);
      const data = this.handle<any[]>(response);
      return this.createSuccess(SearchMapper.mapSearchListV2(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SearchServiceV2] Search failed:', error.message);
      return this.createError(error.message);
    }
  }

  async globalSearch(query: string, page: number = 1, limit: number = 20, _category?: SearchCategory, _categoryDetail?: string): Promise<ServiceResponse<SearchResult[]>> {
    // shortcut: kategori filtresi V2'ye çevrilmiyor, tüm kategoriler aranır; kategorili arama gerekince eşlenecek
    return this.search(query, page, { limit });
  }

  async searchTags(_page?: number, _options?: { tag?: string; limit?: number }): Promise<ServiceResponse<Tag[]>> {
    return this.createError('searchTags is not supported in V2 yet');
  }
}
