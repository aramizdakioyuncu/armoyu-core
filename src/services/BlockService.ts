import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { BlockedUser } from '../models/social/user/BlockedUser';
import { ServiceResponse } from '../api/ServiceResponse';

/**
 * Service for managing user blocks and blacklists (Legacy).
 * @checked 2026-04-12
 */
export class BlockService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger, usePreviousVersion: boolean = false) {
    super(client, logger, usePreviousVersion);
  }

  /**
   * Fetches the list of blocked users (Legacy).
   */
  async getBlockedUsers(page: number, limit?: number): Promise<ServiceResponse<BlockedUser[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) {
        formData.append('limit', limit.toString());
      }

      const url = this.resolveBotPath(`/0/0/engel/${page}/${limit || 0}/`);
      const response = await this.client.post<any>(url, formData);
      const data = this.handle<any[]>(response);
      
      return this.createSuccess(data || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[BlockService] Failed to fetch blocked users:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Blocks a specific user (Legacy).
   */
  async blockUser(userId: number | string): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('userID', userId.toString());

      const url = this.resolveBotPath(`/0/0/engel/ekle/${userId}/`);
      const response = await this.client.post<any>(url, formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[BlockService] Failed to block user ${userId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Unblocks a specific user (Legacy).
   */
  async unblockUser(userId: number | string): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('userID', userId.toString());

      const url = this.resolveBotPath(`/0/0/engel/sil/${userId}/`);
      const response = await this.client.post<any>(url, formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[BlockService] Failed to unblock user ${userId}:`, error);
      return this.createError(error.message);
    }
  }
}



