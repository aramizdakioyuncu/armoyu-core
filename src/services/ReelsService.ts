import { ReelsResponse, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ReelsMapper } from '../utils/mappers';

/**
 * Service for Reels content.
 */
export class ReelsService extends BaseService {
  /**
   * Get list of Reels.
   * @param page Page number
   * @param limit Items per page
   * @returns List of reels
   */
  async getReels(page: number = 1, limit: number = 10): Promise<ServiceResponse<ReelsResponse[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      formData.append('limit', limit.toString());

      const response = await this.client.post<any>('/0/0/reels/0/0/', formData);
      const icerik = this.handle<any[]>(response);
      const mapped = ReelsMapper.mapReelsList(icerik);

      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ReelsService] Failed to fetch reels:', error);
      return this.createError(error.message);
    }
  }
}

