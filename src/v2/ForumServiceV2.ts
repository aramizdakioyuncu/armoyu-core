import { BaseService } from '../services/BaseService';
import { ForumCategory, ForumTopic, ServiceResponse } from '../models';
import { ForumMapper } from '../utils/mappers';
import { CreateTopicParams } from '../services/ForumService';

/**
 * Modern V2 (CURRENT) implementation for ForumService.
 *
 * Endpoints:
 *   GET    /v1/forum                  → list topics
 *   GET    /v1/forum/{url}            → topic detail by URL slug
 *   POST   /v1/forum                  → create topic
 *   DELETE /v1/forum/{id}             → delete topic
 *   GET    /v1/forum/categories       → list categories
 */
export class ForumServiceV2 extends BaseService {
  async getTopics(page: number, options?: { limit?: number; categoryId?: number }): Promise<ServiceResponse<ForumTopic[]>> {
    try {
      const query = new URLSearchParams({ page: page.toString() });
      if (options?.limit) query.set('limit', options.limit.toString());
      if (options?.categoryId) query.set('categoryId', options.categoryId.toString());

      const response = await this.client.get<any>(`/v1/forum?${query}`);
      const icerik = this.handle<any[]>(response);
      const mapped = ForumMapper.mapTopicList(Array.isArray(icerik) ? icerik : []);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ForumServiceV2] Failed to fetch topics:', error.message);
      return this.createError(error.message);
    }
  }

  async getTopicDetail(url: string): Promise<ServiceResponse<ForumTopic | null>> {
    try {
      const response = await this.client.get<any>(`/v1/forum/${url}`);
      const icerik = this.handle<any>(response);
      const mapped = ForumMapper.mapTopic(icerik);
      return this.createSuccess(mapped || null, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ForumServiceV2] Failed to fetch topic detail for "${url}":`, error.message);
      return this.createError(error.message);
    }
  }

  async createTopic(params: CreateTopicParams): Promise<ServiceResponse<ForumTopic>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>('/v1/forum', {
        title: params.title,
        type: params.type,
        categoryId: params.categoryId,
        content: params.content,
        url: params.url
      });
      const icerik = this.handle<any>(response);
      const mapped = ForumMapper.mapTopic(icerik);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ForumServiceV2] Failed to create topic:', error.message);
      return this.createError(error.message);
    }
  }

  async deleteTopic(topicId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.delete<any>(`/v1/forum/${topicId}`);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ForumServiceV2] Failed to delete topic ${topicId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async getCategories(): Promise<ServiceResponse<ForumCategory[]>> {
    try {
      const response = await this.client.get<any>('/v1/forum/categories');
      const icerik = this.handle<any[]>(response);
      const mapped = ForumMapper.mapCategoryList(Array.isArray(icerik) ? icerik : []);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ForumServiceV2] Failed to fetch categories:', error.message);
      return this.createError(error.message);
    }
  }
}
