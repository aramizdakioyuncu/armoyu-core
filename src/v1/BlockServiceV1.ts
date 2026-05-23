import { BaseService } from '../services/BaseService';
import { ServiceResponse } from '../models';
import { BlockedUser } from '../models';
import { UserMapper } from '../utils/mappers/user/UserMapper';

/**
 * Legacy V1 (OLD) implementation for BlockService.
 */
export class BlockServiceV1 extends BaseService {
  /**
   * Get all blocked users (V1).
   */
  async getBlockedUsers(page: number = 1, limit?: number): Promise<ServiceResponse<BlockedUser[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit) formData.append('limit', limit.toString());

      const response = await this.client.post<any>('/0/0/engel/0/0/', formData);
      const data = this.handle<any>(response);
      const mapped = UserMapper.mapBlockedList(data || []);

      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[BlockServiceV1] Failed to fetch blocked users:', error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Block a user (V1).
   */
  async blockUser(userId: string | number): Promise<ServiceResponse<boolean>> {
    try {
      this.requireAuth();
      const formData = new FormData();
      formData.append('userID', userId.toString());

      const response = await this.client.post<any>('/0/0/engel/ekle/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[BlockServiceV1] Failed to block user ${userId}:`, error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Unblock a user (V1).
   */
  async unblockUser(userId: string | number): Promise<ServiceResponse<boolean>> {
    try {
      this.requireAuth();
      const formData = new FormData();
      formData.append('userID', userId.toString());

      const response = await this.client.post<any>('/0/0/engel/sil/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[BlockServiceV1] Failed to unblock user ${userId}:`, error.message);
      return this.createError(error.message);
    }
  }
}
