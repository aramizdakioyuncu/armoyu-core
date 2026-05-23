import { BaseService } from '../services/BaseService';
import { GetNewsResponse, News, ServiceResponse } from '../models';
import { NewsMapper } from '../utils/mappers';

/**
 * Legacy V1 (OLD) implementation for BlogService.
 */
export class BlogServiceV1 extends BaseService {
  /**
   * Get all news articles (V1).
   */
  async getNews(page: number, limit?: number): Promise<GetNewsResponse> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) formData.append('limit', limit.toString());

      const response = await this.client.post<any>(`/0/0/haberler/${page}/${limit || 0}/`, formData);
      const data = this.handle<any[]>(response);
      const mapped = (data || []).map(i => NewsMapper.mapNews(i)).filter((n): n is News => n !== null);

      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[BlogServiceV1] Failed to fetch news:', error.message);
      return this.createError(error.message) as any;
    }
  }

  /**
   * Get a single news article by ID or URL (V1).
   */
  async getNewsDetail(opt: { newsId?: number; newsURL?: string }): Promise<ServiceResponse<News | null>> {
    try {
      const formData = new FormData();
      if (opt.newsId) formData.append('haberID', opt.newsId.toString());
      if (opt.newsURL) formData.append('haberURL', opt.newsURL);

      const response = await this.client.post<any>('/0/0/haberler/detay/0/', formData);
      const icerik = this.handle<any>(response);
      const mapped = NewsMapper.mapNews(icerik);

      return this.createSuccess(mapped || null, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[BlogServiceV1] Failed to fetch news detail:', error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Search news articles (V1).
   */
  async searchNews(page: number, query: string, limit?: number): Promise<ServiceResponse<News[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      formData.append('haberadi', query);
      if (limit !== undefined) formData.append('limit', limit.toString());

      const response = await this.client.post<any>(`/0/0/haberler/arama/${page}/${limit || 0}/`, formData);
      const icerik = this.handle<any[]>(response);
      const mapped = NewsMapper.mapNewsList(icerik || []);

      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[BlogServiceV1] News search failed:', error.message);
      return this.createError(error.message);
    }
  }
}
