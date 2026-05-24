import { Project, ProjectScoreDTO, ProjectMemberDTO, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ProjectServiceV1 } from '../v1/ProjectServiceV1';
import { ProjectServiceV2, CreateProjectParams, UpdateProjectParams } from '../v2/ProjectServiceV2';

export class ProjectService extends BaseService {
  private version: ProjectServiceV1 | ProjectServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new ProjectServiceV1(client, logger)
      : new ProjectServiceV2(client, logger);
  }

  async getProjects(page: number = 1, limit: number = 10): Promise<ServiceResponse<Project[]>> {
    return this.version.getProjects(page, limit);
  }

  async getProject(id: number): Promise<ServiceResponse<Project>> {
    return this.version.getProject(id);
  }

  async createProject(params: CreateProjectParams): Promise<ServiceResponse<Project>> {
    return this.version.createProject(params);
  }

  async updateProject(id: number, params: UpdateProjectParams): Promise<ServiceResponse<Project>> {
    return this.version.updateProject(id, params);
  }

  async deleteProject(id: number): Promise<ServiceResponse<boolean>> {
    return this.version.deleteProject(id);
  }

  async getMembers(projectId: number): Promise<ServiceResponse<ProjectMemberDTO[]>> {
    return this.version.getMembers(projectId);
  }

  async addMember(projectId: number, userId: number, roleId: number, type: string): Promise<ServiceResponse<boolean>> {
    return this.version.addMember(projectId, userId, roleId, type);
  }

  async removeMember(projectId: number, rowId: number): Promise<ServiceResponse<boolean>> {
    return this.version.removeMember(projectId, rowId);
  }

  async getScoreList(projectId: string | number): Promise<ServiceResponse<ProjectScoreDTO[]>> {
    return this.version.getScoreList(projectId);
  }

  async saveScore(projectId: string | number, score: string | number): Promise<ServiceResponse<boolean>> {
    return this.version.saveScore(projectId, score);
  }
}
