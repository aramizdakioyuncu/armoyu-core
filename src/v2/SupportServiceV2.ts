import { BaseService } from '../services/BaseService';
import { SupportTicket, ServiceResponse } from '../models';

export class SupportServiceV2 extends BaseService {
  async getMyTickets(_page?: number, _limit?: number): Promise<ServiceResponse<SupportTicket[]>> {
    return this.createError('getMyTickets is not supported in V2 yet');
  }
}
