import { BaseService } from './BaseService';
import { ManagementUser, ManagementMeeting, ServiceResponse } from '../models';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ManagementServiceV1 } from '../v1/ManagementServiceV1';
import { ManagementServiceV2 } from '../v2/ManagementServiceV2';

export class ManagementService extends BaseService {
  private version: ManagementServiceV1 | ManagementServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new ManagementServiceV1(client, logger)
      : new ManagementServiceV2(client, logger);
  }

  async getUsers(): Promise<ServiceResponse<ManagementUser[]>> {
    return this.version.getUsers();
  }

  async getMeetings(): Promise<ServiceResponse<ManagementMeeting[]>> {
    return this.version.getMeetings();
  }
}
