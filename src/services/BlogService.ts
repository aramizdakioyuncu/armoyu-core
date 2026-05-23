import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { GetNewsResponse, News, ServiceResponse } from '../models';
import { BlogServiceV1 } from '../v1/BlogServiceV1';
import { BlogServiceV2, CreateNewsParams, UpdateNewsParams } from '../v2/BlogServiceV2';

export type { CreateNewsParams, UpdateNewsParams };

/**
 * Service for managing platform news, blogs, and articles.
 * Delegates to BlogServiceV1 (legacy FormData) or BlogServiceV2 (REST JSON).
 */
export class BlogService extends BaseService {
  private version: BlogServiceV1 | BlogServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new BlogServiceV1(client, logger)
      : new BlogServiceV2(client, logger);
  }

  /**
   * Get all news articles.
   */
  async getNews(page: number, limit?: number): Promise<GetNewsResponse> {
    return this.version.getNews(page, limit);
  }

  /**
   * Get a single news article by ID or URL.
   */
  async getNewsDetail(opt: { newsId?: number; newsURL?: string }): Promise<ServiceResponse<News | null>> {
    return this.version.getNewsDetail(opt);
  }

  /**
   * Search news articles (V1 only; not yet available in V2).
   */
  async searchNews(page: number, query: string, limit?: number): Promise<ServiceResponse<News[]>> {
    return this.version.searchNews(page, query, limit);
  }

  /**
   * Create a news article (V2 only).
   */
  async createNews(params: CreateNewsParams): Promise<ServiceResponse<News | null>> {
    if (this.usePreviousVersion) {
      return this.createError('createNews yalnızca V2 API\'sinde desteklenmektedir.');
    }
    return (this.version as BlogServiceV2).createNews(params);
  }

  /**
   * Update a news article (V2 only).
   */
  async updateNews(newsId: number, params: UpdateNewsParams): Promise<ServiceResponse<boolean>> {
    if (this.usePreviousVersion) {
      return this.createError('updateNews yalnızca V2 API\'sinde desteklenmektedir.');
    }
    return (this.version as BlogServiceV2).updateNews(newsId, params);
  }

  /**
   * Delete (soft) a news article (V2 only).
   */
  async deleteNews(newsId: number): Promise<ServiceResponse<boolean>> {
    if (this.usePreviousVersion) {
      return this.createError('deleteNews yalnızca V2 API\'sinde desteklenmektedir.');
    }
    return (this.version as BlogServiceV2).deleteNews(newsId);
  }

  /**
   * Get news using the legacy bot-based endpoint (V1 alias).
   * @deprecated Use getNews() instead.
   */
  async getNewsLegacy(page: number, limit?: number): Promise<GetNewsResponse> {
    if (this.usePreviousVersion) {
      return (this.version as BlogServiceV1).getNews(page, limit);
    }
    return this.getNews(page, limit);
  }

  /**
   * Get a single news article by slug (delegates to getNewsDetail).
   */
  async getNewsBySlug(slug: string): Promise<ServiceResponse<News | null>> {
    return this.getNewsDetail({ newsURL: slug });
  }
}
