import { BaseService } from '../services/BaseService';
import { ManagementUser, ManagementMeeting, ManagementCategory, ServiceResponse } from '../models';
import { ManagementMapper } from '../utils/mappers/core/ManagementMapper';

export class ManagementServiceV2 extends BaseService {
  async getUsers(): Promise<ServiceResponse<ManagementUser[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('category', ManagementCategory.HOME);

      const response = await this.client.post<any>('/v1/yonetim-paneli', formData);
      const data = this.handle<any[]>(response);
      const mapped = ManagementMapper.mapUserListV2(data || []);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ManagementServiceV2] Failed to fetch users:', error.message);
      return this.createError(error.message);
    }
  }

  async getMeetings(): Promise<ServiceResponse<ManagementMeeting[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('category', ManagementCategory.MEETING);

      const response = await this.client.post<any>('/v1/yonetim-paneli', formData);
      const data = this.handle<any[]>(response);
      const mapped = ManagementMapper.mapMeetingListV2(data || []);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ManagementServiceV2] Failed to fetch meetings:', error.message);
      return this.createError(error.message);
    }
  }
}
