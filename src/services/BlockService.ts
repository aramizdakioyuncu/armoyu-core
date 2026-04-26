import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ServiceResponse } from '../api/ServiceResponse';
import { BlockedUserResponse, BlockedUser } from '../models';
import { UserMapper } from '../utils/mappers/user/UserMapper';

/**
 * Service for managing user blocks and blacklists.
 */
export class BlockService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Get all blocked users.
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
      this.logger.error('[BlockService] Failed to fetch blocked users:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Block a user.
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
      this.logger.error(`[BlockService] Failed to block user ${userId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Unblock a user.
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
      this.logger.error(`[BlockService] Failed to unblock user ${userId}:`, error);
      return this.createError(error.message);
    }
  }
}

