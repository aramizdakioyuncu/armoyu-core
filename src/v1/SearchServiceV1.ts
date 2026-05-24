import { BaseService } from '../services/BaseService';
import { SearchResult, Tag, ServiceResponse, SearchCategory, GlobalSearchRawResponse } from '../models';
import { SearchMapper } from '../utils/mappers/social/SearchMapper';

export interface SearchOptions {
  filter?: string;
  limit?: number;
}

export class SearchServiceV1 extends BaseService {
  async globalSearch(query: string, page: number = 1, limit: number = 20, category?: SearchCategory, categoryDetail?: string): Promise<ServiceResponse<SearchResult[]>> {
    try {
      const formData = new FormData();
      formData.append('oyuncuadi', query);
      formData.append('sayfa', String(page));
      formData.append('limit', String(limit));
      formData.append('kategori', category || '');
      formData.append('kategoridetay', categoryDetail || '');
      const response = await this.client.post<any>(`/0/0/arama/${page}/${limit}/`, formData);
      const data = this.handle<GlobalSearchRawResponse[]>(response);
      return this.createSuccess(SearchMapper.mapSearchList(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SearchServiceV1] Global search failed:', error.message);
      return this.createError(error.message);
    }
  }

  async search(query: string, page: number = 1, options?: SearchOptions): Promise<ServiceResponse<SearchResult[]>> {
    return this.globalSearch(query, page, options?.limit || 20);
  }

  async searchTags(page: number = 1, options?: { tag?: string; limit?: number }): Promise<ServiceResponse<Tag[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (options?.limit) formData.append('limit', options.limit.toString());
      if (options?.tag) formData.append('etiket', options.tag);
      const response = await this.client.post<any>('/0/0/etiketler/0/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(SearchMapper.mapTagList(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SearchServiceV1] Failed to search tags:', error.message);
      return this.createError(error.message);
    }
  }
}
