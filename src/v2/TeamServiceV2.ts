import { BaseService } from '../services/BaseService';
import { TeamResponse, ServiceResponse } from '../models';
import { TeamMapper } from '../utils/mappers/community/TeamMapper';
import { CreateTeamParams } from '../v1/TeamServiceV1';

export class TeamServiceV2 extends BaseService {
  async getTeams(page: number = 1, limit?: string | number): Promise<ServiceResponse<TeamResponse[]>> {
    try {
      let url = `/v1/takimlar?page=${page}`;
      if (limit) url += `&limit=${limit}`;
      const response = await this.client.get<any>(url);
      const data = this.handle<any[]>(response);
      return this.createSuccess(TeamMapper.mapTeamList(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[TeamServiceV2] Failed to fetch teams:', error.message);
      return this.createError(error.message);
    }
  }

  async createTeam(params: CreateTeamParams): Promise<ServiceResponse<TeamResponse>> {
    this.requireAuth();
    try {
      const body = {
        name: params.name,
        logo: params.logo || '',
        logo_small: params.logoSmall || '',
        logo_tiny: params.logoTiny || ''
      };
      const response = await this.client.post<any>('/v1/takimlar', body);
      const data = this.handle<any>(response);
      return this.createSuccess(TeamMapper.mapTeam(data), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[TeamServiceV2] Failed to create team:', error.message);
      return this.createError(error.message);
    }
  }

  async deleteTeam(teamId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.delete<any>(`/v1/takimlar/${teamId}`);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[TeamServiceV2] Failed to delete team ${teamId}:`, error.message);
      return this.createError(error.message);
    }
  }
}
