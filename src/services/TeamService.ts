import { TeamResponse, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { TeamServiceV1, CreateTeamParams } from '../v1/TeamServiceV1';
import { TeamServiceV2 } from '../v2/TeamServiceV2';

export { CreateTeamParams };

export class TeamService extends BaseService {
  private version: TeamServiceV1 | TeamServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new TeamServiceV1(client, logger)
      : new TeamServiceV2(client, logger);
  }

  async getTeams(page: number = 1, limit?: string | number): Promise<ServiceResponse<TeamResponse[]>> {
    return this.version.getTeams(page, limit);
  }

  async createTeam(params: CreateTeamParams): Promise<ServiceResponse<TeamResponse>> {
    return this.version.createTeam(params);
  }

  async deleteTeam(teamId: number): Promise<ServiceResponse<boolean>> {
    return this.version.deleteTeam(teamId);
  }
}
