import { News } from '../models/content/News';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ServiceResponse } from '../api/ServiceResponse';

/**
 * Service for managing platform news, blogs, and articles.
 * @checked 2026-04-12
 */
export class BlogService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Get all news articles.
   */
  async getNews(page: number, limit?: number): Promise<ServiceResponse<News[]>> {
    try {
      const response = await this.client.get<any>('/content/news', {
        params: { page, limit }
      });
      const icerik = this.handleResponse<{ news: any[] }>(response);
      const news = (icerik.news || []).map(n => News.fromJSON(n));
      return this.createSuccess(news, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[BlogService] Failed to fetch news:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get news articles using the legacy bot-based endpoint.
   */
  async getNewsLegacy(page: number, limit?: number): Promise<ServiceResponse<News[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) {
        formData.append('limit', limit.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/haberler/${page}/${limit || 0}/`), formData);
      const icerik = this.handleResponse<any[]>(response);
      const news = Array.isArray(icerik) ? icerik.map(n => News.fromJSON(n)) : [];
      return this.createSuccess(news, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[BlogService] Failed to fetch legacy news:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get a single news article by slug.
   */
  async getNewsBySlug(slug: string): Promise<ServiceResponse<News | null>> {
    try {
      const response = await this.client.get<any>(`/content/news/${slug}`);
      const icerik = this.handleResponse<any>(response);
      const news = News.fromJSON(icerik);
      return this.createSuccess(news, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[BlogService] Failed to fetch news article ${slug}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Search news articles.
   */
  async searchNews(page: number, query: string, limit?: number): Promise<ServiceResponse<News[]>> {
    try {
      const response = await this.client.get<any>('/content/news/search', {
        params: { q: query, page, limit }
      });
      const icerik = this.handleResponse<{ news: any[] }>(response);
      const news = (icerik.news || []).map(n => News.fromJSON(n));
      return this.createSuccess(news, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[BlogService] News search failed:', error);
      return this.createError(error.message);
    }
  }
}
