import { BaseService } from '../services/BaseService';
import { StationResponse, ServiceResponse } from '../models';

export class StationServiceV2 extends BaseService {
  /** category: INTERNET_KAFE / YEMEK; boşsa hepsi */
  async getStations(page: number = 1, category?: string | number): Promise<ServiceResponse<StationResponse[]>> {
    try {
      let url = `/v1/stations?page=${page}`;
      if (category) url += `&type=${encodeURIComponent(String(category))}`;
      const response = await this.client.get<any>(url);
      return this.createSuccess(this.handle<StationResponse[]>(response) || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[StationServiceV2] Failed to fetch stations:', error.message);
      return this.createError(error.message);
    }
  }

  /** Ekipman, ürün, ücret tablosu ve yönetme yetkisiyle (canManage) */
  async getStation(slug: string): Promise<ServiceResponse<any>> {
    try {
      const response = await this.client.get<any>(`/v1/stations/${encodeURIComponent(slug)}`);
      return this.createSuccess(this.handle<any>(response), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[StationServiceV2] Failed to fetch station:', error.message);
      return this.createError(error.message);
    }
  }

  async getStationEquipment(stationId: string | number): Promise<ServiceResponse<any[]>> {
    const station = await this.getStation(String(stationId));
    return station.durum === 1 ? this.createSuccess(station.icerik?.equipment || []) : this.createError(station.aciklama);
  }

  /** productId verilirse günceller; yalnızca sahibi ve yetkilileri */
  async saveProduct(slug: string, product: { name: string; price: number; category: string }, productId?: string): Promise<ServiceResponse<{ id: string }>> {
    this.requireAuth();
    try {
      const path = `/v1/stations/${encodeURIComponent(slug)}/products`;
      const response = productId
        ? await this.client.put<any>(`${path}/${encodeURIComponent(productId)}`, product)
        : await this.client.post<any>(path, product);
      return this.createSuccess(this.handle<{ id: string }>(response), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[StationServiceV2] Failed to save product:', error.message);
      return this.createError(error.message);
    }
  }

  async deleteProduct(slug: string, productId: string): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.delete<any>(`/v1/stations/${encodeURIComponent(slug)}/products/${encodeURIComponent(productId)}`);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[StationServiceV2] Failed to delete product:', error.message);
      return this.createError(error.message);
    }
  }

  async getUserStations(_page: number, _limit?: number, _userId?: number): Promise<ServiceResponse<any[]>> {
    return this.createError('getUserStations is not supported in V2 yet');
  }
}
