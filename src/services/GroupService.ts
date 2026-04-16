import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { Group } from '../models/community/Group';
import { ServiceResponse } from '../api/ServiceResponse';

/**
 * Service for managing groups, clans, and social communities.
 * @checked 2026-04-12
 */
export class GroupService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Responds to a group invitation.
   */
  async respondToInvitation(groupId: number, response: number): Promise<ServiceResponse<any>> {
    this.requireAuth();

    try {
      const formData = new FormData();
      formData.append('grupID', groupId.toString());
      formData.append('cevap', response.toString());

      const url = this.resolveBotPath('/0/0/gruplar-davetcevap/0/0/');
      const apiResponse = await this.client.post<any>(url, formData);
      const icerik = this.handleResponse<any>(apiResponse);
      return this.createSuccess(icerik, apiResponse?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupService] Responding to group invitation ${groupId} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the list of groups associated with a player (Legacy).
   */
  async getUserGroups(userId?: number): Promise<ServiceResponse<Group[]>> {
    try {
      const formData = new FormData();
      if (userId !== undefined) {
        formData.append('oyuncubakid', userId.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/gruplarim/0/0/'), formData);
      const data = this.handleResponse<any[]>(response);
      const groups = Array.isArray(data) ? data.map((g: any) => Group.fromJSON(g)) : [];
      return this.createSuccess(groups, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupService] Fetching player groups failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches a list of all groups with filtering and pagination.
   */
  async getGroups(page: number, params: { category?: string | number } = {}): Promise<ServiceResponse<Group[]>> {
    try {
      const formData = new FormData();
      if (params.category !== undefined) {
        formData.append('kategori', params.category.toString());
      }
      formData.append('sayfa', page.toString());

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/gruplar/liste/${page}/`), formData);
      const data = this.handleResponse<any[]>(response);
      const groups = Array.isArray(data) ? data.map((g: any) => Group.fromJSON(g)) : [];
      return this.createSuccess(groups, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupService] Fetching groups list failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the detailed information for a specific group (Legacy).
   */
  async getGroupDetail(params: { groupId?: number, groupName?: string }): Promise<ServiceResponse<Group | null>> {
    try {
      const formData = new FormData();
      if (params.groupId !== undefined) {
        formData.append('grupID', params.groupId.toString());
      }
      if (params.groupName !== undefined) {
        formData.append('groupname', params.groupName);
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/gruplar/0/0/'), formData);
      const data = this.handleResponse<any>(response);
      const group = data ? Group.fromJSON(data) : null;
      return this.createSuccess(group, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupService] Fetching group detail failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Invites one or more users to a group (Legacy).
   */
  async inviteToGroup(groupId: number, userIds: number[]): Promise<ServiceResponse<any>> {
    this.requireAuth();

    try {
      const formData = new FormData();
      formData.append('grupID', groupId.toString());
      userIds.forEach(id => {
        formData.append('users[]', id.toString());
      });

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/gruplar/davetet/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupService] Inviting users to group ${groupId} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Updates group media assets (Logo, Banner, etc.) (Legacy).
   */
  async updateGroupMedia(groupId: number, category: string, file: File | Blob): Promise<ServiceResponse<any>> {
    this.requireAuth();

    try {
      const formData = new FormData();
      formData.append('groupID', groupId.toString());
      formData.append('category', category);
      formData.append('media', file);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/gruplar/medya/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupService] Updating group media failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Leaves a group (Legacy).
   */
  async leaveGroup(groupId: number): Promise<ServiceResponse<any>> {
    this.requireAuth();

    try {
      const formData = new FormData();
      formData.append('grupID', groupId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/gruplar/ayril/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupService] Leaving group ${groupId} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the member list of a specific group (Legacy).
   */
  async getGroupMembers(groupName: string): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('groupname', groupName);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/gruplar/uyeler/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupService] Fetching group members for ${groupName} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Kicks a user from a group (Legacy).
   */
  async kickFromGroup(groupId: number, userId: number): Promise<ServiceResponse<any>> {
    this.requireAuth();

    try {
      const formData = new FormData();
      formData.append('grupID', groupId.toString());
      formData.append('userID', userId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/gruplar/gruptanat/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupService] Kicking user ${userId} from group ${groupId} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Updates core group settings (Legacy).
   */
  async updateGroupSettings(params: {
    groupId: number;
    title?: string;
    tag?: string;
    description?: string;
    discord?: string;
    website?: string;
    recruitmentStatus?: number | string;
  }): Promise<ServiceResponse<any>> {
    this.requireAuth();

    try {
      const formData = new FormData();
      formData.append('grupID', params.groupId.toString());
      if (params.title !== undefined) formData.append('baslik', params.title);
      if (params.tag !== undefined) formData.append('grupetiket', params.tag);
      if (params.description !== undefined) formData.append('aciklama', params.description);
      if (params.discord !== undefined) formData.append('discordlink', params.discord);
      if (params.website !== undefined) formData.append('website', params.website);
      if (params.recruitmentStatus !== undefined) formData.append('alimdurum', params.recruitmentStatus.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/gruplar/ayarlar/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupService] Updating group settings failed:`, error);
      return this.createError(error.message);
    }
  }
}
