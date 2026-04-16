import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ServiceResponse } from '../api/ServiceResponse';

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
   */
  async getStories(page: number, limit?: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) {
        formData.append('limit', limit.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/hikaye/${page}/${limit || 0}/`), formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[StoryService] Fetching stories failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Adds a new story (Legacy).
   */
  async addStory(mediaUrl: string): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('hikayemedya', mediaUrl);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/hikaye/ekle/0/'), formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[StoryService] Adding story failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Deletes a story (Legacy).
   */
  async deleteStory(storyId: number | string): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/hikaye/sil/0/'), formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StoryService] Deleting story ${storyId} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Hides a story (Legacy).
   */
  async hideStory(storyId: number | string): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/hikaye/gizle/0/'), formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StoryService] Hiding story ${storyId} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Marks a story as viewed (Legacy).
   */
  async viewStory(storyId: number | string): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/hikaye/bak/0/'), formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StoryService] Viewing story ${storyId} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the viewers of a story (Legacy).
   */
  async getStoryViewers(page: number, storyId: number | string, limit?: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());
      formData.append('sayfa', page.toString());
      if (limit !== undefined) {
        formData.append('limit', limit.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/hikaye/goruntuleyenler/${page}/`), formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StoryService] Fetching story viewers for ${storyId} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the users who liked a story (Legacy).
   */
  async getStoryLikers(page: number, storyId: number | string, limit?: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());
      formData.append('sayfa', page.toString());
      if (limit !== undefined) {
        formData.append('limit', limit.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/hikaye/begenenler/${page}/`), formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StoryService] Fetching story likers for ${storyId} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Adds a like to a story (Legacy).
   */
  async addLike(storyId: number | string): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/hikaye/begeni-ekle/0/'), formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StoryService] Adding like to story ${storyId} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Removes a like from a story (Legacy).
   */
  async removeLike(storyId: number | string): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/hikaye/begeni-sil/0/'), formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StoryService] Removing like from story ${storyId} failed:`, error);
      return this.createError(error.message);
    }
  }
}



