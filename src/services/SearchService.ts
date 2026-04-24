import { GlobalSearchResultResponse, TagResponse, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { SearchMapper } from '../utils/mappers';

/**
 * Service for platform-wide search functionality.
 */
export class SearchService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Performs a global search across the platform (players, teams, groups).
   */
  async globalSearch(query: string, page: number = 1, limit: number = 20, categoryDetail?: string): Promise<ServiceResponse<GlobalSearchResultResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('oyuncuadi', query);
      formData.append('sayfa', String(page));
      formData.append('limit', String(limit));
      formData.append('kategoridetay', categoryDetail || '');

      const response = await this.client.post<any>(`/0/0/arama/${page}/${limit}/`, formData);
      const data = this.handle<any[]>(response);
      const mapped = SearchMapper.mapSearchList(data || []);
      
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SearchService] Global search failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Search for tags/labels on the platform.
   * Useful for autocomplete when user types '#' in a post.
   */
  async searchTags(page: number = 1, options?: { tag?: string, limit?: number }): Promise<ServiceResponse<TagResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (options?.limit) formData.append('limit', options.limit.toString());
      if (options?.tag) formData.append('etiket', options.tag);

      const response = await this.client.post<any>('/0/0/etiketler/0/0/', formData);
      const data = this.handle<any[]>(response);
      const mapped = SearchMapper.mapTagList(data || []);
      
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SearchService] Failed to search tags:', error);
      return this.createError(error.message);
    }
  }
}

