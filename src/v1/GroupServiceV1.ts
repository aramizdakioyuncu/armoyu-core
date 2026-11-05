import { BaseService } from '../services/BaseService';
import { Group, GroupDTO, ServiceResponse } from '../models';
import { GroupMapper } from '../utils/mappers';
import { CreateGroupParams } from '../services/GroupService';

/**
 * Legacy V1 (OLD) implementation for GroupService.
 */
export class GroupServiceV1 extends BaseService {
  async getGroups(page: number, options?: { limit?: number; category?: string }): Promise<ServiceResponse<Group[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      formData.append('limit', (options?.limit || 20).toString());
      if (options?.category) formData.append('kategori', options.category);

      const response = await this.client.post<any>('/0/0/gruplar/liste/0/', formData);
      const icerik = this.handle<any>(response);
      const rawList = Array.isArray(icerik) ? icerik : (icerik?.liste || icerik?.gruplar || []);
      const mapped = (rawList as any[]).map(item => GroupMapper.mapGroupListItem(item)).filter((n): n is Group => n !== null);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[GroupServiceV1] Failed to fetch groups:', error.message);
      return this.createError(error.message);
    }
  }

  async getGroupDetail(params: { groupId?: number; groupUrl?: string }): Promise<ServiceResponse<Group>> {
    try {
      const formData = new FormData();
      if (params.groupId) formData.append('grupID', params.groupId.toString());
      if (params.groupUrl) formData.append('groupname', params.groupUrl);

      const response = await this.client.post<any>('/0/0/gruplar/0/0/', formData);
      const icerik = this.handle<any>(response);
      const mapped = GroupMapper.mapGroupDetail(icerik);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[GroupServiceV1] Failed to fetch group detail:', error.message);
      return this.createError(error.message);
    }
  }

  async getUserGroups(userId?: number | string): Promise<ServiceResponse<Group[]>> {
    try {
      const formData = new FormData();
      if (userId) formData.append('oyuncubakid', userId.toString());

      const response = await this.client.post<any>('/0/0/gruplarim/', formData);
      const icerik = this.handle<any>(response);
      const rawList = Array.isArray(icerik) ? icerik : (icerik?.liste || icerik?.gruplar || []);
      const mapped = (rawList as any[]).map(item => GroupMapper.mapGroupListItem(item)).filter((n): n is Group => n !== null);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[GroupServiceV1] Failed to fetch user groups:', error.message);
      return this.createError(error.message);
    }
  }

  async createGroup(_params: CreateGroupParams): Promise<ServiceResponse<Group>> {
    this.requireAuth();
    return this.createError('GroupService createGroup is not supported in V1.');
  }

  async updateGroupSettings(groupId: number, data: { title?: string; tag?: string; description?: string; discord?: string; website?: string; recruitmentStatus?: string }): Promise<ServiceResponse<Group>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('grupID', groupId.toString());
      if (data.title) formData.append('baslik', data.title);
      if (data.tag) formData.append('etiket', data.tag);
      if (data.description) formData.append('aciklama', data.description);
      if (data.discord) formData.append('discord', data.discord);
      if (data.website) formData.append('website', data.website);
      if (data.recruitmentStatus) formData.append('alimdurum', data.recruitmentStatus);
      const response = await this.client.post<any>('/0/0/grupyonetim/ayar-guncelle/0/', formData);
      this.handle(response);
      return this.createSuccess(new Group({ id: groupId, name: data.title || '' } as GroupDTO), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[GroupServiceV1] Failed to update group settings:', error.message);
      return this.createError(error.message);
    }
  }

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
      this.logger.error(`[GroupServiceV1] Failed to update media for group ${groupId}:`, error.message);
      return this.createError(error.message);
    }
  }

}
