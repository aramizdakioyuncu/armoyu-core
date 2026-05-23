import { BaseService } from '../services/BaseService';
import { ServiceResponse, BlockedUser } from '../models';

/**
 * Modern V2 (CURRENT) implementation for BlockService.
 *
 * Endpoints:
 *   GET    /v1/profile/blocks          → list blocked users
 *   POST   /v1/profile/block/{userId}  → block a user
 *   DELETE /v1/profile/block/{userId}  → unblock a user
 */
export class BlockServiceV2 extends BaseService {
  /**
   * Get all blocked users (V2).
   */
  async getBlockedUsers(page: number = 1, limit?: number): Promise<ServiceResponse<BlockedUser[]>> {
    try {
      this.requireAuth();
      const params: Record<string, string> = { page: page.toString() };
      if (limit) params['limit'] = limit.toString();

      const query = new URLSearchParams(params).toString();
      const response = await this.client.get<any>(`/v1/profile/blocks?${query}`);
      const data = this.handle<any[]>(response);

      const mapped: BlockedUser[] = (data || []).map((raw: any) => new BlockedUser({
        blockId: raw['#'] ?? 0,
        userId: Number(raw.user_id) || 0,
        username: raw.user_login || '',
        displayName: raw.display_name || '',
        avatar: raw.avatar || '',
        blockDate: raw.blocked_at || ''
      }));

      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[BlockServiceV2] Failed to fetch blocked users:', error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Block a user (V2).
   */
  async blockUser(userId: string | number): Promise<ServiceResponse<boolean>> {
    try {
      this.requireAuth();
      const response = await this.client.post<any>(`/v1/profile/block/${userId}`);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[BlockServiceV2] Failed to block user ${userId}:`, error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Unblock a user (V2).
   */
  async unblockUser(userId: string | number): Promise<ServiceResponse<boolean>> {
    try {
      this.requireAuth();
      const response = await this.client.delete<any>(`/v1/profile/block/${userId}`);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[BlockServiceV2] Failed to unblock user ${userId}:`, error.message);
      return this.createError(error.message);
    }
  }
}
