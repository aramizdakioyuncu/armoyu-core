import { BaseService } from '../services/BaseService';
import { ServiceResponse, Workplace } from '../models';
import { WorkplaceType } from '../models/social/meta/WorkplaceEnums';
import { WorkplaceParams } from '../v2/WorkplaceServiceV2';

/**
 * Legacy V1 (OLD) implementation for WorkplaceService.
 * V1 API has no workplace endpoints.
 */
export class WorkplaceServiceV1 extends BaseService {
  async getWorkplaces(_page?: number, _limit?: number, _type?: WorkplaceType): Promise<ServiceResponse<Workplace[]>> {
    return this.createError('İşyeri listeleme V1 API tarafından desteklenmiyor.');
  }

  async createWorkplace(_params: WorkplaceParams): Promise<ServiceResponse<Workplace>> {
    return this.createError('İşyeri oluşturma V1 API tarafından desteklenmiyor.');
  }

  async updateWorkplace(_workplaceId: number, _params: Partial<WorkplaceParams>): Promise<ServiceResponse<Workplace>> {
    return this.createError('İşyeri güncelleme V1 API tarafından desteklenmiyor.');
  }

  async deleteWorkplace(_workplaceId: number): Promise<ServiceResponse<boolean>> {
    return this.createError('İşyeri silme V1 API tarafından desteklenmiyor.');
  }
}
