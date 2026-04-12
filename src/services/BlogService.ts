import { News } from '../models/content/News';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';

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
   * 
   * @param page The page number - MANDATORY
   * @param limit Results limit
   */
  async getNews(page: number, limit?: number): Promise<News[]> {
    try {
      const response = await this.client.get<any>('/content/news', {
        params: { page, limit }
      });
      const icerik = this.handleResponse<{ news: any[] }>(response);
      return (icerik.news || []).map(n => News.fromJSON(n));
    } catch (error) {
      this.logger.error('[BlogService] Failed to fetch news:', error);
      return [];
    }
  }

  /**
   * Get news articles using the legacy bot-based endpoint.
   * 
   * @param page The page number - MANDATORY
   * @param limit Results limit
   */
  async getNewsLegacy(page: number, limit?: number): Promise<News[]> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) {
        formData.append('limit', limit.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/haberler/0/0/'), formData);
      const icerik = this.handleResponse<any[]>(response);
      return Array.isArray(icerik) ? icerik.map(n => News.fromJSON(n)) : [];
    } catch (error) {
      this.logger.error('[BlogService] Failed to fetch legacy news:', error);
      return [];
    }
  }

  /**
   * Get a single news article by slug.
   */
  async getNewsBySlug(slug: string): Promise<News | null> {
    try {
      const response = await this.client.get<any>(`/content/news/${slug}`);
      const icerik = this.handleResponse<any>(response);
      return News.fromJSON(icerik);
    } catch (error) {
      this.logger.error(`[BlogService] Failed to fetch news article ${slug}:`, error);
      return null;
    }
  }

  /**
   * Search news articles.
   * 
   * @param page The page number - MANDATORY
   * @param query The search query
   * @param limit Results limit
   */
  async searchNews(page: number, query: string, limit?: number): Promise<News[]> {
    try {
      const response = await this.client.get<any>('/content/news/search', {
        params: { q: query, page, limit }
      });
      const icerik = this.handleResponse<{ news: any[] }>(response);
      return (icerik.news || []).map(n => News.fromJSON(n));
    } catch (error) {
      this.logger.error('[BlogService] News search failed:', error);
      return [];
    }
  }
}
