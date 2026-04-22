import { CountryResponse, ProvinceResponse, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { LocationMapper } from '../utils/mappers/core/LocationMapper';

/**
 * Service for managing geographic locations and regional data.
 */
export class LocationService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Get all registered countries.
   */
  async getCountries(page: number = 1, limit?: number): Promise<ServiceResponse<CountryResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit) formData.append('limit', limit.toString());

      const response = await this.client.post<any>('/0/0/ulkeler/0/0/', formData);
      const data = this.handle<any[]>(response);
      const mapped = LocationMapper.mapCountryList(data || []);

      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[LocationService] Failed to fetch countries:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get all registered provinces.
   */
  async getProvinces(page: number = 1, countryId?: string | number, limit?: number): Promise<ServiceResponse<ProvinceResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) formData.append('limit', limit.toString());
      if (countryId !== undefined) formData.append('countryID', countryId.toString());

      const response = await this.client.post<any>('/0/0/iller/0/0/', formData);
      const data = this.handle<any[]>(response);
      const mapped = LocationMapper.mapProvinceList(data || []);

      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[LocationService] Failed to fetch provinces:', error);
      return this.createError(error.message);
    }
  }
}

