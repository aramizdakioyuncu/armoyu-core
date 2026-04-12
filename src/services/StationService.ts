import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { PlatformStation } from '../models/content/PlatformStation';
import { StationEquipment } from '../models/content/StationEquipment';

/**
 * Service for managing platform stations and their equipment (Legacy).
 * @checked 2026-04-12
 */
export class StationService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Fetches the list of stations (Legacy).
   * 
   * @param category Optional station category (e.g. 'yemek', 'cafe')
   * @returns List of platform stations
   */
  async getStations(category?: string): Promise<PlatformStation[]> {
    try {
      const formData = new FormData();
      if (category !== undefined) {
        formData.append('kategori', category);
      }

      const url = this.resolveBotPath('/0/0/istasyonlar/liste/0/');
      const response = await this.client.post<any>(url, formData);
      const data = this.handleResponse<any[]>(response);
      
      return Array.isArray(data) ? data.map(item => PlatformStation.fromJSON(item)) : [];
    } catch (error) {
      this.logger.error('[StationService] Failed to fetch stations:', error);
      return [];
    }
  }

  /**
   * Fetches the equipment available at a specific station (Legacy).
   * 
   * @param stationId The ID of the station
   * @returns List of station equipment
   */
  async getStationEquipment(stationId: number | string): Promise<StationEquipment[]> {
    try {
      const formData = new FormData();
      formData.append('istasyonID', stationId.toString());

      const url = this.resolveBotPath('/0/0/istasyonlar/ekipmanlar/0/');
      const response = await this.client.post<any>(url, formData);
      const data = this.handleResponse<any[]>(response);
      
      return Array.isArray(data) ? data.map(item => StationEquipment.fromJSON(item)) : [];
    } catch (error) {
      this.logger.error(`[StationService] Failed to fetch equipment for station ${stationId}:`, error);
      return [];
    }
  }
}
