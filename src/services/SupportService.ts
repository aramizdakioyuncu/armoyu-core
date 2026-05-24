import { SupportTicket, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { SupportServiceV1 } from '../v1/SupportServiceV1';
import { SupportServiceV2 } from '../v2/SupportServiceV2';

export class SupportService extends BaseService {
  private version: SupportServiceV1 | SupportServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new SupportServiceV1(client, logger)
      : new SupportServiceV2(client, logger);
  }

  async getMyTickets(page: number = 1, limit?: number): Promise<ServiceResponse<SupportTicket[]>> {
    return this.version.getMyTickets(page, limit);
  }
}
