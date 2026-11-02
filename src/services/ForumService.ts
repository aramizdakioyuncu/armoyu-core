import { ForumCategory, ForumTopic, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ForumServiceV1 } from '../v1/ForumServiceV1';
import { ForumServiceV2 } from '../v2/ForumServiceV2';

export interface CreateTopicParams {
  title: string;
  type: string;
  categoryId: number;
  content: string;
  url?: string;
}

/**
 * Service for managing forum topics and categories.
 * Delegates requests to ForumServiceV1 or ForumServiceV2 based on ApiVersion.
 */
export class ForumService extends BaseService {
  private version: ForumServiceV1 | ForumServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new ForumServiceV1(client, logger)
      : new ForumServiceV2(client, logger);
  }

  async getTopics(page: number, options?: { limit?: number; categoryId?: number }): Promise<ServiceResponse<ForumTopic[]>> {
    return this.version.getTopics(page, options);
  }

  async getTopicDetail(url: string): Promise<ServiceResponse<ForumTopic | null>> {
    return this.version.getTopicDetail(url);
  }

  async createTopic(params: CreateTopicParams): Promise<ServiceResponse<ForumTopic>> {
    return this.version.createTopic(params);
  }

  async deleteTopic(topicId: number): Promise<ServiceResponse<boolean>> {
    return this.version.deleteTopic(topicId);
  }

  async getCategories(): Promise<ServiceResponse<ForumCategory[]>> {
    return this.version.getCategories();
  }

  async createReply(topicId: string, content: string): Promise<ServiceResponse<any>> {
    return this.usePreviousVersion
      ? this.createError('createReply is only available in V2')
      : (this.version as ForumServiceV2).createReply(topicId, content);
  }
}
