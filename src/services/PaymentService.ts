import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { Invoice } from '../models/shop/Invoice';
import { ServiceResponse } from '../api/ServiceResponse';

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
   */
  async getInvoices(page: number = 1): Promise<ServiceResponse<Invoice[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      
      const url = this.resolveBotPath(`/0/0/odemeler/faturalar/${page}/`);
      const response = await this.client.post<any>(url, formData);
      const data = this.handleResponse<any[]>(response);
      const invoices = Array.isArray(data) ? data.map(item => Invoice.fromJSON(item)) : [];
      
      return this.createSuccess(invoices, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[PaymentService] Failed to fetch invoices:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Pays a specific invoice or item (Legacy).
   */
  async payInvoice(paymentId: number | string): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('paymentID', paymentId.toString());

      const url = this.resolveBotPath('/0/0/odemeler/ode/0/');
      const response = await this.client.post<any>(url, formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[PaymentService] Failed to process payment ${paymentId}:`, error);
      return this.createError(error.message);
    }
  }
}
