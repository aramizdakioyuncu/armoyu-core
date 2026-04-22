import { RuleResponse, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';

/**
 * Service for managing platform rules and information pages.
 */
export class RuleService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Get all listed platform rules.
   */
  async getRules(page: number = 1, limit?: number): Promise<ServiceResponse<RuleResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) formData.append('limit', limit.toString());

      const response = await this.client.post<any>('/0/0/kurallar/liste/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(data || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[RuleService] Failed to fetch rules:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Create a new platform rule.
   */
  async createRule(text: string, penalty: string): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('metin', text);
      formData.append('ceza', penalty);

      const response = await this.client.post<any>('/0/0/kurallar/ekle/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[RuleService] Failed to create rule:', error);
      return this.createError(error.message);
    }
  }
}

