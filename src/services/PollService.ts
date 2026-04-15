import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { Poll } from '../models/social/Poll';

/**
 * Service for managing platform polls and surveys (Legacy).
 * @checked 2026-04-12
 */
export class PollService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Fetches the list of polls (Legacy).
   * 
   * @param page The page number (sayfa)
   * @param limit Optional results limit
   * @returns List of polls
   */
  async getPolls(page: number, limit?: number): Promise<Poll[]> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) {
        formData.append('limit', limit.toString());
      }

      const url = this.resolveBotPath('/0/0/anketler/liste/0/');
      const response = await this.client.post<any>(url, formData);
      const data = this.handleResponse<any[]>(response);
      
      return Array.isArray(data) ? data.map(item => Poll.fromJSON(item)) : [];
    } catch (error) {
      this.logger.error('[PollService] Failed to fetch polls:', error);
      return [];
    }
  }

  /**
   * Creates a new poll (Legacy).
   * 
   * @param params Poll parameters (question, options, endDate, target)
   */
  async createPoll(params: { 
    question: string, 
    options: string[], 
    endDate: string, 
    target?: number | string 
  }): Promise<any> {
    this.requireAuth();

    try {
      const formData = new FormData();
      formData.append('anketsoru', params.question);
      formData.append('bitiszaman', params.endDate);
      formData.append('kime', params.target?.toString() || '0');
      
      params.options.forEach(option => {
        formData.append('secenekler[]', option);
      });

      const url = this.resolveBotPath('/0/0/anketler/olustur/0/');
      const response = await this.client.post<any>(url, formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error('[PollService] Failed to create poll:', error);
      return null;
    }
  }

  /**
   * Answers a specific poll (Legacy).
   * 
   * @param pollId The ID of the poll
   * @param optionId The ID of the selected option
   */
  async answerPoll(pollId: number | string, optionId: number | string): Promise<any> {
    this.requireAuth();

    try {
      const formData = new FormData();
      formData.append('anketID', pollId.toString());
      formData.append('secenekID', optionId.toString());

      const url = this.resolveBotPath('/0/0/anketler/yanitla/0/');
      const response = await this.client.post<any>(url, formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[PollService] Failed to answer poll ${pollId}:`, error);
      return null;
    }
  }
}
