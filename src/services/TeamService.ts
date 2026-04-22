import { TeamResponse, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { TeamMapper } from '../utils/mappers/community/TeamMapper';

/**
 * Service for managing competitive teams and roster management.
 */
export class TeamService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Get all active teams.
   */
  async getTeams(page: number = 1, limit?: string | number): Promise<ServiceResponse<TeamResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit) formData.append('limit', limit.toString());

      const response = await this.client.post<any>(`/0/0/takimlar/liste/${page}/`, formData);
      const data = this.handle<any[]>(response);
      const mapped = TeamMapper.mapTeamList(data || []);
      
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[TeamService] Failed to fetch teams:', error);
      return this.createError(error.message);
    }
  }
}

