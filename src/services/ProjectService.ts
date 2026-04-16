import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ProjectScore } from '../models/content/ProjectScore';
import { ServiceResponse } from '../api/ServiceResponse';

/**
 * Service for managing platform projects and leaderboards.
 * @checked 2026-04-12
 */
export class ProjectService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Fetches the scores/leaderboard for projects (Legacy).
   */
  async getScoreList(page: number = 1): Promise<ServiceResponse<ProjectScore[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());

      const url = this.resolveBotPath(`/0/0/projeler/icerik-liste/${page}/`);
      const response = await this.client.post<any>(url, formData);
      const data = this.handleResponse<any[]>(response);
      const scores = Array.isArray(data) ? data.map(item => ProjectScore.fromJSON(item)) : [];
      
      return this.createSuccess(scores, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ProjectService] Failed to fetch project score list:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Saves a score for a specific project (Legacy).
   */
  async saveScore(projectId: string | number, score: number | string): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('projeID', projectId.toString());
      formData.append('skor', score.toString());

      const url = this.resolveBotPath('/0/0/projeler/icerik-kaydet/0/');
      const response = await this.client.post<any>(url, formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ProjectService] Failed to save project score:', error);
      return this.createError(error.message);
    }
  }
}
