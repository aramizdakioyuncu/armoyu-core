import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { Invoice } from '../models/shop/Invoice';

/**
 * Service for managing payments, invoices, and billing (Legacy).
 * @checked 2026-04-12
 */
export class PaymentService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Fetches the user's invoices (Legacy).
   * 
   * @returns List of invoices
   */
  async getInvoices(page: number = 1): Promise<Invoice[]> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      
      const url = this.resolveBotPath(`/0/0/odemeler/faturalar/${page}/`);
      const response = await this.client.post<any>(url, formData);
      const data = this.handleResponse<any[]>(response);
      
      return Array.isArray(data) ? data.map(item => Invoice.fromJSON(item)) : [];
    } catch (error) {
      this.logger.error('[PaymentService] Failed to fetch invoices:', error);
      return [];
    }
  }

  /**
   * Pays a specific invoice or item (Legacy).
   * 
   * @param paymentId The ID of the payment to process (paymentID)
   */
  async payInvoice(paymentId: number | string): Promise<any> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('paymentID', paymentId.toString());

      const url = this.resolveBotPath('/0/0/odemeler/ode/0/');
      const response = await this.client.post<any>(url, formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[PaymentService] Failed to process payment ${paymentId}:`, error);
      return null;
    }
  }
}
