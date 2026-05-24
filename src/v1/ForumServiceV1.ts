import { BaseService } from '../services/BaseService';
import { ForumCategory, ForumTopic, ServiceResponse } from '../models';
import { CreateTopicParams } from '../services/ForumService';

/**
 * Legacy V1 (OLD) implementation for ForumService.
 * V1 endpoints are not yet defined — all methods return an unsupported error.
 */
export class ForumServiceV1 extends BaseService {
  async getTopics(_page: number, _options?: { limit?: number; categoryId?: number }): Promise<ServiceResponse<ForumTopic[]>> {
    return this.createError('ForumService V1 is not supported.');
  }

  async getTopicDetail(_url: string): Promise<ServiceResponse<ForumTopic | null>> {
    return this.createError('ForumService V1 is not supported.');
  }

  async createTopic(_params: CreateTopicParams): Promise<ServiceResponse<ForumTopic>> {
    this.requireAuth();
    return this.createError('ForumService V1 is not supported.');
  }

  async deleteTopic(_topicId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    return this.createError('ForumService V1 is not supported.');
  }

  async getCategories(): Promise<ServiceResponse<ForumCategory[]>> {
    return this.createError('ForumService V1 is not supported.');
  }
}
