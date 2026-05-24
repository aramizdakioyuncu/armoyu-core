import { BaseService } from '../services/BaseService';
import { PollResponse, ServiceResponse } from '../models';
import { PollMapper } from '../utils/mappers/social/PollMapper';

export interface CreatePollParams {
  question: string;
  options: string[];
  endDate: string;
  media?: string[];
}

export class PollServiceV2 extends BaseService {
  async getPolls(page: number = 1): Promise<ServiceResponse<PollResponse[]>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>(`/v1/surveys?page=${page}`);
      const data = this.handle<any[]>(response);
      return this.createSuccess(PollMapper.mapPollList(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[PollServiceV2] Failed to fetch polls:', error.message);
      return this.createError(error.message);
    }
  }

  async getPoll(id: number): Promise<ServiceResponse<PollResponse>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>(`/v1/surveys/${id}`);
      const data = this.handle<any>(response);
      return this.createSuccess(PollMapper.mapPoll(data), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[PollServiceV2] Failed to fetch poll ${id}:`, error.message);
      return this.createError(error.message);
    }
  }

  async createPoll(params: CreatePollParams): Promise<ServiceResponse<PollResponse>> {
    this.requireAuth();
    try {
      const body: any = {
        survey_question: params.question,
        survey_options: params.options,
        survey_enddate: params.endDate,
      };
      if (params.media && params.media.length > 0) {
        body.survey_media = params.media;
      }
      const response = await this.client.post<any>('/v1/surveys', body);
      const data = this.handle<any>(response);
      return this.createSuccess(PollMapper.mapPoll(data), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[PollServiceV2] Failed to create poll:', error.message);
      return this.createError(error.message);
    }
  }

  async deletePoll(id: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.delete<any>(`/v1/surveys/${id}`);
      this.handle<any>(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[PollServiceV2] Failed to delete poll ${id}:`, error.message);
      return this.createError(error.message);
    }
  }

  async vote(pollId: number, optionId: number): Promise<ServiceResponse<PollResponse>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>(`/v1/surveys/${pollId}/vote`, { option_ID: optionId });
      const data = this.handle<any>(response);
      return this.createSuccess(PollMapper.mapPoll(data), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[PollServiceV2] Failed to vote on poll ${pollId}:`, error.message);
      return this.createError(error.message);
    }
  }
}
