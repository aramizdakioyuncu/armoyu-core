import { BaseService } from '../services/BaseService';
import { Country, Province, County, ServiceResponse } from '../models';
import { LocationMapper } from '../utils/mappers/core/LocationMapper';

/**
 * Legacy V1 (OLD) implementation for LocationService.
 */
export class LocationServiceV1 extends BaseService {
  async getCountries(page: number = 1, limit?: number): Promise<ServiceResponse<Country[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit) formData.append('limit', limit.toString());

      const response = await this.client.post<any>('/0/0/ulkeler/0/0/', formData);
      const data = this.handle<any[]>(response);
      const mapped = LocationMapper.mapCountryList(data || []);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[LocationServiceV1] Failed to fetch countries:', error.message);
      return this.createError(error.message);
    }
  }

  async getProvinces(page: number = 1, countryId?: string | number, limit?: number): Promise<ServiceResponse<Province[]>> {
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
      this.logger.error('[LocationServiceV1] Failed to fetch provinces:', error.message);
      return this.createError(error.message);
    }
  }

  async getCounties(_page: number = 1, _provinceId?: string | number, _limit?: number): Promise<ServiceResponse<County[]>> {
    return this.createError('getCounties is not supported in V1');
  }
}
