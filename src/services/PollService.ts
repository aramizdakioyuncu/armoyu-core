import { PollResponse, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { PollServiceV1 } from '../v1/PollServiceV1';
import { PollServiceV2, CreatePollParams } from '../v2/PollServiceV2';

export class PollService extends BaseService {
  private version: PollServiceV1 | PollServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new PollServiceV1(client, logger)
      : new PollServiceV2(client, logger);
  }

  async getPolls(page: number = 1, limit?: number, pollId?: number): Promise<ServiceResponse<PollResponse[]>> {
    if (this.version instanceof PollServiceV1) {
      return this.version.getPolls(page, limit, pollId);
    }
    return this.version.getPolls(page);
  }

  async getPoll(id: number): Promise<ServiceResponse<PollResponse>> {
    return this.version.getPoll(id);
  }

  async createPoll(params: CreatePollParams): Promise<ServiceResponse<PollResponse>> {
    return this.version.createPoll(params);
  }

  async deletePoll(id: number): Promise<ServiceResponse<boolean>> {
    return this.version.deletePoll(id);
  }

  async vote(pollId: number, optionId: number): Promise<ServiceResponse<PollResponse | boolean>> {
    return this.version.vote(pollId, optionId);
  }
}
