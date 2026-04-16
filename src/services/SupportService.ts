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
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
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
      const icerik = this.handleResponse<{ ticket: any }>(response);
      const ticket = SupportTicket.fromJSON(icerik.ticket);
      return this.createSuccess(ticket, response?.aciklama);
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
      const icerik = this.handleResponse<{ tickets: any[] }>(response);
      const tickets = icerik.tickets.map(t => SupportTicket.fromJSON(t));
      return this.createSuccess(tickets, response?.aciklama);
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
      const icerik = this.handleResponse<any>(response);
      const ticket = SupportTicket.fromJSON(icerik);
      return this.createSuccess(ticket, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SupportService] Failed to fetch ticket ${ticketId}:`, error);
      return this.createError(error.message);
    }
  }
}
