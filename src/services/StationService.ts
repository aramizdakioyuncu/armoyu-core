import { StationResponse, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';

/**
 * Service for information about physical stations or platform hubs.
 */
export class StationService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Get all hub/station locations.
   */
  async getStations(page: number = 1, category?: string | number): Promise<ServiceResponse<StationResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (category) {
        if (typeof category === 'number') {
          formData.append('limit', category.toString());
        } else {
          formData.append('kategori', category);
        }
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/istasyonlar/0/0/'), formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(data || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[StationService] Failed to fetch stations:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get equipment list for a specific station.
   */
  async getStationEquipment(stationId: string | number): Promise<ServiceResponse<any[]>> {
    try {
      const formData = new FormData();
      formData.append('istasyonID', stationId.toString());
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/istasyonlar/ekipman-listesi/0/'), formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(Array.isArray(data) ? data : [], response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StationService] Failed to fetch equipment for station ${stationId}:`, error);
      return this.createError(error.message);
    }
  }
}
