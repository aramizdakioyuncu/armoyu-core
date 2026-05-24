import { BaseService } from '../services/BaseService';
import { ServiceResponse } from '../api/ServiceResponse';
import { StaffUser } from '../models';
import { UserMapper } from '../utils/mappers/user/UserMapper';

export class StaffServiceV1 extends BaseService {
  async getStaff(page: number = 1, category?: string, limit?: number): Promise<ServiceResponse<StaffUser[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) formData.append('limit', limit.toString());
      if (category !== undefined) formData.append('kategori', category);
      const response = await this.client.post<any>('/0/0/ekibimiz/0/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(UserMapper.mapStaffList(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[StaffServiceV1] Failed to fetch staff list:', error.message);
      return this.createError(error.message);
    }
  }

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
      this.logger.error('[StaffServiceV1] Failed to fetch applications:', error.message);
      return this.createError(error.message);
    }
  }
}
