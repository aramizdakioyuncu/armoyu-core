import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ServiceResponse } from '../api/ServiceResponse';
import { StaffUserResponse, StaffUser } from '../models';
import { UserMapper } from '../utils/mappers/user/UserMapper';

/**
 * Service for information about platform staff and administrators.
 */
export class StaffService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Get all platform staff members and their roles.
   */
  async getStaff(page: number = 1, category?: string, limit?: number): Promise<ServiceResponse<StaffUser[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) formData.append('limit', limit.toString());
      if (category !== undefined) formData.append('kategori', category);

      const response = await this.client.post<any>('/0/0/ekibimiz/0/0/', formData);
      const data = this.handle<any[]>(response);
      const mapped = UserMapper.mapStaffList(data || []);
      
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[StaffService] Failed to fetch staff list:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Alias for getStaff to maintain compatibility with existing tests.
   */
  async getStaffList(page: number = 1): Promise<ServiceResponse<StaffUser[]>> {
    return this.getStaff(page);
  }

  /**
   * Get staff applications.
   */
  async getApplications(page: number = 1, limit?: number): Promise<ServiceResponse<any[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) formData.append('limit', limit.toString());

      const response = await this.client.post<any>('/0/0/yonetim/basvurular/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(Array.isArray(data) ? data : [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[StaffService] Failed to fetch applications:', error);
      return this.createError(error.message);
    }
  }
}

