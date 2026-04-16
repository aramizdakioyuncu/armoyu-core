import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ServiceResponse } from '../api/ServiceResponse';

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
   */
  async getUserSchools(page: number = 1, limit?: number, userId?: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) {
        formData.append('limit', limit.toString());
      }
      if (userId !== undefined) {
        formData.append('oyuncubakid', userId.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/okullarim/${page}/`), formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[BusinessService] Fetching player schools failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the list of stations associated with a player (Legacy).
   */
  async getUserStations(page: number = 1, limit?: number, userId?: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) {
        formData.append('limit', limit.toString());
      }
      if (userId !== undefined) {
        formData.append('oyuncubakid', userId.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/istasyonlarim/${page}/`), formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[BusinessService] Fetching player stations failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Joins a specific business/workplace unit (Legacy).
   */
  async joinBusiness(params: {
    businessId: string | number;
    classId: string | number;
    branchId: string | number;
    classPassword?: string;
  }): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('isyeriidi', params.businessId.toString());
      formData.append('hangisinif', params.classId.toString());
      formData.append('hangibrans', params.branchId.toString());
      formData.append('sinifsifresi', params.classPassword || '');

      const url = this.resolveBotPath('/0/0/isyerleri/katilim/0/');
      const response = await this.client.post<any>(url, formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[BusinessService] Joining business failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the content/sub-units of a specific business (e.g. classes in a school) (Legacy).
   */
  async getBusinessContent(businessId: string | number): Promise<ServiceResponse<any[]>> {
    try {
      const formData = new FormData();
      formData.append('hangisyeri', businessId.toString());

      const url = this.resolveBotPath('/0/0/isyerleri/icerik/0/');
      const response = await this.client.post<any>(url, formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(data, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[BusinessService] Fetching business content failed:`, error);
      return this.createError(error.message);
    }
  }
}



