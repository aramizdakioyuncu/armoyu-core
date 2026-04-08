import { Forum } from '../models/community/Forum';
import { BaseService } from './BaseService';

export class ForumService extends BaseService {
  /**
   * Get all forum categories.
   */
  async getCategories(): Promise<any[]> {
    try {
      const response = await this.client.get<any[]>('/community/forums/categories');
      return response;
    } catch (error) {
      console.error('[ForumService] Failed to fetch categories:', error);
      return [];
    }
  }

  /**
   * Get topics for a specific category.
   */
  async getTopics(categoryId: number, page: number = 1): Promise<any[]> {
    try {
      const response = await this.client.get<any[]>(`/community/forums/categories/${categoryId}/topics`, {
        params: { page }
      });
      return response;
    } catch (error) {
      console.error(`[ForumService] Failed to fetch topics for category ${categoryId}:`, error);
      return [];
    }
  }

  /**
   * Create a new topic in a category.
   */
  async createTopic(categoryId: number, title: string, content: string): Promise<any> {
    try {
      return await this.client.post(`/community/forums/categories/${categoryId}/topics`, {
        title,
        content
      });
    } catch (error) {
      console.error('[ForumService] Topic creation failed:', error);
      throw error;
    }
  }

  /**
   * Delete a topic by its ID.
   */
  async deleteTopic(topicId: number): Promise<void> {
    try {
      await this.client.delete(`/community/forums/topics/${topicId}`);
    } catch (error) {
      console.error(`[ForumService] Failed to delete topic ${topicId}:`, error);
      throw error;
    }
  }
}
