import { GroupMember, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { GroupMemberServiceV1 } from '../v1/GroupMemberServiceV1';
import { GroupMemberServiceV2 } from '../v2/GroupMemberServiceV2';

/**
 * Service for group membership actions.
 * Delegates requests to GroupMemberServiceV1 or GroupMemberServiceV2 based on ApiVersion.
 */
export class GroupMemberService extends BaseService {
  private version: GroupMemberServiceV1 | GroupMemberServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new GroupMemberServiceV1(client, logger)
      : new GroupMemberServiceV2(client, logger);
  }

  async getMembers(params: { groupId?: number; groupUrl?: string }, page: number = 1, options?: { limit?: number }): Promise<ServiceResponse<GroupMember[]>> {
    return this.version.getMembers(params, page, options);
  }

  async invite(groupId: number, userId: number): Promise<ServiceResponse<boolean>> {
    return this.version.invite(groupId, userId);
  }

  async updateMember(groupUserId: number, roleId: number): Promise<ServiceResponse<boolean>> {
    return this.version.updateMember(groupUserId, roleId);
  }

  async join(groupId: number): Promise<ServiceResponse<boolean>> {
    return this.version.join(groupId);
  }

  async leave(groupId: number): Promise<ServiceResponse<boolean>> {
    return this.version.leave(groupId);
  }

  async respondToInvitation(groupId: number, answer: number): Promise<ServiceResponse<boolean>> {
    return this.version.respondToInvitation(groupId, answer);
  }

  /**
   * V1: userId = player_ID
   * V2: userId = groupUserId (membership record ID from updateMember response)
   */
  async kick(groupId: number, userId: number): Promise<ServiceResponse<boolean>> {
    return this.version.kick(groupId, userId);
  }
}
