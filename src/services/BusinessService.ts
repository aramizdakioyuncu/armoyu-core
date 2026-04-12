import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';

/**
 * Service for managing businesses, schools, and professional profiles.
 * @checked 2026-04-12
 */
export class BusinessService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Fetches the list of schools associated with a player (Legacy).
   * 
   * @param userId Optional user ID to view schools for (oyuncubakid)
   */
  async getUserSchools(userId?: number): Promise<any> {
    try {
      const formData = new FormData();
      if (userId !== undefined) {
        formData.append('oyuncubakid', userId.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/okullarim/0/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[BusinessService] Fetching player schools failed:`, error);
      return null;
    }
  }

  /**
   * Fetches the list of stations associated with a player (Legacy).
   * 
   * @param userId Optional user ID to view stations for (oyuncubakid)
   */
  async getUserStations(userId?: number): Promise<any> {
    try {
      const formData = new FormData();
      if (userId !== undefined) {
        formData.append('oyuncubakid', userId.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/istasyonlarim/0/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[BusinessService] Fetching player stations failed:`, error);
      return null;
    }
  }

  /**
   * Joins a specific business/workplace unit (Legacy).
   * 
   * @param params Joining parameters (businessId, classId, branchId, classPassword)
   */
  async joinBusiness(params: {
    businessId: string | number;
    classId: string | number;
    branchId: string | number;
    classPassword?: string;
  }): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('isyeriidi', params.businessId.toString());
      formData.append('hangisinif', params.classId.toString());
      formData.append('hangibrans', params.branchId.toString());
      formData.append('sinifsifresi', params.classPassword || '');

      const url = this.resolveBotPath('/0/0/isyerleri/katilim/0/');
      const response = await this.client.post<any>(url, formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[BusinessService] Joining business failed:`, error);
      return null;
    }
  }

  /**
   * Fetches the content/sub-units of a specific business (e.g. classes in a school) (Legacy).
   * 
   * @param businessId The ID of the business (hangisyeri)
   */
  async getBusinessContent(businessId: string | number): Promise<any[]> {
    try {
      const formData = new FormData();
      formData.append('hangisyeri', businessId.toString());

      const url = this.resolveBotPath('/0/0/isyerleri/icerik/0/');
      const response = await this.client.post<any>(url, formData);
      return this.handleResponse<any[]>(response);
    } catch (error) {
      this.logger.error(`[BusinessService] Fetching business content failed:`, error);
      return [];
    }
  }
}
