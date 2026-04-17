import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { PlatformStation } from '../models/content/PlatformStation';
import { StationEquipment } from '../models/content/StationEquipment';
import { ServiceResponse } from '../api/ServiceResponse';

/**
 * Service for managing platform stations and their equipment (Legacy).
 * @checked 2026-04-12
 */
export class StationService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger, usePreviousVersion: boolean = false) {
    super(client, logger, usePreviousVersion);
  }

  /**
   * Fetches the list of stations.
   */
  async getStations(page: number, category?: string): Promise<ServiceResponse<PlatformStation[]>> {
    try {
      const formData = new FormData();
      if (category !== undefined) {
        formData.append('kategori', category);
      }
      formData.append('sayfa', page.toString());

      const url = this.resolveBotPath(`/0/0/istasyonlar/liste/${page}/`);
      const response = await this.client.post<any>(url, formData);
      const data = this.handle<any[]>(response);
      
      return this.createSuccess(data || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[StationService] Failed to fetch stations:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the equipment available at a specific station (Legacy).
   */
  async getStationEquipment(stationId: number | string): Promise<ServiceResponse<StationEquipment[]>> {
    try {
      const formData = new FormData();
      formData.append('istasyonID', stationId.toString());

      const url = this.resolveBotPath('/0/0/istasyonlar/ekipmanlar/0/');
      const response = await this.client.post<any>(url, formData);
      const data = this.handle<any[]>(response);
      
      return this.createSuccess(data || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StationService] Failed to fetch equipment for station ${stationId}:`, error);
      return this.createError(error.message);
    }
  }
}



