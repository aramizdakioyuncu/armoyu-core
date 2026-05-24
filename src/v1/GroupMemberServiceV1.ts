import { BaseService } from '../services/BaseService';
import { GroupMember, ServiceResponse } from '../models';
import { GroupMapper } from '../utils/mappers';

/**
 * Legacy V1 (OLD) implementation for GroupMemberService.
 */
export class GroupMemberServiceV1 extends BaseService {
  async getMembers(params: { groupId?: number; groupUrl?: string }, _page: number = 1, _options?: { limit?: number }): Promise<ServiceResponse<GroupMember[]>> {
    try {
      const formData = new FormData();
      if (params.groupUrl) formData.append('groupname', params.groupUrl);
      else if (params.groupId) formData.append('grupID', params.groupId.toString());

      const response = await this.client.post<any>('/0/0/gruplar/uyeler/0/', formData);
      const data = this.handle<any[]>(response);
      const mapped = GroupMapper.mapMemberList(Array.isArray(data) ? data : []);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[GroupMemberServiceV1] Failed to fetch members:', error.message);
      return this.createError(error.message);
    }
  }

  async invite(groupId: number, userId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('grupID', groupId.toString());
      formData.append('oyuncubakid[]', userId.toString());
      const response = await this.client.post<any>('/0/0/grupyonetim/davet/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupMemberServiceV1] Failed to invite user ${userId} to group ${groupId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async updateMember(_groupUserId: number, _roleId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    return this.createError('GroupMemberService updateMember is not supported in V1.');
  }

  async join(groupId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('grupID', groupId.toString());
      const response = await this.client.post<any>('/0/0/grupyonetim/katil/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupMemberServiceV1] Failed to join group ${groupId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async leave(groupId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('grupID', groupId.toString());
      const response = await this.client.post<any>('/0/0/grupyonetim/ayril/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupMemberServiceV1] Failed to leave group ${groupId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async respondToInvitation(groupId: number, answer: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('grupID', groupId.toString());
      formData.append('cevap', answer.toString());
      const response = await this.client.post<any>('/0/0/grupyonetim/davet-cevap/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupMemberServiceV1] Failed to respond to invitation for group ${groupId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async kick(groupId: number, userId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('grupID', groupId.toString());
      formData.append('oyuncubakid', userId.toString());
      const response = await this.client.post<any>('/0/0/grupyonetim/at/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupMemberServiceV1] Failed to kick user ${userId} from group ${groupId}:`, error.message);
      return this.createError(error.message);
    }
  }
}
