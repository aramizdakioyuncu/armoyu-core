import { SearchResult } from '../models/social/SearchResult';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';

/**
 * Service for platform-wide search functionality.
 * @checked 2026-04-12
 */
export class SearchService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Performs a global search across the platform (players, teams, groups).
   * 
   * @param query The search query (player name, etc.)
   * @param page Page number for pagination
   * @param limit Results limit per page
   * @returns List of search results
   */
  async globalSearch(query: string, page: number = 1, limit: number = 20): Promise<SearchResult[]> {
    try {
      const formData = new FormData();
      formData.append('oyuncuadi', query);
      formData.append('sayfa', String(page));
      formData.append('limit', String(limit));
      formData.append('kategoridetay', ''); // Left empty as per user request

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/arama/0/0/'), formData);
      const icerik = this.handleResponse<any[]>(response);
      
      return Array.isArray(icerik) ? icerik.map(item => SearchResult.fromJSON(item)) : [];
    } catch (error) {
      this.logger.error('[SearchService] Global search failed:', error);
      return [];
    }
  }
}
