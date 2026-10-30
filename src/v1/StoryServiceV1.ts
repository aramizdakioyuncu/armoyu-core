import { BaseService } from '../services/BaseService';
import { StoryResponse, StoryUserResponse, ServiceResponse } from '../models';
import { StoryMapper } from '../utils/mappers/social/StoryMapper';

export interface CreateStoryParams {
  mediaId: number;
  text?: string;
}

export class StoryServiceV1 extends BaseService {
  async getStories(page: number = 1, limit?: number): Promise<ServiceResponse<StoryResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit) formData.append('limit', limit.toString());
      const response = await this.client.post<any>('/0/0/hikaye/0/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(StoryMapper.mapStoryList(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[StoryServiceV1] Failed to fetch stories:', error.message);
      return this.createError(error.message);
    }
  }

  async uploadStory(_file: File, _text?: string): Promise<ServiceResponse<boolean>> {
    return this.createError('uploadStory is only available in V2');
  }

  async addStory(mediaUrl: string, text?: string): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('hikayemedya', mediaUrl);
      if (text) formData.append('hikayemetin', text);
      const response = await this.client.post<any>('/0/0/hikaye/ekle/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[StoryServiceV1] Failed to add story:', error.message);
      return this.createError(error.message);
    }
  }

  async createStory(_params: CreateStoryParams): Promise<ServiceResponse<boolean>> {
    return this.createError('createStory is not supported in V1 — use addStory() instead');
  }

  async deleteStory(storyId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());
      const response = await this.client.post<any>('/0/0/hikaye/sil/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StoryServiceV1] Failed to delete story ${storyId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async hideStory(storyId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());
      const response = await this.client.post<any>('/0/0/hikaye/gizle/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StoryServiceV1] Failed to hide story ${storyId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async getStoryViewers(page: number, storyId: string | number): Promise<ServiceResponse<StoryUserResponse[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      formData.append('hikayeID', storyId.toString());
      const response = await this.client.post<any>('/0/0/hikaye/goruntuleyenler/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(Array.isArray(data) ? data : [], response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StoryServiceV1] Failed to fetch story viewers for ${storyId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async viewStory(storyId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());
      const response = await this.client.post<any>('/0/0/hikaye/bak/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StoryServiceV1] Failed to view story ${storyId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async getStoryLikers(page: number, storyId: string | number): Promise<ServiceResponse<StoryUserResponse[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      formData.append('hikayeID', storyId.toString());
      const response = await this.client.post<any>('/0/0/hikaye/begenenler/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(Array.isArray(data) ? data : [], response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StoryServiceV1] Failed to fetch story likers for ${storyId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async likeStory(storyId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());
      const response = await this.client.post<any>('/0/0/hikaye/begeni-ekle/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StoryServiceV1] Failed to like story ${storyId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async unlikeStory(storyId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());
      const response = await this.client.post<any>('/0/0/hikaye/begeni-sil/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StoryServiceV1] Failed to unlike story ${storyId}:`, error.message);
      return this.createError(error.message);
    }
  }
}
