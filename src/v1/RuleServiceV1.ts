import { BaseService } from '../services/BaseService';
import { RuleResponse, ServiceResponse } from '../models';
import { RuleMapper } from '../utils/mappers/core/RuleMapper';

export interface RuleParams {
  content: string;
  penalty: number | string;
  submadde?: string | null;
}

export class RuleServiceV1 extends BaseService {
  async getRules(page: number = 1, limit?: number): Promise<ServiceResponse<RuleResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) formData.append('limit', limit.toString());

      const response = await this.client.post<any>('/0/0/kurallar/liste/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(RuleMapper.mapRuleList(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[RuleServiceV1] Failed to fetch rules:', error.message);
      return this.createError(error.message);
    }
  }

  async getRule(_id: number): Promise<ServiceResponse<RuleResponse>> {
    return this.createError('getRule is not supported in V1');
  }

  async createRule(params: RuleParams): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('metin', params.content);
      formData.append('ceza', params.penalty.toString());

      const response = await this.client.post<any>('/0/0/kurallar/ekle/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[RuleServiceV1] Failed to create rule:', error.message);
      return this.createError(error.message);
    }
  }

  async updateRule(_id: number, _params: RuleParams): Promise<ServiceResponse<RuleResponse>> {
    return this.createError('updateRule is not supported in V1');
  }

  async deleteRule(_id: number): Promise<ServiceResponse<boolean>> {
    return this.createError('deleteRule is not supported in V1');
  }
}
