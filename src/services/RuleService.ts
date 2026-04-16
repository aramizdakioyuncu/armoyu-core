import { BaseService } from './BaseService';
import { Rule } from '../models/core/Rule';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ServiceResponse } from '../api/ServiceResponse';

/**
 * Service for handling ARMOYU Rule-related API interactions.
 * @checked 2026-04-12
 */
export class RuleService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Fetches the list of rules for a specific bot/context.
   */
  async getRules(botId: string = '0'): Promise<ServiceResponse<Rule[]>> {
    try {
      const url = this.resolveBotPath(`/0/0/kurallar/${botId}`);
      const response = await this.client.post<any>(url);
      const rulesData = this.handle<any[]>(response);
      
      return this.createSuccess(rulesData || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[RuleService] getRules failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Create a new rule.
   */
  async createRule(botId: string = '0', text: string, penalty: string = ''): Promise<ServiceResponse<Rule>> {
    this.requireAuth();
    try {
      const body = {
        kuralicerik: text,
        cezabaslangic: penalty
      };
      
      const url = this.resolveBotPath(`/0/0/kurallar/${botId}/ekle`);
      const response = await this.client.post<any>(url, body);
      const result = this.handle<any>(response);
      return this.createSuccess(result || null, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[RuleService] createRule failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Update an existing rule.
   */
  async updateRule(botId: string = '0', ruleId: number, data: Partial<Rule>): Promise<ServiceResponse<Rule>> {
    this.requireAuth();
    try {
      const body: any = {};
      if (data) Object.assign(body, data);
      
      const url = this.resolveBotPath(`/0/0/kurallar/${botId}/duzenle/${ruleId}`);
      const response = await this.client.post<any>(url, body);
      const result = this.handle<any>(response);
      return this.createSuccess(result || null, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[RuleService] updateRule failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Delete a rule by its ID.
   */
  async deleteRule(botId: string = '0', ruleId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const url = this.resolveBotPath(`/0/0/kurallar/${botId}/sil/${ruleId}`);
      const response = await this.client.post<any>(url);
      const result = this.handle<any>(response);
      return this.createSuccess(!!result, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[RuleService] deleteRule failed:', error);
      return this.createError(error.message);
    }
  }
}



