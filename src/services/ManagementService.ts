import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';

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
   * 
   * @param category The management category (e.g. 'home', 'stats', etc.)
   * @returns Raw management data or structured report
   */
  async getManagementContent(category: string = 'home'): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('category', category);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/yonetim-paneli/0/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[ManagementService] Fetching management content for ${category} failed:`, error);
      return null;
    }
  }

  /**
   * Fetches meeting records and details.
   */
  async getMeetings(): Promise<any> {
    return this.getManagementContent('meeting');
  }
}
