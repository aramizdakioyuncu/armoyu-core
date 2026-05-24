import { BaseService } from '../services/BaseService';
import { ServiceResponse } from '../api/ServiceResponse';

export class SchoolServiceV1 extends BaseService {
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
      this.logger.error('[SchoolServiceV1] Failed to fetch schools:', error.message);
      return this.createError(error.message);
    }
  }
}
