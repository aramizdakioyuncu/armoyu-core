import { BaseService } from '../services/BaseService';
import { ReelsResponse, ServiceResponse } from '../models';
import { ReelsMapper } from '../utils/mappers/content/ReelsMapper';

export class ReelsServiceV1 extends BaseService {
  async getReels(page: number = 1, limit: number = 10): Promise<ServiceResponse<ReelsResponse[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      formData.append('limit', limit.toString());

      const response = await this.client.post<any>('/0/0/reels/0/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(ReelsMapper.mapReelsList(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ReelsServiceV1] Failed to fetch reels:', error.message);
      return this.createError(error.message);
    }
  }

  async createReel(_params: any): Promise<ServiceResponse<ReelsResponse>> {
    return this.createError('createReel is not supported in V1');
  }

  async deleteReel(_id: number): Promise<ServiceResponse<boolean>> {
    return this.createError('deleteReel is not supported in V1');
  }
}
