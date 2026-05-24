import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ServiceResponse } from '../api/ServiceResponse';
import { StaffUser } from '../models';
import { StaffServiceV1 } from '../v1/StaffServiceV1';
import { StaffServiceV2 } from '../v2/StaffServiceV2';

export class StaffService extends BaseService {
  private version: StaffServiceV1 | StaffServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new StaffServiceV1(client, logger)
      : new StaffServiceV2(client, logger);
  }

  async getStaff(page: number = 1, category?: string, limit?: number): Promise<ServiceResponse<StaffUser[]>> {
    return this.version.getStaff(page, category, limit);
  }

  async getStaffList(page: number = 1): Promise<ServiceResponse<StaffUser[]>> {
    return this.version.getStaff(page);
  }

  async getApplications(page: number = 1, limit?: number): Promise<ServiceResponse<any[]>> {
    return this.version.getApplications(page, limit);
  }
}
