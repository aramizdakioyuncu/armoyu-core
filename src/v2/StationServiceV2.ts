import { BaseService } from '../services/BaseService';
import { StationResponse, ServiceResponse } from '../models';

export class StationServiceV2 extends BaseService {
  async getStations(_page?: number, _category?: string | number): Promise<ServiceResponse<StationResponse[]>> {
    return this.createError('getStations is not supported in V2 yet');
  }

  async getStationEquipment(_stationId: string | number): Promise<ServiceResponse<any[]>> {
    return this.createError('getStationEquipment is not supported in V2 yet');
  }

  async getUserStations(_page: number, _limit?: number, _userId?: number): Promise<ServiceResponse<any[]>> {
    return this.createError('getUserStations is not supported in V2 yet');
  }
}
