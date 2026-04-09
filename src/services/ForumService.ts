import { Forum } from '../models/community/Forum';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';

export class ForumService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }
  /**
   * Get all forum categories.
   */
  async getCategories(): Promise<any[]> {
    try {
      const response = await this.client.get<any>('/community/forums/categories');
      return this.handleResponse<any[]>(response);
    } catch (error) {
      this.logger.error('[ForumService] Failed to fetch categories:', error);
      return [];
    }
  }

  /**
   * Get topics for a specific category.
   */
  async getTopics(categoryId: number, page: number = 1): Promise<any[]> {
    try {
      const response = await this.client.get<any>(`/community/forums/categories/${categoryId}/topics`, {
        params: { page }
      });
      return this.handleResponse<any[]>(response);
    } catch (error) {
      this.logger.error(`[ForumService] Failed to fetch topics for category ${categoryId}:`, error);
      return [];
    }
  }

  /**
   * Create a new topic in a category.
   */
  async createTopic(categoryId: number, title: string, content: string): Promise<any> {
    try {
      const response = await this.client.post<any>(`/community/forums/categories/${categoryId}/topics`, {
        title,
        content
      });
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error('[ForumService] Topic creation failed:', error);
      throw error;
    }
  }

  /**
   * Delete a topic by its ID.
   */
  async deleteTopic(topicId: number): Promise<void> {
    try {
      const response = await this.client.delete<any>(`/community/forums/topics/${topicId}`);
      this.handleResponse(response);
    } catch (error) {
      this.logger.error(`[ForumService] Failed to delete topic ${topicId}:`, error);
      throw error;
    }
  }
}
