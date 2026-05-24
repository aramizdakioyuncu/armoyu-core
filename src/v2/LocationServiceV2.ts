import { BaseService } from '../services/BaseService';
import { Country, Province, County, ServiceResponse } from '../models';
import { LocationMapper } from '../utils/mappers/core/LocationMapper';

/**
 * Modern V2 (CURRENT) implementation for LocationService.
 *
 * Endpoints:
 *   GET /v1/country?page&limit              → list countries
 *   GET /v1/province?countryId&page&limit   → list provinces
 */
export class LocationServiceV2 extends BaseService {
  async getCountries(page: number = 1, limit?: number): Promise<ServiceResponse<Country[]>> {
    try {
      const query = new URLSearchParams({ page: page.toString() });
      if (limit) query.set('limit', limit.toString());

      const response = await this.client.get<any>(`/v1/country?${query}`);
      const data = this.handle<any[]>(response);
      const mapped = LocationMapper.mapCountryList(data || []);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[LocationServiceV2] Failed to fetch countries:', error.message);
      return this.createError(error.message);
    }
  }

  async getProvinces(page: number = 1, countryId?: string | number, limit?: number): Promise<ServiceResponse<Province[]>> {
    try {
      const query = new URLSearchParams({ page: page.toString() });
      if (countryId !== undefined) query.set('countryId', countryId.toString());
      if (limit !== undefined) query.set('limit', limit.toString());

      const response = await this.client.get<any>(`/v1/province?${query}`);
      const data = this.handle<any[]>(response);
      const mapped = LocationMapper.mapProvinceList(data || []);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[LocationServiceV2] Failed to fetch provinces:', error.message);
      return this.createError(error.message);
    }
  }

  async getCounties(page: number = 1, provinceId?: string | number, limit?: number): Promise<ServiceResponse<County[]>> {
    try {
      const query = new URLSearchParams({ page: page.toString() });
      if (provinceId !== undefined) query.set('provinceId', provinceId.toString());
      if (limit !== undefined) query.set('limit', limit.toString());

      const response = await this.client.get<any>(`/v1/county?${query}`);
      const data = this.handle<any[]>(response);
      const mapped = LocationMapper.mapCountyList(data || []);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[LocationServiceV2] Failed to fetch counties:', error.message);
      return this.createError(error.message);
    }
  }
}
