import { BaseService } from '../services/BaseService';
import { ServiceResponse } from '../api/ServiceResponse';
import { StaffUser } from '../models';

export class StaffServiceV2 extends BaseService {
  async getStaff(_page?: number, _category?: string, _limit?: number): Promise<ServiceResponse<StaffUser[]>> {
    return this.createError('getStaff is not supported in V2 yet');
  }

  async getApplications(_page?: number, _limit?: number): Promise<ServiceResponse<any[]>> {
    return this.createError('getApplications is not supported in V2 yet');
  }
}
