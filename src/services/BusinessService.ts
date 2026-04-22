import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ServiceResponse } from '../api/ServiceResponse';

/**
 * Service for business and professional platform features.
 */
export class BusinessService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Get schools associated with a user.
   */
  async getUserSchools(page: number, limit?: number, userId?: number): Promise<ServiceResponse<any[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit) formData.append('limit', limit.toString());
      if (userId) formData.append('oyuncubakid', userId.toString());

      const response = await this.client.post<any>('/0/0/okullarim/0/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(Array.isArray(data) ? data : [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[BusinessService] Failed to fetch schools:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get stations associated with a user.
   */
  async getUserStations(page: number, limit?: number, userId?: number): Promise<ServiceResponse<any[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit) formData.append('limit', limit.toString());
      if (userId) formData.append('oyuncubakid', userId.toString());

      const response = await this.client.post<any>('/0/0/istasyonlarim/0/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(Array.isArray(data) ? data : [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[BusinessService] Failed to fetch stations:', error);
      return this.createError(error.message);
    }
  }
}

