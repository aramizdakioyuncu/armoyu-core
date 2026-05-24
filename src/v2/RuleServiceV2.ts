import { BaseService } from '../services/BaseService';
import { RuleResponse, ServiceResponse } from '../models';
import { RuleMapper } from '../utils/mappers/core/RuleMapper';
import { RuleParams } from '../v1/RuleServiceV1';

export class RuleServiceV2 extends BaseService {
  async getRules(page: number = 1): Promise<ServiceResponse<RuleResponse[]>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>(`/v1/rules?page=${page}`);
      const data = this.handle<any[]>(response);
      return this.createSuccess(RuleMapper.mapRuleList(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[RuleServiceV2] Failed to fetch rules:', error.message);
      return this.createError(error.message);
    }
  }

  async getRule(id: number): Promise<ServiceResponse<RuleResponse>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>(`/v1/rules/${id}`);
      const data = this.handle<any>(response);
      return this.createSuccess(RuleMapper.mapRuleV2(data), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[RuleServiceV2] Failed to fetch rule ${id}:`, error.message);
      return this.createError(error.message);
    }
  }

  async createRule(params: RuleParams): Promise<ServiceResponse<RuleResponse>> {
    this.requireAuth();
    try {
      const body: any = { content: params.content, penalty: Number(params.penalty) };
      if (params.submadde !== undefined) body.submadde = params.submadde;

      const response = await this.client.post<any>('/v1/rules', body);
      const data = this.handle<any>(response);
      return this.createSuccess(RuleMapper.mapRuleV2(data), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[RuleServiceV2] Failed to create rule:', error.message);
      return this.createError(error.message);
    }
  }

  async updateRule(id: number, params: RuleParams): Promise<ServiceResponse<RuleResponse>> {
    this.requireAuth();
    try {
      const body: any = { content: params.content, penalty: Number(params.penalty) };
      if (params.submadde !== undefined) body.submadde = params.submadde;

      const response = await this.client.put<any>(`/v1/rules/${id}`, body);
      const data = this.handle<any>(response);
      return this.createSuccess(RuleMapper.mapRuleV2(data), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[RuleServiceV2] Failed to update rule ${id}:`, error.message);
      return this.createError(error.message);
    }
  }

  async deleteRule(id: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.delete<any>(`/v1/rules/${id}`);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[RuleServiceV2] Failed to delete rule ${id}:`, error.message);
      return this.createError(error.message);
    }
  }
}
