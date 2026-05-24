import { BaseService } from '../services/BaseService';
import { ReelsResponse, ServiceResponse } from '../models';
import { ReelsMapper } from '../utils/mappers/content/ReelsMapper';

export interface CreateReelParams {
  description: string;
  mediaId: number;
  mediaHigh: string;
  mediaNorm: string;
  mediaMin: string;
}

export class ReelsServiceV2 extends BaseService {
  async getReels(page: number = 1, limit: number = 10): Promise<ServiceResponse<ReelsResponse[]>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>(`/v1/reels?page=${page}&limit=${limit}`);
      const data = this.handle<any[]>(response);
      return this.createSuccess(ReelsMapper.mapReelsListV2(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ReelsServiceV2] Failed to fetch reels:', error.message);
      return this.createError(error.message);
    }
  }

  async createReel(params: CreateReelParams): Promise<ServiceResponse<ReelsResponse>> {
    this.requireAuth();
    try {
      const body = {
        description: params.description,
        media_id: params.mediaId,
        media_high: params.mediaHigh,
        media_norm: params.mediaNorm,
        media_min: params.mediaMin
      };
      const response = await this.client.post<any>('/v1/reels', body);
      const data = this.handle<any>(response);
      return this.createSuccess(ReelsMapper.mapReelsItemV2(data), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ReelsServiceV2] Failed to create reel:', error.message);
      return this.createError(error.message);
    }
  }

  async deleteReel(id: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.delete<any>(`/v1/reels/${id}`);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ReelsServiceV2] Failed to delete reel ${id}:`, error.message);
      return this.createError(error.message);
    }
  }
}
