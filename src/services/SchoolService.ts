import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ServiceResponse } from '../api/ServiceResponse';
import { SchoolServiceV1 } from '../v1/SchoolServiceV1';
import { SchoolServiceV2 } from '../v2/SchoolServiceV2';

export class SchoolService extends BaseService {
  private version: SchoolServiceV1 | SchoolServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new SchoolServiceV1(client, logger)
      : new SchoolServiceV2(client, logger);
  }

  async getUserSchools(page: number, limit?: number, userId?: number): Promise<ServiceResponse<any[]>> {
    return this.version.getUserSchools(page, limit, userId);
  }
}
