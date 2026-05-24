import { BaseService } from '../services/BaseService';
import { SupportTicket, ServiceResponse } from '../models';
import { SupportMapper } from '../utils/mappers';

export class SupportServiceV1 extends BaseService {
  async getMyTickets(page: number = 1, limit?: number): Promise<ServiceResponse<SupportTicket[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) formData.append('limit', limit.toString());
      const response = await this.client.post<any>('/0/0/destek/liste/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(SupportMapper.mapTicketList(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SupportServiceV1] Failed to fetch tickets:', error.message);
      return this.createError(error.message);
    }
  }
}
