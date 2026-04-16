import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ServiceResponse } from '../api/ServiceResponse';
import { GetNewsResponse } from '../models/content/GetNewsResponse';
import { News } from '../models/content/News';

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

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/haberler/${page}/${limit || 0}/`), formData);
      const icerik = this.handle<any[]>(response);
      
      return {
        icerik: icerik || [],
        durum: Number(response.durum),
        aciklama: response.aciklama || 'İşlem Başarılı',
        kod: Number(response.kod || 0)
      };
    } catch (error: any) {
      this.logger.error('[BlogService] Failed to fetch legacy news:', error);
      return { icerik: [], durum: 0, aciklama: error.message, kod: 0 };
    }
  }

  /**
   * Get a single news article by slug.
   */
  async getNewsBySlug(slug: string): Promise<ServiceResponse<News | null>> {
    try {
      const response = await this.client.get<any>(`/content/news/${slug}`);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik || null, response?.aciklama);
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
      const icerik = this.handle<{ news: any[] }>(response);
      return this.createSuccess(icerik?.news || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[BlogService] News search failed:', error);
      return this.createError(error.message);
    }
  }
}



