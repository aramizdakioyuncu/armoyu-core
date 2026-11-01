import { BaseService } from '../services/BaseService';
import { GetNewsResponse, News, ServiceResponse } from '../models';
import { NewsMapper } from '../utils/mappers';

export interface CreateNewsParams {
  title: string;
  content: string;
  status?: 'publish' | 'draft';
  category?: number;
}

export interface UpdateNewsParams {
  title?: string;
  content?: string;
  status?: 'publish' | 'draft';
}

/**
 * Modern V2 (CURRENT) implementation for BlogService.
 *
 * Endpoints:
 *   GET    /v1/haberler?page={p}&limit={l}  → list news
 *   GET    /v1/haberler/{id}                → news detail
 *   POST   /v1/haberler                     → create news
 *   PUT    /v1/haberler/{id}                → update news
 *   DELETE /v1/haberler/{id}                → delete news (soft)
 */
export class BlogServiceV2 extends BaseService {
  /**
   * Get all news articles (V2).
   */
  async getNews(page: number, limit?: number): Promise<GetNewsResponse> {
    try {
      const params = new URLSearchParams({ page: page.toString() });
      if (limit !== undefined) params.set('limit', limit.toString());

      const response = await this.client.get<any>(`/v1/haberler?${params}`);
      const data = this.handle<any[]>(response);
      const mapped = (data || []).map(i => NewsMapper.mapNews(i)).filter((n): n is News => n !== null);

      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[BlogServiceV2] Failed to fetch news:', error.message);
      return this.createError(error.message) as any;
    }
  }

  /**
   * Get a single news article by ID (V2).
   */
  async getNewsDetail(opt: { newsId?: number; newsURL?: string }): Promise<ServiceResponse<News | null>> {
    try {
      const key = opt.newsId ?? opt.newsURL;
      if (!key) throw new Error('V2 haber detayı için newsId veya newsURL gereklidir.');

      const response = await this.client.get<any>(`/v1/haberler/${encodeURIComponent(key)}`);
      const icerik = this.handle<any>(response);
      const mapped = NewsMapper.mapNews(icerik);

      return this.createSuccess(mapped || null, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[BlogServiceV2] Failed to fetch news detail:', error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Create a new news article (V2).
   */
  async createNews(params: CreateNewsParams): Promise<ServiceResponse<News | null>> {
    try {
      this.requireAuth();
      const response = await this.client.post<any>('/v1/haberler', {
        title: params.title,
        content: params.content,
        status: params.status ?? 'publish',
        category: params.category
      });
      const icerik = this.handle<any>(response);
      const mapped = NewsMapper.mapNews(icerik);

      return this.createSuccess(mapped || null, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[BlogServiceV2] Failed to create news:', error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Update an existing news article (V2).
   */
  async updateNews(newsId: number, params: UpdateNewsParams): Promise<ServiceResponse<boolean>> {
    try {
      this.requireAuth();
      const response = await this.client.put<any>(`/v1/haberler/${newsId}`, {
        title: params.title,
        content: params.content,
        status: params.status
      });
      this.handle(response);

      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[BlogServiceV2] Failed to update news ${newsId}:`, error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Delete (soft) a news article (V2).
   */
  async deleteNews(newsId: number): Promise<ServiceResponse<boolean>> {
    try {
      this.requireAuth();
      const response = await this.client.delete<any>(`/v1/haberler/${newsId}`);
      this.handle(response);

      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[BlogServiceV2] Failed to delete news ${newsId}:`, error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Get comments of a news article (V2).
   */
  async getComments(newsId: number): Promise<ServiceResponse<any[]>> {
    try {
      const response = await this.client.get<any>(`/v1/haberler/${newsId}/comments`);
      return this.createSuccess(this.handle<any[]>(response) || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[BlogServiceV2] Failed to fetch comments of ${newsId}:`, error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Add a comment to a news article (V2).
   */
  async addComment(newsId: number, content: string): Promise<ServiceResponse<any>> {
    try {
      this.requireAuth();
      const response = await this.client.post<any>(`/v1/haberler/${newsId}/comments`, { content });
      return this.createSuccess(this.handle<any>(response), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[BlogServiceV2] Failed to comment on ${newsId}:`, error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Search not yet available in V2.
   */
  async searchNews(_page: number, _query: string, _limit?: number): Promise<ServiceResponse<News[]>> {
    this.logger.error('[BlogServiceV2] searchNews henüz V2 API\'sinde desteklenmiyor.');
    return this.createError('searchNews henüz V2 API\'sinde desteklenmiyor.');
  }
}
