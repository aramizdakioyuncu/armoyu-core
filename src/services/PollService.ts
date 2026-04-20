import { PollResponse, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { PollMapper } from '../utils/mappers';

/**
 * Service for platform-wide polling and user surveys.
 */
export class PollService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Get all active and archived polls.
   */
  async getPolls(page: number = 1, limit?: number, pollId?: number): Promise<ServiceResponse<PollResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) formData.append('limit', limit.toString());
      if (pollId !== undefined) formData.append('anketID', pollId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/anketler/liste/0/'), formData);
      const icerik = this.handle<any[]>(response);
      const mapped = PollMapper.mapPollList(icerik || []);
      
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[PollService] Failed to fetch polls:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Vote on a specific poll option.
   */
  async vote(pollId: number, optionId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('anketID', pollId.toString());
      formData.append('secenekID', optionId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/anketler/oykullan/0/'), formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[PollService] Failed to vote on poll ${pollId}:`, error);
      return this.createError(error.message);
    }
  }
}
