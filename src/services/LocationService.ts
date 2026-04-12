import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { Country } from '../models/core/Country';
import { Province } from '../models/core/Province';

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
   * 
   * @param page The page number (sayfa)
   * @param limit Results limit
   * @returns List of countries
   */
  async getCountries(page: number = 1, limit?: number): Promise<Country[]> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) {
        formData.append('limit', limit.toString());
      }

      const url = this.resolveBotPath('/0/0/ulkeler/0/0/');
      const response = await this.client.post<any>(url, formData);
      const data = this.handleResponse<any[]>(response);
      
      return Array.isArray(data) ? data.map(item => Country.fromJSON(item)) : [];
    } catch (error) {
      this.logger.error('[LocationService] Failed to fetch countries:', error);
      return [];
    }
  }

  /**
   * Fetches the list of provinces/cities for a specific country (Legacy).
   * 
   * @param countryId The ID of the country (countryID)
   * @param page The page number (sayfa)
   * @param limit Results limit
   * @returns List of provinces
   */
  async getProvinces(countryId: number | string = 212, page: number = 1, limit?: number): Promise<Province[]> {
    try {
      const formData = new FormData();
      formData.append('countryID', countryId.toString());
      formData.append('sayfa', page.toString());
      if (limit !== undefined) {
        formData.append('limit', limit.toString());
      }

      const url = this.resolveBotPath('/0/0/iller/0/0/');
      const response = await this.client.post<any>(url, formData);
      const data = this.handleResponse<any[]>(response);
      
      return Array.isArray(data) ? data.map(item => Province.fromJSON(item)) : [];
    } catch (error) {
      this.logger.error(`[LocationService] Failed to fetch provinces for country ${countryId}:`, error);
      return [];
    }
  }
}
