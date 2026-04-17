import { SupportTicket } from '../models/social/support/SupportTicket';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ServiceResponse } from '../api/ServiceResponse';

/**
 * Service for managing platform support tickets and user assistance.
 * @checked 2026-04-12
 */
export class SupportService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger, usePreviousVersion: boolean = false) {
    super(client, logger, usePreviousVersion);
  }

  /**
   * Create a new support ticket.
   */
  async createTicket(subject: string, message: string, category: string): Promise<ServiceResponse<SupportTicket>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>('/social/support/tickets', {
        subject,
        message,
        category
      });
      const icerik = this.handle<{ ticket: any }>(response);
      return this.createSuccess(icerik?.ticket || null, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SupportService] Failed to create ticket:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get all tickets for the authenticated user.
   */
  async getMyTickets(): Promise<ServiceResponse<SupportTicket[]>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>('/social/support/my-tickets');
      const icerik = this.handle<{ tickets: any[] }>(response);
      return this.createSuccess(icerik?.tickets || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SupportService] Failed to fetch user tickets:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get a single ticket details and its messages.
   */
  async getTicketDetails(ticketId: string): Promise<ServiceResponse<SupportTicket | null>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>(`/social/support/tickets/${ticketId}`);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik || null, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SupportService] Failed to fetch ticket ${ticketId}:`, error);
      return this.createError(error.message);
    }
  }
}



