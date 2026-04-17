import { CommunityMapper } from '../utils/mappers/CommunityMapper';
import { SearchResult } from '../models/social/search/SearchResult';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ServiceResponse } from '../api/ServiceResponse';

/**
 * Service for platform-wide search functionality.
 * @checked 2026-04-12
 */
export class SearchService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger, usePreviousVersion: boolean = false) {
    super(client, logger, usePreviousVersion);
  }

  /**
   * Performs a global search across the platform (players, teams, groups).
   */
  async globalSearch(query: string, page: number = 1, limit: number = 20): Promise<ServiceResponse<SearchResult[]>> {
    try {
      const formData = new FormData();
      formData.append('oyuncuadi', query);
      formData.append('sayfa', String(page));
      formData.append('limit', String(limit));
      formData.append('kategoridetay', ''); // Left empty as per user request

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/arama/${page}/${limit}/`), formData);
      const icerik = this.handle<any[]>(response);
      const mapped = (icerik || []).map(item => CommunityMapper.mapSearchResult(item, this.usePreviousVersion));
      
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SearchService] Global search failed:', error);
      return this.createError(error.message);
    }
  }
}



