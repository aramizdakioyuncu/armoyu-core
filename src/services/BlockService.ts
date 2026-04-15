import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { BlockedUser } from '../models/social/BlockedUser';

/**
 * Service for managing user blocks and blacklists (Legacy).
 * @checked 2026-04-12
 */
export class BlockService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Fetches the list of blocked users (Legacy).
   * 
   * @param page The page number - MANDATORY
   * @param limit Results limit
   * @returns List of blocked users
   */
  async getBlockedUsers(page: number, limit?: number): Promise<BlockedUser[]> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) {
        formData.append('limit', limit.toString());
      }

      const url = this.resolveBotPath(`/0/0/engel/${page}/${limit || 0}/`);
      const response = await this.client.post<any>(url, formData);
      const data = this.handleResponse<any[]>(response);
      
      return Array.isArray(data) ? data.map(item => BlockedUser.fromJSON(item)) : [];
    } catch (error) {
      this.logger.error('[BlockService] Failed to fetch blocked users:', error);
      return [];
    }
  }

  /**
   * Blocks a specific user (Legacy).
   * 
   * @param userId The ID of the user to block (userID)
   */
  async blockUser(userId: number | string): Promise<any> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('userID', userId.toString());

      const url = this.resolveBotPath(`/0/0/engel/ekle/${userId}/`);
      const response = await this.client.post<any>(url, formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[BlockService] Failed to block user ${userId}:`, error);
      return null;
    }
  }

  /**
   * Unblocks a specific user (Legacy).
   * 
   * @param userId The ID of the user to unblock (userID)
   */
  async unblockUser(userId: number | string): Promise<any> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('userID', userId.toString());

      const url = this.resolveBotPath(`/0/0/engel/sil/${userId}/`);
      const response = await this.client.post<any>(url, formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[BlockService] Failed to unblock user ${userId}:`, error);
      return null;
    }
  }
}
