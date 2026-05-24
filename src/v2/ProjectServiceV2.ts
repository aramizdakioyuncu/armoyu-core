import { BaseService } from '../services/BaseService';
import { Project, ProjectScoreDTO, ProjectMemberDTO, ServiceResponse } from '../models';
import { ProjectMapper } from '../utils/mappers/content/ProjectMapper';

export interface CreateProjectParams {
  name: string;
  description?: string;
  version?: string;
  link?: string;
  shortname?: string;
  languageId?: number;
  contact?: string;
  privacyPolicy?: string;
}

export interface UpdateProjectParams {
  name?: string;
  description?: string;
  version?: string;
  link?: string;
  shortname?: string;
  languageId?: number;
  contact?: string;
  privacyPolicy?: string;
}

export class ProjectServiceV2 extends BaseService {
  async getProjects(page: number = 1, limit: number = 10): Promise<ServiceResponse<Project[]>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>(`/v1/projects?page=${page}&limit=${limit}`);
      const data = this.handle<any[]>(response);
      return this.createSuccess(ProjectMapper.mapProjectList(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ProjectServiceV2] Failed to fetch projects:', error.message);
      return this.createError(error.message);
    }
  }

  async getProject(id: number): Promise<ServiceResponse<Project>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>(`/v1/projects/${id}`);
      const data = this.handle<any>(response);
      return this.createSuccess(ProjectMapper.mapProject(data), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ProjectServiceV2] Failed to fetch project ${id}:`, error.message);
      return this.createError(error.message);
    }
  }

  async createProject(params: CreateProjectParams): Promise<ServiceResponse<Project>> {
    this.requireAuth();
    try {
      const body: any = { name: params.name };
      if (params.description !== undefined) body.description = params.description;
      if (params.version !== undefined) body.version = params.version;
      if (params.link !== undefined) body.link = params.link;
      if (params.shortname !== undefined) body.shortname = params.shortname;
      if (params.languageId !== undefined) body.languageId = params.languageId;
      if (params.contact !== undefined) body.contact = params.contact;
      if (params.privacyPolicy !== undefined) body.privacyPolicy = params.privacyPolicy;

      const response = await this.client.post<any>('/v1/projects', body);
      const data = this.handle<any>(response);
      return this.createSuccess(ProjectMapper.mapProject(data), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ProjectServiceV2] Failed to create project:', error.message);
      return this.createError(error.message);
    }
  }

  async updateProject(id: number, params: UpdateProjectParams): Promise<ServiceResponse<Project>> {
    this.requireAuth();
    try {
      const response = await this.client.patch<any>(`/v1/projects/${id}`, params);
      const data = this.handle<any>(response);
      return this.createSuccess(ProjectMapper.mapProject(data), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ProjectServiceV2] Failed to update project ${id}:`, error.message);
      return this.createError(error.message);
    }
  }

  async deleteProject(id: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.delete<any>(`/v1/projects/${id}`);
      this.handle<any>(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ProjectServiceV2] Failed to delete project ${id}:`, error.message);
      return this.createError(error.message);
    }
  }

  async getMembers(projectId: number): Promise<ServiceResponse<ProjectMemberDTO[]>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>(`/v1/projects/${projectId}/members`);
      const data = this.handle<any[]>(response);
      return this.createSuccess(ProjectMapper.mapMemberList(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ProjectServiceV2] Failed to fetch members for project ${projectId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async addMember(projectId: number, userId: number, roleId: number, type: string): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>(`/v1/projects/${projectId}/members`, { userId, roleId, type });
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ProjectServiceV2] Failed to add member to project ${projectId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async removeMember(projectId: number, rowId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.delete<any>(`/v1/projects/${projectId}/members/${rowId}`);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ProjectServiceV2] Failed to remove member ${rowId} from project ${projectId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async getScoreList(projectId: string | number): Promise<ServiceResponse<ProjectScoreDTO[]>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>(`/v1/projects/${projectId}/scores`);
      const data = this.handle<any[]>(response);
      return this.createSuccess(ProjectMapper.mapScoreList(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ProjectServiceV2] Failed to fetch scores for project ${projectId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async saveScore(projectId: string | number, score: string | number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>(`/v1/projects/${projectId}/scores`, { score });
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ProjectServiceV2] Failed to save score for project ${projectId}:`, error.message);
      return this.createError(error.message);
    }
  }
}
