import { BaseService } from '../services/BaseService';
import { ServiceResponse, Workplace } from '../models';
import { WorkplaceType } from '../models/social/meta/WorkplaceEnums';
import { WorkplaceMapperV2 } from '../utils/mappersv2/WorkplaceMapperV2';

export interface WorkplaceParams {
  kurumadi: string;
  kurumturu: string;
  kurumturudetay: string;
  kurumkisaad: string;
  kurumhakkinda?: string;
  kurumurl?: string;
  kurumoyuncusayisi?: number;
}

/**
 * Modern V2 (CURRENT) implementation for WorkplaceService.
 *
 * Endpoints:
 *   GET    /v1/workplaces                   → list workplaces by type
 *   POST   /v1/workplaces                   → create a workplace
 *   PUT    /v1/workplaces/{id}              → update a workplace
 *   DELETE /v1/workplaces/{id}              → delete a workplace
 */
export class WorkplaceServiceV2 extends BaseService {
  /**
   * List workplaces filtered by type (okul, cafe, yemek, istasyon…).
   */
  async getWorkplaces(page: number = 1, limit?: number, type?: WorkplaceType): Promise<ServiceResponse<Workplace[]>> {
    try {
      const query = new URLSearchParams({ page: page.toString() });
      if (limit) query.set('limit', limit.toString());
      if (type) query.set('turu', type);

      const response = await this.client.get<any>(`/v1/workplaces?${query}`);
      const icerik = this.handle<any>(response);
      const mapped = WorkplaceMapperV2.mapWorkplaceList(Array.isArray(icerik) ? icerik : []);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[WorkplaceServiceV2] Failed to fetch workplaces:', error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Create a new workplace.
   * POST /v1/workplaces
   */
  async createWorkplace(params: WorkplaceParams): Promise<ServiceResponse<Workplace>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>('/v1/workplaces', params);
      const icerik = this.handle<any>(response);
      const mapped = WorkplaceMapperV2.mapWorkplace(icerik);
      if (!mapped) throw new Error('İşyeri verisi alınamadı.');
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[WorkplaceServiceV2] Failed to create workplace:', error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Update an existing workplace.
   * PUT /v1/workplaces/{id}
   */
  async updateWorkplace(workplaceId: number, params: Partial<WorkplaceParams>): Promise<ServiceResponse<Workplace>> {
    this.requireAuth();
    try {
      const response = await this.client.put<any>(`/v1/workplaces/${workplaceId}`, params);
      const icerik = this.handle<any>(response);
      const mapped = WorkplaceMapperV2.mapWorkplace(icerik);
      if (!mapped) throw new Error('İşyeri verisi alınamadı.');
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[WorkplaceServiceV2] Failed to update workplace ${workplaceId}:`, error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Delete a workplace.
   * DELETE /v1/workplaces/{id}
   */
  async deleteWorkplace(workplaceId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.delete<any>(`/v1/workplaces/${workplaceId}`);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[WorkplaceServiceV2] Failed to delete workplace ${workplaceId}:`, error.message);
      return this.createError(error.message);
    }
  }
}
