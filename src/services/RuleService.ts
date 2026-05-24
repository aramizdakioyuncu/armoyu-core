import { RuleResponse, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { RuleServiceV1, RuleParams } from '../v1/RuleServiceV1';
import { RuleServiceV2 } from '../v2/RuleServiceV2';

export class RuleService extends BaseService {
  private version: RuleServiceV1 | RuleServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new RuleServiceV1(client, logger)
      : new RuleServiceV2(client, logger);
  }

  async getRules(page: number = 1, limit?: number): Promise<ServiceResponse<RuleResponse[]>> {
    if (this.version instanceof RuleServiceV1) {
      return this.version.getRules(page, limit);
    }
    return this.version.getRules(page);
  }

  async getRule(id: number): Promise<ServiceResponse<RuleResponse>> {
    return this.version.getRule(id);
  }

  async createRule(params: RuleParams): Promise<ServiceResponse<RuleResponse | boolean>> {
    return this.version.createRule(params);
  }

  async updateRule(id: number, params: RuleParams): Promise<ServiceResponse<RuleResponse>> {
    return this.version.updateRule(id, params);
  }

  async deleteRule(id: number): Promise<ServiceResponse<boolean>> {
    return this.version.deleteRule(id);
  }
}
