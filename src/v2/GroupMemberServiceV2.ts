import { BaseService } from '../services/BaseService';
import { GroupMember, ServiceResponse } from '../models';
import { GroupMapper } from '../utils/mappers';

/**
 * Modern V2 (CURRENT) implementation for GroupMemberService.
 *
 * Endpoints:
 *   GET  /v1/group/user?groupId&page&limit  → list group members
 *   POST /v1/group/user                     → invite user to group
 *   PUT  /v1/group/user                     → update member role
 *   POST /v1/group/user/join                → join group               (stub)
 *   POST /v1/group/user/leave               → leave group              (stub)
 *   POST /v1/group/user/respond             → respond to invitation    (stub)
 *   DELETE /v1/group/user                   → kick member              (stub)
 */
export class GroupMemberServiceV2 extends BaseService {
  async getMembers(params: { groupId?: number; groupUrl?: string }, page: number = 1, options?: { limit?: number }): Promise<ServiceResponse<GroupMember[]>> {
    try {
      const query = new URLSearchParams({ page: page.toString() });
      if (params.groupId) query.set('groupId', params.groupId.toString());
      if (options?.limit) query.set('limit', options.limit.toString());

      const response = await this.client.get<any>(`/v1/group/user?${query}`);
      const icerik = this.handle<any[]>(response);
      const mapped = GroupMapper.mapMemberList(Array.isArray(icerik) ? icerik : []);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[GroupMemberServiceV2] Failed to fetch members:', error.message);
      return this.createError(error.message);
    }
  }

  async invite(groupId: number, userId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>('/v1/group/user', { groupId, userId });
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupMemberServiceV2] Failed to invite user ${userId} to group ${groupId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async updateMember(groupUserId: number, roleId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.put<any>('/v1/group/user', { groupUserId, roleId });
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupMemberServiceV2] Failed to update member ${groupUserId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async join(_groupId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    return this.createError('GroupMemberService join V2 endpoint is not yet defined.');
  }

  async leave(_groupId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    return this.createError('GroupMemberService leave V2 endpoint is not yet defined.');
  }

  async respondToInvitation(_groupId: number, _answer: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    return this.createError('GroupMemberService respondToInvitation V2 endpoint is not yet defined.');
  }

  async kick(groupId: number, groupUserId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.delete<any>('/v1/group/users', { groupId, groupUserId });
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GroupMemberServiceV2] Failed to kick groupUserId ${groupUserId} from group ${groupId}:`, error.message);
      return this.createError(error.message);
    }
  }
}
