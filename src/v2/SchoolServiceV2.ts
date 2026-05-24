import { BaseService } from '../services/BaseService';
import { ServiceResponse } from '../api/ServiceResponse';

export class SchoolServiceV2 extends BaseService {
  async getUserSchools(_page: number, _limit?: number, _userId?: number): Promise<ServiceResponse<any[]>> {
    return this.createError('getUserSchools is not supported in V2 yet');
  }
}
