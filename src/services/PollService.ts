import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { Poll } from '../models/social/poll/Poll';
import { ServiceResponse } from '../api/ServiceResponse';

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
   */
  async getPolls(page: number, limit?: number): Promise<ServiceResponse<Poll[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) {
        formData.append('limit', limit.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/anketler/liste/${page}/`), formData);
      const data = this.handleResponse<any[]>(response);
      const polls = Array.isArray(data) ? data.map(item => Poll.fromJSON(item)) : [];
      
      return this.createSuccess(polls, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[PollService] Failed to fetch polls:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Creates a new poll (Legacy).
   */
  async createPoll(params: { 
    question: string, 
    options: string[], 
    endDate: string, 
    target?: number | string 
  }): Promise<ServiceResponse<any>> {
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
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[PollService] Failed to create poll:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Answers a specific poll (Legacy).
   */
  async answerPoll(pollId: number | string, optionId: number | string): Promise<ServiceResponse<any>> {
    this.requireAuth();

    try {
      const formData = new FormData();
      formData.append('anketID', pollId.toString());
      formData.append('secenekID', optionId.toString());

      const url = this.resolveBotPath('/0/0/anketler/yanitla/0/');
      const response = await this.client.post<any>(url, formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[PollService] Failed to answer poll ${pollId}:`, error);
      return this.createError(error.message);
    }
  }
}
