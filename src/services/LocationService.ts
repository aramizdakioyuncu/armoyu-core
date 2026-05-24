import { Country, Province, County, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { LocationServiceV1 } from '../v1/LocationServiceV1';
import { LocationServiceV2 } from '../v2/LocationServiceV2';

export class LocationService extends BaseService {
  private version: LocationServiceV1 | LocationServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new LocationServiceV1(client, logger)
      : new LocationServiceV2(client, logger);
  }

  async getCountries(page: number = 1, limit?: number): Promise<ServiceResponse<Country[]>> {
    return this.version.getCountries(page, limit);
  }

  async getProvinces(page: number = 1, countryId?: string | number, limit?: number): Promise<ServiceResponse<Province[]>> {
    return this.version.getProvinces(page, countryId, limit);
  }

  async getCounties(page: number = 1, provinceId?: string | number, limit?: number): Promise<ServiceResponse<County[]>> {
    return this.version.getCounties(page, provinceId, limit);
  }
}
