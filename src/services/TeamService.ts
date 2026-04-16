import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { PlatformTeam } from '../models/content/PlatformTeam';
import { ServiceResponse } from '../api/ServiceResponse';

/**
 * Service for fetching platform-wide team and franchise information (Legacy).
 * @checked 2026-04-12
 */
export class TeamService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Fetches the list of teams.
   */
  async getTeams(page: number, favoriteTeamId?: number | string): Promise<ServiceResponse<PlatformTeam[]>> {
    try {
      const formData = new FormData();
      if (favoriteTeamId !== undefined) {
        formData.append('favoritakimID', favoriteTeamId.toString());
      }
      formData.append('sayfa', page.toString());

      const url = this.resolveBotPath(`/0/0/takimlar/liste/${page}/`);
      const response = await this.client.post<any>(url, formData);
      const data = this.handleResponse<any[]>(response);
      const teams = Array.isArray(data) ? data.map(item => PlatformTeam.fromJSON(item)) : [];
      
      return this.createSuccess(teams, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[TeamService] Failed to fetch teams:', error);
      return this.createError(error.message);
    }
  }
}
