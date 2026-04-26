import { SupportTicket, ServiceResponse } from '../models';
import { SupportMapper } from '../utils/mappers';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { BaseService } from './BaseService';

/**
 * Service for platform support, ticket management, and help center.
 */
export class SupportService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Get all support tickets filed by the user.
   */
  async getMyTickets(page: number = 1, limit?: number): Promise<ServiceResponse<SupportTicket[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) formData.append('limit', limit.toString());

      const response = await this.client.post<any>('/0/0/destek/liste/0/', formData);
      const data = this.handle<any[]>(response);
      const mapped = SupportMapper.mapTicketList(data || []);

      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SupportService] Failed to fetch tickets:', error);
      return this.createError(error.message);
    }
  }
}

