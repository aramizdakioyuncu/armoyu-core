import { SearchResult, Tag, ServiceResponse, SearchCategory } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { SearchServiceV1, SearchOptions } from '../v1/SearchServiceV1';
import { SearchServiceV2 } from '../v2/SearchServiceV2';

export { SearchOptions };

export class SearchService extends BaseService {
  private version: SearchServiceV1 | SearchServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new SearchServiceV1(client, logger)
      : new SearchServiceV2(client, logger);
  }

  async search(query: string, page: number = 1, options?: SearchOptions): Promise<ServiceResponse<SearchResult[]>> {
    return this.version.search(query, page, options);
  }

  async globalSearch(query: string, page: number = 1, limit: number = 20, category?: SearchCategory, categoryDetail?: string): Promise<ServiceResponse<SearchResult[]>> {
    return this.version.globalSearch(query, page, limit, category, categoryDetail);
  }

  async searchTags(page: number = 1, options?: { tag?: string; limit?: number }): Promise<ServiceResponse<Tag[]>> {
    return this.version.searchTags(page, options);
  }
}
