import { BaseService } from '../services/BaseService';
import { PollResponse, ServiceResponse } from '../models';
import { PollMapper } from '../utils/mappers/social/PollMapper';

export class PollServiceV1 extends BaseService {
  async getPolls(page: number = 1, limit?: number, pollId?: number): Promise<ServiceResponse<PollResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) formData.append('limit', limit.toString());
      if (pollId !== undefined) formData.append('anketID', pollId.toString());

      const response = await this.client.post<any>('/0/0/anketler/liste/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(PollMapper.mapPollList(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[PollServiceV1] Failed to fetch polls:', error.message);
      return this.createError(error.message);
    }
  }

  async getPoll(_id: number): Promise<ServiceResponse<PollResponse>> {
    return this.createError('getPoll is not supported in V1');
  }

  async createPoll(_params: any): Promise<ServiceResponse<PollResponse>> {
    return this.createError('createPoll is not supported in V1');
  }

  async deletePoll(_id: number): Promise<ServiceResponse<boolean>> {
    return this.createError('deletePoll is not supported in V1');
  }

  async vote(pollId: number, optionId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('anketID', pollId.toString());
      formData.append('secenekID', optionId.toString());

      const response = await this.client.post<any>('/0/0/anketler/yanitla/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[PollServiceV1] Failed to vote on poll ${pollId}:`, error.message);
      return this.createError(error.message);
    }
  }
}
