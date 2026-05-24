import { ServiceResponse, Workplace } from '../models';
import { WorkplaceType } from '../models/social/meta/WorkplaceEnums';
import { WorkplaceParams } from '../v2/WorkplaceServiceV2';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { WorkplaceServiceV1 } from '../v1/WorkplaceServiceV1';
import { WorkplaceServiceV2 } from '../v2/WorkplaceServiceV2';

/**
 * Service for managing workplaces (schools, cafes, restaurants, etc.).
 * Delegates requests to WorkplaceServiceV1 or WorkplaceServiceV2 based on ApiVersion.
 */
export class WorkplaceService extends BaseService {
  private version: WorkplaceServiceV1 | WorkplaceServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new WorkplaceServiceV1(client, logger)
      : new WorkplaceServiceV2(client, logger);
  }

  /**
   * List workplaces filtered by type. V1 returns an unsupported error.
   */
  async getWorkplaces(page: number = 1, limit?: number, type?: WorkplaceType): Promise<ServiceResponse<Workplace[]>> {
    return this.version.getWorkplaces(page, limit, type);
  }

  /**
   * Create a new workplace. V1 returns an unsupported error.
   */
  async createWorkplace(params: WorkplaceParams): Promise<ServiceResponse<Workplace>> {
    return this.version.createWorkplace(params);
  }

  /**
   * Update an existing workplace. V1 returns an unsupported error.
   */
  async updateWorkplace(workplaceId: number, params: Partial<WorkplaceParams>): Promise<ServiceResponse<Workplace>> {
    return this.version.updateWorkplace(workplaceId, params);
  }

  /**
   * Delete a workplace. V1 returns an unsupported error.
   */
  async deleteWorkplace(workplaceId: number): Promise<ServiceResponse<boolean>> {
    return this.version.deleteWorkplace(workplaceId);
  }
}
