import { GroupResponse, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { GroupMapper } from '../utils/mappers';

/**
 * Service for community groups and clans.
 */
export class GroupService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Get all groups with pagination.
   */
  async getGroups(page: number, limitOrOptions?: number | { category?: string }, options?: { category?: string }): Promise<ServiceResponse<GroupResponse[]>> {
    try {
      let limit = 20;
      let category = options?.category;

      if (typeof limitOrOptions === 'number') {
        limit = limitOrOptions;
      } else if (typeof limitOrOptions === 'object') {
        category = limitOrOptions.category;
      }

      const formData = new FormData();
      formData.append('sayfa', page.toString());
      formData.append('limit', limit.toString());
      if (category) formData.append('kategori', category);

      const response = await this.client.post<any>('/0/0/gruplar/liste/0/', formData);
      const icerik = this.handle<any>(response);
      
      const rawList = Array.isArray(icerik) ? icerik : (icerik?.liste || icerik?.gruplar || []);
      const mapped = (rawList as any[]).map(item => GroupMapper.mapGroupListItem(item)).filter((n): n is GroupResponse => n !== null);
      
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[GroupService] Failed to fetch groups:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get detailed information for a specific group.
   * Can accept either a group ID or a group URL (tag).
   */
  async getGroupDetail(params: { groupId?: number, groupName?: string }): Promise<ServiceResponse<GroupResponse>> {
    const search = params.groupId || params.groupName;
    try {
      const formData = new FormData();
      if (typeof search === 'number' || !isNaN(Number(search))) {
        formData.append('grupID', search?.toString() || '');
      } else {
        formData.append('groupname', search || '');
      }

      const response = await this.client.post<any>(`/0/0/gruplar/0/0/`, formData);
      const icerik = this.handle<any>(response);
      const mapped = GroupMapper.mapGroupDetail(icerik);
      
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupService] Failed to fetch details for ${search}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Get groups that a user belongs to.
   */
  async getUserGroups(userId?: number): Promise<ServiceResponse<GroupResponse[]>> {
    try {
      const formData = new FormData();
      if (userId) formData.append('oyuncubakid', userId.toString());

      const response = await this.client.post<any>('/0/0/gruplarim/', formData);
      const icerik = this.handle<any>(response);
      const rawList = Array.isArray(icerik) ? icerik : (icerik?.liste || icerik?.gruplar || []);
      const mapped = (rawList as any[]).map(item => GroupMapper.mapGroupListItem(item)).filter((n): n is GroupResponse => n !== null);

      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[GroupService] Failed to fetch user groups:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Invite users to a group.
   */
  async inviteToGroup(groupId: number, userIds: number[]): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('grupID', groupId.toString());
      userIds.forEach(id => formData.append('oyuncubakid[]', id.toString()));

      const response = await this.client.post<any>('/0/0/grupyonetim/davet/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupService] Failed to invite users to group ${groupId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Join a specific group.
   */
  async joinGroup(groupId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('grupID', groupId.toString());
      const response = await this.client.post<any>('/0/0/grupyonetim/katil/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupService] Failed to join group ${groupId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Leave a specific group.
   */
  async leaveGroup(groupId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('grupID', groupId.toString());
      const response = await this.client.post<any>('/0/0/grupyonetim/ayril/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupService] Failed to leave group ${groupId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Kick a user from a group.
   */
  async kickFromGroup(groupId: number, userId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('grupID', groupId.toString());
      formData.append('oyuncubakid', userId.toString());
      const response = await this.client.post<any>('/0/0/grupyonetim/at/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupService] Failed to kick user ${userId} from group ${groupId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Update group settings.
   */
  async updateGroupSettings(data: any): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('grupID', data.groupId.toString());
      formData.append('baslik', data.title || '');
      formData.append('etiket', data.tag || '');
      formData.append('aciklama', data.description || '');
      formData.append('discord', data.discord || '');
      formData.append('website', data.website || '');
      formData.append('alimdurum', data.recruitmentStatus || '1');

      const response = await this.client.post<any>('/0/0/grupyonetim/ayar-guncelle/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupService] Failed to update group settings:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Respond to a group invitation.
   */
  async respondToInvitation(groupId: number, response: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('grupID', groupId.toString());
      formData.append('cevap', response.toString());
      const apiResponse = await this.client.post<any>('/0/0/grupyonetim/davet-cevap/0/', formData);
      this.handle(apiResponse);
      return this.createSuccess(true, apiResponse?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupService] Failed to respond to invitation for group ${groupId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Update group media (Avatar/Banner).
   */
  async updateGroupMedia(groupId: number, category: string, file: File): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('groupID', groupId.toString());
      formData.append('kategori', category);
      formData.append('resim', file);

      const response = await this.client.post<any>('/0/0/grupyonetim/media-guncelle/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupService] Failed to update media for group ${groupId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Get members of a specific group.
   */
  async getGroupMembers(groupName: string): Promise<ServiceResponse<any[]>> {
    try {
      const formData = new FormData();
      formData.append('groupname', groupName);

      const response = await this.client.post<any>('/0/0/gruplar/uyeler/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(Array.isArray(data) ? data : [], response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupService] Failed to fetch members for group ${groupName}:`, error);
      return this.createError(error.message);
    }
  }
}

