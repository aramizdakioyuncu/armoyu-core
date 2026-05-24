import { BaseService } from '../services/BaseService';
import { Project, ProjectScoreDTO, ProjectMemberDTO, ServiceResponse } from '../models';
import { ProjectMapper } from '../utils/mappers/content/ProjectMapper';

export class ProjectServiceV1 extends BaseService {
  async getProjects(_page?: number, _limit?: number): Promise<ServiceResponse<Project[]>> {
    try {
      const response = await this.client.post<any>('/0/0/projeler/0/0/', new FormData());
      const data = this.handle<any[]>(response);
      return this.createSuccess(ProjectMapper.mapProjectList(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ProjectServiceV1] Failed to fetch projects:', error.message);
      return this.createError(error.message);
    }
  }

  async getProject(_id: number): Promise<ServiceResponse<Project>> {
    return this.createError('getProject is not supported in V1');
  }

  async createProject(_params: any): Promise<ServiceResponse<Project>> {
    return this.createError('createProject is not supported in V1');
  }

  async updateProject(_id: number, _params: any): Promise<ServiceResponse<Project>> {
    return this.createError('updateProject is not supported in V1');
  }

  async deleteProject(_id: number): Promise<ServiceResponse<boolean>> {
    return this.createError('deleteProject is not supported in V1');
  }

  async getMembers(_projectId: number): Promise<ServiceResponse<ProjectMemberDTO[]>> {
    return this.createError('getMembers is not supported in V1');
  }

  async addMember(_projectId: number, _userId: number, _roleId: number, _type: string): Promise<ServiceResponse<boolean>> {
    return this.createError('addMember is not supported in V1');
  }

  async removeMember(_projectId: number, _rowId: number): Promise<ServiceResponse<boolean>> {
    return this.createError('removeMember is not supported in V1');
  }

  async getScoreList(projectId: string | number): Promise<ServiceResponse<ProjectScoreDTO[]>> {
    try {
      const formData = new FormData();
      formData.append('projeID', projectId.toString());
      const response = await this.client.post<any>('/0/0/projeler/skor-listesi/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(ProjectMapper.mapScoreList(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ProjectServiceV1] Failed to fetch scores for project ${projectId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async saveScore(projectId: string | number, score: string | number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('projeID', projectId.toString());
      formData.append('skor', score.toString());
      const response = await this.client.post<any>('/0/0/projeler/skor-kaydet/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ProjectServiceV1] Failed to save score for project ${projectId}:`, error.message);
      return this.createError(error.message);
    }
  }
}
