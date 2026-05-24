import { BaseService } from '../services/BaseService';
import { TeamResponse, ServiceResponse } from '../models';
import { TeamMapper } from '../utils/mappers/community/TeamMapper';

export interface CreateTeamParams {
  name: string;
  logo?: string;
  logoSmall?: string;
  logoTiny?: string;
}

export class TeamServiceV1 extends BaseService {
  async getTeams(page: number = 1, limit?: string | number): Promise<ServiceResponse<TeamResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit) formData.append('limit', limit.toString());
      const response = await this.client.post<any>(`/0/0/takimlar/liste/${page}/`, formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(TeamMapper.mapTeamList(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[TeamServiceV1] Failed to fetch teams:', error.message);
      return this.createError(error.message);
    }
  }

  async createTeam(_params: CreateTeamParams): Promise<ServiceResponse<TeamResponse>> {
    return this.createError('createTeam is not supported in V1');
  }

  async deleteTeam(_teamId: number): Promise<ServiceResponse<boolean>> {
    return this.createError('deleteTeam is not supported in V1');
  }
}
