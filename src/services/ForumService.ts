import { ForumResponse, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';

/**
 * Service for managing forum categories, topics, and discussions.
 */
export class ForumService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Get all forum categories.
   */
  async getCategories(): Promise<ServiceResponse<ForumResponse[]>> {
    try {
      const response = await this.client.get<any>('/community/forums/categories');
      const icerik = this.handle<any[]>(response);
      return this.createSuccess(icerik || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ForumService] Failed to fetch categories:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get topics for a specific category.
   */
  async getTopics(categoryId: number, page: number = 1): Promise<ServiceResponse<any[]>> {
    try {
      const response = await this.client.get<any>(`/community/forums/categories/${categoryId}/topics`, {
        params: { page }
      });
      const data = this.handle<any[]>(response);
      return this.createSuccess(data, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ForumService] Failed to fetch topics for category ${categoryId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Create a new topic in a category.
   */
  async createTopic(categoryId: number, title: string, content: string): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>(`/community/forums/categories/${categoryId}/topics`, {
        title,
        content
      });
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ForumService] Topic creation failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Delete a topic by its ID.
   */
  async deleteTopic(topicId: number): Promise<ServiceResponse<void>> {
    this.requireAuth();
    try {
      const response = await this.client.delete<any>(`/community/forums/topics/${topicId}`);
      this.handle(response);
      return this.createSuccess(undefined, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ForumService] Failed to delete topic ${topicId}:`, error);
      return this.createError(error.message);
    }
  }
}
