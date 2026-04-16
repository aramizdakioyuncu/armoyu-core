import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ServiceResponse } from '../api/ServiceResponse';

/**
 * Service for administrative and management tasks within the ARMOYU platform.
 * @checked 2026-04-12
 */
export class ManagementService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Fetches management/admin panel content.
   */
  async getManagementContent(category: string = 'home'): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('category', category);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/yonetim-paneli/0/0/'), formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ManagementService] Fetching management content for ${category} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches meeting records and details.
   */
  async getMeetings(): Promise<ServiceResponse<any>> {
    return this.getManagementContent('meeting');
  }
}



