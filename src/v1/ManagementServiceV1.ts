import { BaseService } from '../services/BaseService';
import { ManagementUser, ManagementMeeting, ManagementCategory, ServiceResponse } from '../models';
import { ManagementMapper } from '../utils/mappers/core/ManagementMapper';

export class ManagementServiceV1 extends BaseService {
  async getUsers(): Promise<ServiceResponse<ManagementUser[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('category', ManagementCategory.HOME);

      const response = await this.client.post<any>('/0/0/yonetim-paneli/0/0/', formData);
      const data = this.handle<any[]>(response);
      const mapped = ManagementMapper.mapUserListV1(data || []);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ManagementServiceV1] Failed to fetch users:', error.message);
      return this.createError(error.message);
    }
  }

  async getMeetings(): Promise<ServiceResponse<ManagementMeeting[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('category', ManagementCategory.MEETING);

      const response = await this.client.post<any>('/0/0/yonetim-paneli/0/0/', formData);
      const data = this.handle<any[]>(response);
      const mapped = ManagementMapper.mapMeetingListV1(data || []);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ManagementServiceV1] Failed to fetch meetings:', error.message);
      return this.createError(error.message);
    }
  }
}
