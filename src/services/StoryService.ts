import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';

/**
 * Service for managing user stories (Legacy).
 * @checked 2026-04-12
 */
export class StoryService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Fetches stories (Legacy).
   * 
   * @param page The page number (sayfa) - MANDATORY
   * @param limit Results limit
   */
  async getStories(page: number, limit?: number): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) {
        formData.append('limit', limit.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/hikaye/0/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error('[StoryService] Fetching stories failed:', error);
      return null;
    }
  }

  /**
   * Adds a new story (Legacy).
   * 
   * @param mediaUrl The URL of the story media
   */
  async addStory(mediaUrl: string): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('hikayemedya', mediaUrl);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/hikaye/ekle/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error('[StoryService] Adding story failed:', error);
      return null;
    }
  }

  /**
   * Deletes a story (Legacy).
   * 
   * @param storyId The ID of the story to delete
   */
  async deleteStory(storyId: number | string): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/hikaye/sil/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[StoryService] Deleting story ${storyId} failed:`, error);
      return null;
    }
  }

  /**
   * Hides a story (Legacy).
   * 
   * @param storyId The ID of the story to hide
   */
  async hideStory(storyId: number | string): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/hikaye/gizle/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[StoryService] Hiding story ${storyId} failed:`, error);
      return null;
    }
  }

  /**
   * Marks a story as viewed (Legacy).
   * 
   * @param storyId The ID of the story viewed
   */
  async viewStory(storyId: number | string): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/hikaye/bak/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[StoryService] Viewing story ${storyId} failed:`, error);
      return null;
    }
  }

  /**
   * Fetches the viewers of a story (Legacy).
   * 
   * @param page The page number (sayfa) - MANDATORY
   * @param storyId The ID of the story
   * @param limit Results limit
   */
  async getStoryViewers(page: number, storyId: number | string, limit?: number): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());
      formData.append('sayfa', page.toString());
      if (limit !== undefined) {
        formData.append('limit', limit.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/hikaye/goruntuleyenler/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[StoryService] Fetching story viewers for ${storyId} failed:`, error);
      return null;
    }
  }

  /**
   * Fetches the users who liked a story (Legacy).
   * 
   * @param page The page number (sayfa) - MANDATORY
   * @param storyId The ID of the story
   * @param limit Results limit
   */
  async getStoryLikers(page: number, storyId: number | string, limit?: number): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());
      formData.append('sayfa', page.toString());
      if (limit !== undefined) {
        formData.append('limit', limit.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/hikaye/begenenler/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[StoryService] Fetching story likers for ${storyId} failed:`, error);
      return null;
    }
  }

  /**
   * Adds a like to a story (Legacy).
   * 
   * @param storyId The ID of the story to like
   */
  async addLike(storyId: number | string): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/hikaye/begeni-ekle/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[StoryService] Adding like to story ${storyId} failed:`, error);
      return null;
    }
  }

  /**
   * Removes a like from a story (Legacy).
   * 
   * @param storyId The ID of the story
   */
  async removeLike(storyId: number | string): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/hikaye/begeni-sil/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[StoryService] Removing like from story ${storyId} failed:`, error);
      return null;
    }
  }
}
