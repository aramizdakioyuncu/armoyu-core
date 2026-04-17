import { GroupMapper } from '../../utils/mappers/GroupMapper';
import { BaseService } from '../BaseService';
import { GetGroupsResponse } from '../../models/community/GetGroupsResponse';
import { GetUserGroupsResponse } from '../../models/community/GetUserGroupsResponse';
import { Group } from '../../models/community/Group';
import { ServiceResponse } from '../../api/ServiceResponse';

/**
 * Handles group profiles, listings, and settings.
 */
export class GroupProfileService extends BaseService {
  async getUserGroups(userId?: number): Promise<GetUserGroupsResponse> {
    try {
      const formData = new FormData();
      if (userId !== undefined) formData.append('oyuncubakid', userId.toString());
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/gruplarim/0/0/'), formData);
      const data = this.handle<any[]>(response);
      return { icerik: (data || []).map(g => GroupMapper.mapGroup(g, this.usePreviousVersion)), kod: Number(response.kod), durum: Number(response.durum), aciklama: response.aciklama || 'İşlem Başarılı' };
    } catch (error: any) {
      return { icerik: [], kod: 0, durum: 0, aciklama: error.message };
    }
  }

  async getGroups(page: number, params: { category?: string | number } = {}): Promise<GetGroupsResponse> {
    try {
      const formData = new FormData();
      if (params.category !== undefined) formData.append('kategori', params.category.toString());
      formData.append('sayfa', page.toString());
      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/gruplar/liste/${page}/`), formData);
      const data = this.handle<any[]>(response);
      return { icerik: (data || []).map(g => GroupMapper.mapGroup(g, this.usePreviousVersion)), kod: Number(response.kod), durum: Number(response.durum), aciklama: response.aciklama || 'İşlem Başarılı' };
    } catch (error: any) {
      return { icerik: [], kod: 0, durum: 0, aciklama: error.message };
    }
  }

  async getGroupDetail(params: { groupId?: number, groupName?: string }): Promise<ServiceResponse<Group | null>> {
    try {
      const formData = new FormData();
      if (params.groupId !== undefined) formData.append('grupID', params.groupId.toString());
      if (params.groupName !== undefined) formData.append('groupname', params.groupName);
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/gruplar/0/0/'), formData);
      const data = this.handle<any>(response);
      return this.createSuccess(data ? GroupMapper.mapGroup(data, this.usePreviousVersion) : null, response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async updateGroupMedia(groupId: number, category: string, file: File | Blob): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('groupID', groupId.toString());
      formData.append('category', category);
      formData.append('media', file);
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/gruplar/medya/0/'), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async updateGroupSettings(params: any): Promise<ServiceResponse<any>> {
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
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }
}
