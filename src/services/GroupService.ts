import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { GroupProfileService } from './group/GroupProfileService';
import { GroupMembershipService } from './group/GroupMembershipService';

/**
 * Service for managing groups, clans, and social communities.
 */
export class GroupService extends BaseService {
  private readonly _profile: GroupProfileService;
  private readonly _membership: GroupMembershipService;

  constructor(client: ApiClient, logger: ArmoyuLogger, usePreviousVersion: boolean = false) {
    super(client, logger, usePreviousVersion);
    this._profile = new GroupProfileService(client, logger, usePreviousVersion);
    this._membership = new GroupMembershipService(client, logger, usePreviousVersion);
  }

  // Profile and Listings
  getUserGroups(userId?: number) { return this._profile.getUserGroups(userId); }
  getGroups(page: number, params: any = {}) { return this._profile.getGroups(page, params); }
  getGroupDetail(params: any) { return this._profile.getGroupDetail(params); }
  updateGroupMedia(id: number, cat: string, f: any) { return this._profile.updateGroupMedia(id, cat, f); }
  updateGroupSettings(p: any) { return this._profile.updateGroupSettings(p); }

  // Membership and Moderation
  respondToInvitation(id: number, c: number) { return this._membership.respondToInvitation(id, c); }
  inviteToGroup(id: number, u: number[]) { return this._membership.inviteToGroup(id, u); }
  leaveGroup(id: number) { return this._membership.leaveGroup(id); }
  getGroupMembers(name: string) { return this._membership.getGroupMembers(name); }
  kickFromGroup(id: number, uid: number) { return this._membership.kickFromGroup(id, uid); }
}
