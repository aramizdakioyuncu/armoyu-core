import { BaseService } from '../services/BaseService';
import { Group, ServiceResponse } from '../models';
import { GroupMapper } from '../utils/mappers';
import { CreateGroupParams } from '../services/GroupService';

/**
 * Modern V2 (CURRENT) implementation for GroupService.
 *
 * Endpoints:
 *   GET  /v1/group                    → list groups
 *   POST /v1/group                    → create group
 *   GET  /v1/group/{url}              → group detail by URL slug
 *   GET  /v1/group/my                 → user's groups
 *   POST /v1/group/{id}/join          → join group
 *   POST /v1/group/{id}/leave         → leave group
 *   POST /v1/group/{id}/invite        → invite users              (stub)
 *   POST /v1/group/{id}/kick          → kick user                 (stub)
 *   PUT  /v1/group/{id}               → update settings           (stub)
 *   POST /v1/group/{id}/media         → update media              (stub)
 *   GET  /v1/group/{url}/members      → group members             (stub)
 */
export class GroupServiceV2 extends BaseService {
  async getGroups(page: number, options?: { limit?: number; category?: string }): Promise<ServiceResponse<Group[]>> {
    try {
      const query = new URLSearchParams({ page: page.toString() });
      if (options?.limit) query.set('limit', options.limit.toString());
      if (options?.category) query.set('category', options.category);

      const response = await this.client.get<any>(`/v1/group?${query}`);
      const icerik = this.handle<any>(response);
      const rawList = Array.isArray(icerik) ? icerik : (icerik?.liste || icerik?.gruplar || []);
      const mapped = (rawList as any[]).map(item => GroupMapper.mapGroupListItem(item)).filter((n): n is Group => n !== null);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[GroupServiceV2] Failed to fetch groups:', error.message);
      return this.createError(error.message);
    }
  }

  async createGroup(params: CreateGroupParams): Promise<ServiceResponse<Group>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>('/v1/group', {
        name: params.name,
        shortName: params.shortName,
        categoryId: params.categoryId,
        categoryDetailId: params.categoryDetailId,
        category: params.category,
        description: params.description,
        logo: params.logo
      });
      const icerik = this.handle<any>(response);
      const mapped = GroupMapper.mapGroupCreated(icerik);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[GroupServiceV2] Failed to create group:', error.message);
      return this.createError(error.message);
    }
  }

  async getGroupDetail(params: { groupId?: number; groupUrl?: string }): Promise<ServiceResponse<Group>> {
    try {
      const key = params.groupId ?? params.groupUrl;
      if (!key) return this.createError('groupId veya groupUrl gerekli.');
      const response = await this.client.get<any>(`/v1/group/${encodeURIComponent(key)}`);
      // Üye, sahip ve moderatör listeleri ham haliyle UI modeline gider
      return this.createSuccess(this.handle<Group>(response), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[GroupServiceV2] Failed to fetch group detail:', error.message);
      return this.createError(error.message);
    }
  }

  async getUserGroups(_userId?: number): Promise<ServiceResponse<Group[]>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>('/v1/group/my');
      const icerik = this.handle<any[]>(response);
      return this.createSuccess(GroupMapper.mapGroupList(icerik || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[GroupServiceV2] Failed to fetch user groups:', error.message);
      return this.createError(error.message);
    }
  }

  async getCategories(): Promise<ServiceResponse<string[]>> {
    try {
      const response = await this.client.get<any>('/v1/group/categories');
      return this.createSuccess(this.handle<string[]>(response) || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[GroupServiceV2] Failed to fetch categories:', error.message);
      return this.createError(error.message);
    }
  }

  async updateGroupSettings(groupId: number, data: { title?: string; tag?: string; description?: string; discord?: string; website?: string; recruitmentStatus?: string }): Promise<ServiceResponse<Group>> {
    this.requireAuth();
    try {
      const response = await this.client.put<any>('/v1/group', {
        groupId,
        ...(data.title && { name: data.title }),
        ...(data.tag && { shortName: data.tag }),
        ...(data.description && { description: data.description }),
        ...(data.discord && { discord: data.discord }),
        ...(data.website && { website: data.website }),
        ...(data.recruitmentStatus && { recruitmentStatus: data.recruitmentStatus })
      });
      const icerik = this.handle<any>(response);
      const mapped = GroupMapper.mapGroupCreated(icerik);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[GroupServiceV2] Failed to update group settings:', error.message);
      return this.createError(error.message);
    }
  }

  async updateGroupMedia(_groupId: number, _category: string, _file: File): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    return this.createError('GroupService updateGroupMedia V2 endpoint is not yet defined.');
  }

}
