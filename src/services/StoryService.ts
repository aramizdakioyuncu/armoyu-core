import { StoryResponse, StoryUserResponse, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { StoryServiceV1, CreateStoryParams } from '../v1/StoryServiceV1';
import { StoryServiceV2 } from '../v2/StoryServiceV2';

export { CreateStoryParams };

export class StoryService extends BaseService {
  private version: StoryServiceV1 | StoryServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new StoryServiceV1(client, logger)
      : new StoryServiceV2(client, logger);
  }

  async getStories(page: number = 1, limit?: number): Promise<ServiceResponse<StoryResponse[]>> {
    return this.version.getStories(page, limit);
  }

  async getActiveStories(page: number = 1): Promise<ServiceResponse<StoryResponse[]>> {
    return this.version.getStories(page);
  }

  async addStory(mediaUrl: string, text?: string): Promise<ServiceResponse<boolean>> {
    return this.version.addStory(mediaUrl, text);
  }

  async createStory(params: CreateStoryParams): Promise<ServiceResponse<boolean>> {
    return this.version.createStory(params);
  }

  async deleteStory(storyId: number): Promise<ServiceResponse<boolean>> {
    return this.version.deleteStory(storyId);
  }

  async hideStory(storyId: number): Promise<ServiceResponse<boolean>> {
    return this.version.hideStory(storyId);
  }

  async getStoryViewers(page: number, storyId: string | number): Promise<ServiceResponse<StoryUserResponse[]>> {
    return this.version.getStoryViewers(page, storyId);
  }

  async viewStory(storyId: number): Promise<ServiceResponse<boolean>> {
    return this.version.viewStory(storyId);
  }

  async getStoryLikers(page: number, storyId: string | number): Promise<ServiceResponse<StoryUserResponse[]>> {
    return this.version.getStoryLikers(page, storyId);
  }

  async likeStory(storyId: number): Promise<ServiceResponse<boolean>> {
    return this.version.likeStory(storyId);
  }

  async unlikeStory(storyId: number): Promise<ServiceResponse<boolean>> {
    return this.version.unlikeStory(storyId);
  }
}
