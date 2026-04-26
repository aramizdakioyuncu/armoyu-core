import { Project, ServiceResponse, ProjectScoreDTO } from '../models';
import { ProjectMapper } from '../utils/mappers/content/ProjectMapper';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';

/**
 * Service for management and display of platform projects.
 */
export class ProjectService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Get all active projects.
   */
  async getProjects(): Promise<ServiceResponse<Project[]>> {
    try {
      const response = await this.client.post<any>('/0/0/projeler/0/0/', new FormData());
      const data = this.handle<any[]>(response);
      const mapped = ProjectMapper.mapProjectList(data || []);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ProjectService] Failed to fetch projects:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get score list for a specific project.
   */
  async getScoreList(projectId: string | number): Promise<ServiceResponse<ProjectScoreDTO[]>> {
    try {
      const formData = new FormData();
      formData.append('projeID', projectId.toString());
      const response = await this.client.post<any>('/0/0/projeler/skor-listesi/0/', formData);
      const data = this.handle<any[]>(response);
      const mapped = ProjectMapper.mapScoreList(data || []);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ProjectService] Failed to fetch scores for project ${projectId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Save score for a specific project.
   */
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
      this.logger.error(`[ProjectService] Failed to save score for project ${projectId}:`, error);
      return this.createError(error.message);
    }
  }
}

