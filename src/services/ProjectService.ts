import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ProjectScore } from '../models/content/ProjectScore';

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
   * 
   * @returns List of project scores
   */
  async getScoreList(): Promise<ProjectScore[]> {
    try {
      const url = this.resolveBotPath('/0/0/projeler/icerik-liste/0/');
      const response = await this.client.post<any>(url, {});
      const data = this.handleResponse<any[]>(response);
      
      return Array.isArray(data) ? data.map(item => ProjectScore.fromJSON(item)) : [];
    } catch (error) {
      this.logger.error('[ProjectService] Failed to fetch project score list:', error);
      return [];
    }
  }

  /**
   * Saves a score for a specific project (Legacy).
   * 
   * @param projectId The ID of the project (projeID)
   * @param score The score to save (skor)
   */
  async saveScore(projectId: string | number, score: number | string): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('projeID', projectId.toString());
      formData.append('skor', score.toString());

      const url = this.resolveBotPath('/0/0/projeler/icerik-kaydet/0/');
      const response = await this.client.post<any>(url, formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error('[ProjectService] Failed to save project score:', error);
      return null;
    }
  }
}
