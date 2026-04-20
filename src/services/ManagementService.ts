import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ServiceResponse } from '../api/ServiceResponse';

/**
 * Service for administrative and management actions.
 */
export class ManagementService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Get platform administrative settings (Legacy).
   */
  async getSettings(): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/yonetim/ayarlar/0/'), new FormData());
      const data = this.handle<any>(response);
      return this.createSuccess(data, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ManagementService] Failed to fetch settings:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get management content based on category.
   */
  async getManagementContent(category: string = 'home'): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('kategori', category);
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/yonetim/icerik/0/'), formData);
      const data = this.handle<any>(response);
      return this.createSuccess(data, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ManagementService] Failed to fetch management content:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get platform meetings list.
   */
  async getMeetings(): Promise<ServiceResponse<any[]>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/yonetim/toplantilar/0/'), new FormData());
      const data = this.handle<any[]>(response);
      return this.createSuccess(Array.isArray(data) ? data : [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ManagementService] Failed to fetch meetings:', error);
      return this.createError(error.message);
    }
  }
}
