import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { Country } from '../models/core/Country';
import { Province } from '../models/core/Province';
import { ServiceResponse } from '../api/ServiceResponse';

/**
 * Service for managing geographical data, countries, and provinces (Legacy).
 * @checked 2026-04-12
 */
export class LocationService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Fetches the list of countries (Legacy).
   */
  async getCountries(page: number, limit?: number): Promise<ServiceResponse<Country[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) {
        formData.append('limit', limit.toString());
      }

      const url = this.resolveBotPath(`/0/0/ulkeler/${page}/${limit || 0}/`);
      const response = await this.client.post<any>(url, formData);
      const data = this.handleResponse<any[]>(response);
      const countries = Array.isArray(data) ? data.map(item => Country.fromJSON(item)) : [];
      
      return this.createSuccess(countries, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[LocationService] Failed to fetch countries:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the list of provinces/cities for a specific country (Legacy).
   */
  async getProvinces(page: number, countryId: number | string = 212, limit?: number): Promise<ServiceResponse<Province[]>> {
    try {
      const formData = new FormData();
      formData.append('countryID', countryId.toString());
      formData.append('sayfa', page.toString());
      if (limit !== undefined) {
        formData.append('limit', limit.toString());
      }

      const url = this.resolveBotPath(`/0/0/iller/${page}/${limit || 0}/`);
      const response = await this.client.post<any>(url, formData);
      const data = this.handleResponse<any[]>(response);
      const provinces = Array.isArray(data) ? data.map(item => Province.fromJSON(item)) : [];
      
      return this.createSuccess(provinces, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[LocationService] Failed to fetch provinces for country ${countryId}:`, error);
      return this.createError(error.message);
    }
  }
}
