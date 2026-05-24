import { BaseService } from '../services/BaseService';
import { StationResponse, ServiceResponse } from '../models';

export class StationServiceV1 extends BaseService {
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
      const response = await this.client.post<any>('/0/0/istasyonlar/0/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(data || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[StationServiceV1] Failed to fetch stations:', error.message);
      return this.createError(error.message);
    }
  }

  async getStationEquipment(stationId: string | number): Promise<ServiceResponse<any[]>> {
    try {
      const formData = new FormData();
      formData.append('istasyonID', stationId.toString());
      const response = await this.client.post<any>('/0/0/istasyonlar/ekipman-listesi/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(Array.isArray(data) ? data : [], response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[StationServiceV1] Failed to fetch equipment for station ${stationId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async getUserStations(page: number, limit?: number, userId?: number): Promise<ServiceResponse<any[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit) formData.append('limit', limit.toString());
      if (userId) formData.append('oyuncubakid', userId.toString());
      const response = await this.client.post<any>('/0/0/istasyonlarim/0/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(Array.isArray(data) ? data : [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[StationServiceV1] Failed to fetch user stations:', error.message);
      return this.createError(error.message);
    }
  }
}
