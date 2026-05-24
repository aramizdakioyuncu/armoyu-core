import { Group, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { GroupServiceV1 } from '../v1/GroupServiceV1';
import { GroupServiceV2 } from '../v2/GroupServiceV2';
import { GroupMemberService } from './GroupMemberService';

export interface CreateGroupParams {
  name: string;
  shortName: string;
  categoryId: number;
  categoryDetailId: number;
}

/**
 * Service for community group management.
 * Delegates requests to GroupServiceV1 or GroupServiceV2 based on ApiVersion.
 *
 * Member actions (join, leave, invite, kick, etc.) → GroupMemberService
 */
export class GroupService extends BaseService {
  private version: GroupServiceV1 | GroupServiceV2;
  public readonly member: GroupMemberService;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new GroupServiceV1(client, logger)
      : new GroupServiceV2(client, logger);
    this.member = new GroupMemberService(client, logger);
  }

  async getGroups(page: number, options?: { limit?: number; category?: string }): Promise<ServiceResponse<Group[]>> {
    return this.version.getGroups(page, options);
  }

  async getGroupDetail(params: { groupId?: number; groupUrl?: string }): Promise<ServiceResponse<Group>> {
    return this.version.getGroupDetail(params);
  }

  async getUserGroups(userId?: number): Promise<ServiceResponse<Group[]>> {
    return this.version.getUserGroups(userId);
  }

  async createGroup(params: CreateGroupParams): Promise<ServiceResponse<Group>> {
    return this.version.createGroup(params);
  }

  async updateGroupSettings(groupId: number, data: { title?: string; tag?: string; description?: string; discord?: string; website?: string; recruitmentStatus?: string }): Promise<ServiceResponse<Group>> {
    return this.version.updateGroupSettings(groupId, data);
  }

  async updateGroupMedia(groupId: number, category: string, file: File): Promise<ServiceResponse<boolean>> {
    return this.version.updateGroupMedia(groupId, category, file);
  }
}
