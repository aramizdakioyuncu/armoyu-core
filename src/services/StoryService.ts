import { StoryResponse, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { StoryMapper } from '../utils/mappers/social/StoryMapper';

/**
 * Service for managing user stories and ephemeral content.
 */
export class StoryService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Get all active stories.
   */
  async getStories(page: number = 1, limit?: number): Promise<ServiceResponse<StoryResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit) formData.append('limit', limit.toString());

      const response = await this.client.post<any>('/0/0/hikaye/0/0/', formData);
      const data = this.handle<any[]>(response);
      const mapped = StoryMapper.mapStoryList(data || []);
      
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[StoryService] Failed to fetch active stories:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Alias for getStories for compatibility.
   */
  async getActiveStories(page: number = 1): Promise<ServiceResponse<StoryResponse[]>> {
    return this.getStories(page);
  }

  /**
   * Get list of users who viewed a story.
   */
  async getStoryViewers(page: number, storyId: string | number): Promise<ServiceResponse<any[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      formData.append('hikayeID', storyId.toString());
      const response = await this.client.post<any>('/0/0/hikaye/bakanlar/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(Array.isArray(data) ? data : [], response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StoryService] Failed to fetch story viewers for ${storyId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Get list of users who liked a story.
   */
  async getStoryLikers(page: number, storyId: string | number): Promise<ServiceResponse<any[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      formData.append('hikayeID', storyId.toString());
      const response = await this.client.post<any>('/0/0/hikaye/beğenenler/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(Array.isArray(data) ? data : [], response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StoryService] Failed to fetch story likers for ${storyId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Add a new story.
   */
  async addStory(mediaUrl: string): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('hikayemedya', mediaUrl);

      const response = await this.client.post<any>('/0/0/hikaye/ekle/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[StoryService] Failed to add story:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Delete a story.
   */
  async deleteStory(storyId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());

      const response = await this.client.post<any>('/0/0/hikaye/sil/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StoryService] Failed to delete story ${storyId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Hide a story from feed.
   */
  async hideStory(storyId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());

      const response = await this.client.post<any>('/0/0/hikaye/gizle/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StoryService] Failed to hide story ${storyId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Mark a story as viewed.
   */
  async viewStory(storyId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());

      const response = await this.client.post<any>('/0/0/hikaye/bak/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StoryService] Failed to view story ${storyId}:`, error);
      return this.createError(error.message);
    }
  }
}

