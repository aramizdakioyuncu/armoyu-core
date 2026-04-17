import { BaseService } from '../BaseService';
import { ServiceResponse } from '../../api/ServiceResponse';
import { NotificationCategory, NotificationSubCategory } from '../../models/social/notification/NotificationEnums';

/**
 * Handles user notifications and notification settings.
 */
export class UserNotificationService extends BaseService {
  async getNotifications(): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/bildirim/0/0/'), {});
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async getNotificationsHistory(
    page: number = 1, 
    limit: number = 20, 
    category?: NotificationCategory | string, 
    subCategory?: NotificationSubCategory | string
  ): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      formData.append('limit', limit.toString());
      if (category) formData.append('kategori', category);
      if (subCategory) formData.append('kategoridetay', subCategory);
      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/bildirimler/${page}/0/`), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async getNotificationSettings(): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/bildirimler/ayarlar/liste/'), {});
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async updateNotificationSettings(settings: Record<string, boolean | number>): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      Object.entries(settings).forEach(([key, value]) => {
        const val = typeof value === 'boolean' ? (value ? 1 : 0) : value;
        formData.append('notification[]', `${key}=${val}`);
      });
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/bildirimler/ayarlar/0/'), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }
}
