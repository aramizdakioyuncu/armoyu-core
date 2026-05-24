import { ReelsResponse, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ReelsServiceV1 } from '../v1/ReelsServiceV1';
import { ReelsServiceV2, CreateReelParams } from '../v2/ReelsServiceV2';

export class ReelsService extends BaseService {
  private version: ReelsServiceV1 | ReelsServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new ReelsServiceV1(client, logger)
      : new ReelsServiceV2(client, logger);
  }

  async getReels(page: number = 1, limit: number = 10): Promise<ServiceResponse<ReelsResponse[]>> {
    return this.version.getReels(page, limit);
  }

  async createReel(params: CreateReelParams): Promise<ServiceResponse<ReelsResponse>> {
    return this.version.createReel(params);
  }

  async deleteReel(id: number): Promise<ServiceResponse<boolean>> {
    return this.version.deleteReel(id);
  }
}
