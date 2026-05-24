import { StationResponse, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { StationServiceV1 } from '../v1/StationServiceV1';
import { StationServiceV2 } from '../v2/StationServiceV2';

export class StationService extends BaseService {
  private version: StationServiceV1 | StationServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new StationServiceV1(client, logger)
      : new StationServiceV2(client, logger);
  }

  async getStations(page: number = 1, category?: string | number): Promise<ServiceResponse<StationResponse[]>> {
    return this.version.getStations(page, category);
  }

  async getStationEquipment(stationId: string | number): Promise<ServiceResponse<any[]>> {
    return this.version.getStationEquipment(stationId);
  }

  async getUserStations(page: number, limit?: number, userId?: number): Promise<ServiceResponse<any[]>> {
    return this.version.getUserStations(page, limit, userId);
  }
}
