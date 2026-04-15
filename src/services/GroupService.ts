import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { Group } from '../models/community/Group';

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
   * 
   * @param groupId The ID of the group (grupID)
   * @param response The response (1 for accept, 0 for decline)
   */
  async respondToInvitation(groupId: number, response: number): Promise<any> {
    this.requireAuth();

    try {
      const formData = new FormData();
      formData.append('grupID', groupId.toString());
      formData.append('cevap', response.toString());

      const url = this.resolveBotPath('/0/0/gruplar-davetcevap/0/0/');
      const apiResponse = await this.client.post<any>(url, formData);
      return this.handleResponse<any>(apiResponse);
    } catch (error) {
      this.logger.error(`[GroupService] Responding to group invitation ${groupId} failed:`, error);
      return null;
    }
  }

  /**
   * Fetches the list of groups associated with a player (Legacy).
   * 
   * @param userId Optional user ID to view groups for
   */
  async getUserGroups(userId?: number): Promise<Group[]> {
    try {
      const formData = new FormData();
      if (userId !== undefined) {
        formData.append('oyuncubakid', userId.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/gruplarim/0/0/'), formData);
      const data = this.handleResponse<any[]>(response);
      return Array.isArray(data) ? data.map((g: any) => Group.fromJSON(g)) : [];
    } catch (error) {
      this.logger.error(`[GroupService] Fetching player groups failed:`, error);
      return [];
    }
  }

  /**
   * Fetches a list of all groups with filtering and pagination (Legacy).
   * 
   * @param params Filtering and pagination options
   */
  async getGroups(params: { category?: string | number, page?: number } = {}): Promise<Group[]> {
    try {
      const formData = new FormData();
      if (params.category !== undefined) {
        formData.append('kategori', params.category.toString());
      }
      formData.append('sayfa', (params.page || 1).toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/gruplar/liste/0/'), formData);
      const data = this.handleResponse<any[]>(response);
      return Array.isArray(data) ? data.map((g: any) => Group.fromJSON(g)) : [];
    } catch (error) {
      this.logger.error(`[GroupService] Fetching groups list failed:`, error);
      return [];
    }
  }

  /**
   * Fetches the detailed information for a specific group (Legacy).
   * 
   * @param params Identification for the group (id or name)
   */
  async getGroupDetail(params: { groupId?: number, groupName?: string }): Promise<Group | null> {
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
      return data ? Group.fromJSON(data) : null;
    } catch (error) {
      this.logger.error(`[GroupService] Fetching group detail failed:`, error);
      return null;
    }
  }

  /**
   * Invites one or more users to a group (Legacy).
   * 
   * @param groupId The ID of the group
   * @param userIds Array of user IDs to invite
   */
  async inviteToGroup(groupId: number, userIds: number[]): Promise<any> {
    this.requireAuth();

    try {
      const formData = new FormData();
      formData.append('grupID', groupId.toString());
      userIds.forEach(id => {
        formData.append('users[]', id.toString());
      });

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/gruplar/davetet/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[GroupService] Inviting users to group ${groupId} failed:`, error);
      return null;
    }
  }

  /**
   * Updates group media assets (Logo, Banner, etc.) (Legacy).
   * 
   * @param groupId The ID of the group
   * @param category Asset category (e.g. 'logo', 'banner')
   * @param file The media file to upload
   */
  async updateGroupMedia(groupId: number, category: string, file: File | Blob): Promise<any> {
    this.requireAuth();

    try {
      const formData = new FormData();
      formData.append('groupID', groupId.toString());
      formData.append('category', category);
      formData.append('media', file);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/gruplar/medya/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[GroupService] Updating group media failed:`, error);
      return null;
    }
  }

  /**
   * Leaves a group (Legacy).
   * 
   * @param groupId The ID of the group to leave
   */
  async leaveGroup(groupId: number): Promise<any> {
    this.requireAuth();

    try {
      const formData = new FormData();
      formData.append('grupID', groupId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/gruplar/ayril/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[GroupService] Leaving group ${groupId} failed:`, error);
      return null;
    }
  }

  /**
   * Fetches the member list of a specific group (Legacy).
   * 
   * @param groupName The unique name of the group
   */
  async getGroupMembers(groupName: string): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('groupname', groupName);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/gruplar/uyeler/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[GroupService] Fetching group members for ${groupName} failed:`, error);
      return null;
    }
  }

  /**
   * Kicks a user from a group (Legacy).
   * 
   * @param groupId The ID of the group
   * @param userId The ID of the user to kick
   */
  async kickFromGroup(groupId: number, userId: number): Promise<any> {
    this.requireAuth();

    try {
      const formData = new FormData();
      formData.append('grupID', groupId.toString());
      formData.append('userID', userId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/gruplar/gruptanat/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[GroupService] Kicking user ${userId} from group ${groupId} failed:`, error);
      return null;
    }
  }

  /**
   * Updates core group settings (Legacy).
   * 
   * @param params Settings to update
   */
  async updateGroupSettings(params: {
    groupId: number;
    title?: string;
    tag?: string;
    description?: string;
    discord?: string;
    website?: string;
    recruitmentStatus?: number | string;
  }): Promise<any> {
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
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[GroupService] Updating group settings failed:`, error);
      return null;
    }
  }
}
