import { SupportTicket } from '../models/social/SupportTicket';
import { BaseService } from './BaseService';

export class SupportService extends BaseService {
  /**
   * Create a new support ticket.
   */
  async createTicket(subject: string, message: string, category: string): Promise<SupportTicket> {
    try {
      const response = await this.client.post<{ ticket: any }>('/social/support/tickets', {
        subject,
        message,
        category
      });
      return SupportTicket.fromJSON(response.ticket);
    } catch (error) {
      console.error('[SupportService] Failed to create ticket:', error);
      throw error;
    }
  }

  /**
   * Get all tickets for the authenticated user.
   */
  async getMyTickets(): Promise<SupportTicket[]> {
    try {
      const response = await this.client.get<{ tickets: any[] }>('/social/support/my-tickets');
      return response.tickets.map(t => SupportTicket.fromJSON(t));
    } catch (error) {
      console.error('[SupportService] Failed to fetch user tickets:', error);
      return [];
    }
  }

  /**
   * Get a single ticket details and its messages.
   */
  async getTicketDetails(ticketId: string): Promise<SupportTicket | null> {
    try {
      const response = await this.client.get<any>(`/social/support/tickets/${ticketId}`);
      return SupportTicket.fromJSON(response);
    } catch (error) {
      console.error(`[SupportService] Failed to fetch ticket ${ticketId}:`, error);
      return null;
    }
  }
}
