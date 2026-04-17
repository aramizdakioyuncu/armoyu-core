import { BaseService } from '../BaseService';
import { ServiceResponse } from '../../api/ServiceResponse';

/**
 * Handles group invitations, joining, leaving, and member moderation.
 */
export class GroupMembershipService extends BaseService {
  async respondToInvitation(groupId: number, response: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('grupID', groupId.toString());
      formData.append('cevap', response.toString());
      const res = await this.client.post<any>(this.resolveBotPath('/0/0/gruplar-davetcevap/0/0/'), formData);
      return this.createSuccess(this.handle(res), res?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async inviteToGroup(groupId: number, userIds: number[]): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('grupID', groupId.toString());
      userIds.forEach(id => formData.append('users[]', id.toString()));
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/gruplar/davetet/0/'), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async leaveGroup(groupId: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('grupID', groupId.toString());
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/gruplar/ayril/0/'), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async getGroupMembers(groupName: string): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('groupname', groupName);
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/gruplar/uyeler/0/'), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async kickFromGroup(groupId: number, userId: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('grupID', groupId.toString());
      formData.append('userID', userId.toString());
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/gruplar/gruptanat/0/'), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }
}
