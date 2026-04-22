import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ServiceResponse } from '../api/ServiceResponse';
import { GetNewsResponse, NewsResponse } from '../models';
import { NewsMapper } from '../utils/mappers';

/**
 * Service for managing platform news, blogs, and articles.
 */
export class BlogService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Get all news articles.
   */
  async getNews(page: number, limit?: number): Promise<GetNewsResponse> {
    // Redirecting to legacy for now as REST endpoint returns HTML
    return this.getNewsLegacy(page, limit);
  }

  /**
   * Get news articles using the legacy bot-based endpoint.
   */
  async getNewsLegacy(page: number, limit?: number): Promise<GetNewsResponse> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) {
        formData.append('limit', limit.toString());
      }

      const response = await this.client.post<any>(`/0/0/haberler/${page}/${limit || 0}/`, formData);
      const data = this.handle<any[]>(response);
      const mapped = (data || []).map(i => NewsMapper.mapNews(i)).filter((n): n is NewsResponse => n !== null);
      
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[BlogService] Failed to fetch legacy news:', error);
      return this.createError(error.message) as any;
    }
  }

  /**
   * Get a single news article by slug.
   */
  async getNewsBySlug(slug: string): Promise<ServiceResponse<NewsResponse | null>> {
    try {
      // Slugs are typically used for URL lookup, but if not available in bot API, we redirect to detail by URL
      return this.getNewsDetail({ newsURL: slug });
    } catch (error: any) {
      this.logger.error(`[BlogService] Failed to fetch news article by slug ${slug}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Get a single news article by ID or URL (Legacy).
   */
  async getNewsDetail(opt: { newsId?: number, newsURL?: string }): Promise<ServiceResponse<NewsResponse | null>> {
    try {
      const formData = new FormData();
      if (opt.newsId) formData.append('haberID', opt.newsId.toString());
      if (opt.newsURL) formData.append('haberURL', opt.newsURL);

      const response = await this.client.post<any>('/0/0/haberler/detay/0/', formData);
      const icerik = this.handle<any>(response);
      const mapped = NewsMapper.mapNews(icerik);
      
      return this.createSuccess(mapped || null, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[BlogService] Failed to fetch news detail:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Search news articles.
   */
  async searchNews(page: number, query: string, limit?: number): Promise<ServiceResponse<NewsResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      formData.append('haberadi', query);
      if (limit !== undefined) {
        formData.append('limit', limit.toString());
      }

      // Guessed legacy search path based on common patterns
      const response = await this.client.post<any>(`/0/0/haberler/arama/${page}/${limit || 0}/`, formData);
      const icerik = this.handle<any[]>(response);
      const mapped = NewsMapper.mapNewsList(icerik || []);
      
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[BlogService] News search failed:', error);
      return this.createError(error.message);
    }
  }
}

