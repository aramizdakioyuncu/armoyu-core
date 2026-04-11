import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';

/**
 * Service for managing businesses, schools, and professional profiles.
 * @checked 2026-04-12
 */
export class BusinessService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Fetches the list of schools associated with a player (Legacy).
   * 
   * @param userId Optional user ID to view schools for (oyuncubakid)
   */
  async getUserSchools(userId?: number): Promise<any> {
    try {
      const formData = new FormData();
      if (userId !== undefined) {
        formData.append('oyuncubakid', userId.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/okullarim/0/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[BusinessService] Fetching player schools failed:`, error);
      return null;
    }
  }

  /**
   * Fetches the list of stations associated with a player (Legacy).
   * 
   * @param userId Optional user ID to view stations for (oyuncubakid)
   */
  async getUserStations(userId?: number): Promise<any> {
    try {
      const formData = new FormData();
      if (userId !== undefined) {
        formData.append('oyuncubakid', userId.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/istasyonlarim/0/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[BusinessService] Fetching player stations failed:`, error);
      return null;
    }
  }
}
