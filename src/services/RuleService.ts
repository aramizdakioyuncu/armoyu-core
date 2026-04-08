import { BaseService } from './BaseService';
import { Rule } from '../models/core/Rule';
import { HttpMethod } from '../api/ApiClient';

/**
 * Service for handling ARMOYU Rule-related API interactions.
 */
export class RuleService extends BaseService {
  /**
   * Universal method to call rule endpoints with standardized prefix.
   */
  async call<T>(path: string, method: HttpMethod = HttpMethod.GET, body?: any): Promise<T> {
    const normalizedPath = path.startsWith('/') ? path : '/' + path;
    
    // /0/0 represents the category/sub-path for bot rules
    const endpoint = `/0/0${normalizedPath}`;
    
    try {
      switch (method) {
        case HttpMethod.GET:
          return await this.client.get<T>(endpoint);
        case HttpMethod.POST:
          return await this.client.post<T>(endpoint, body);
        case HttpMethod.PUT:
          return await this.client.put<T>(endpoint, body);
        case HttpMethod.PATCH:
          return await this.client.patch<T>(endpoint, body);
        case HttpMethod.DELETE:
          return await this.client.delete<T>(endpoint);
        default:
          return await this.client.get<T>(endpoint);
      }
    } catch (error) {
      console.error(`[RuleService] Request to ${path} failed:`, error);
      throw error;
    }
  }

  /**
   * Fetches the list of rules for a specific bot/context.
   */
  async getRules(botId: string = '0'): Promise<Rule[]> {
    try {
      const response = await this.call<any>(`/kurallar/${botId}`, HttpMethod.POST);
      const rulesData = this.handleResponse<any[]>(response);
      
      if (Array.isArray(rulesData)) {
        return rulesData.map((r: any) => Rule.fromJSON(r));
      }
      return [];
    } catch (error) {
      console.error('[RuleService] getRules failed:', error);
      return [];
    }
  }

  /**
   * Create a new rule.
   */
  async createRule(botId: string = '0', text: string, penalty: string = ''): Promise<Rule> {
    const body = {
      kuralicerik: text,
      cezabaslangic: penalty
    };
    
    const response = await this.call<any>(`/kurallar/${botId}/ekle`, HttpMethod.POST, body);
    const result = this.handleResponse<any>(response);
    return Rule.fromJSON(result);
  }

  /**
   * Update an existing rule.
   */
  async updateRule(botId: string = '0', ruleId: number, data: Partial<Rule>): Promise<Rule> {
    const body: any = {};
    if (data.text) body.kuralicerik = data.text;
    if (data.penalty) body.cezabaslangic = data.penalty;
    
    const response = await this.call<any>(`/kurallar/${botId}/duzenle/${ruleId}`, HttpMethod.POST, body);
    const result = this.handleResponse<any>(response);
    return Rule.fromJSON(result);
  }

  /**
   * Delete a rule by its ID.
   */
  async deleteRule(botId: string = '0', ruleId: number): Promise<boolean> {
    const response = await this.call<any>(`/kurallar/${botId}/sil/${ruleId}`, HttpMethod.POST);
    const result = this.handleResponse<any>(response);
    return !!result;
  }
}
