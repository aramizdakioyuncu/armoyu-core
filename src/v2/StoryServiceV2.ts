import { BaseService } from '../services/BaseService';
import { StoryResponse, StoryUserResponse, ServiceResponse } from '../models';
import { StoryMapper } from '../utils/mappers/social/StoryMapper';
import { CreateStoryParams } from '../v1/StoryServiceV1';

export class StoryServiceV2 extends BaseService {
  async getStories(page: number = 1, limit?: number): Promise<ServiceResponse<StoryResponse[]>> {
    try {
      let url = `/v1/hikayeler?page=${page}`;
      if (limit) url += `&limit=${limit}`;
      const response = await this.client.get<any>(url);
      const data = this.handle<any[]>(response);
      return this.createSuccess(StoryMapper.mapStoryList(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[StoryServiceV2] Failed to fetch stories:', error.message);
      return this.createError(error.message);
    }
  }

  async createStory(params: CreateStoryParams): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const body: any = { media_id: params.mediaId };
      if (params.text) body.text = params.text;
      const response = await this.client.post<any>('/v1/hikayeler', body);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[StoryServiceV2] Failed to create story:', error.message);
      return this.createError(error.message);
    }
  }

  async addStory(_mediaUrl: string, _text?: string): Promise<ServiceResponse<boolean>> {
    return this.createError('addStory is not supported in V2 — use createStory() with a media_id instead');
  }

  async deleteStory(storyId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.delete<any>(`/v1/hikayeler/${storyId}`);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StoryServiceV2] Failed to delete story ${storyId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async hideStory(_storyId: number): Promise<ServiceResponse<boolean>> {
    return this.createError('hideStory is not supported in V2 yet');
  }

  async getStoryViewers(page: number, storyId: string | number): Promise<ServiceResponse<StoryUserResponse[]>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>(`/v1/hikayeler/view/${storyId}?page=${page}`);
      const data = this.handle<any[]>(response);
      return this.createSuccess(StoryMapper.mapStoryUserList(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StoryServiceV2] Failed to fetch story viewers for ${storyId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async viewStory(storyId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>(`/v1/hikayeler/view/${storyId}`, {});
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StoryServiceV2] Failed to view story ${storyId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async getStoryLikers(page: number, storyId: string | number): Promise<ServiceResponse<StoryUserResponse[]>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>(`/v1/hikayeler/begen/${storyId}?page=${page}`);
      const data = this.handle<any[]>(response);
      return this.createSuccess(StoryMapper.mapStoryUserList(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StoryServiceV2] Failed to fetch story likers for ${storyId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async likeStory(storyId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>(`/v1/hikayeler/begen/${storyId}`, {});
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StoryServiceV2] Failed to like story ${storyId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async unlikeStory(storyId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.delete<any>(`/v1/hikayeler/begen/${storyId}`);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StoryServiceV2] Failed to unlike story ${storyId}:`, error.message);
      return this.createError(error.message);
    }
  }
}
