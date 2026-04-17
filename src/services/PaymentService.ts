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
  constructor(client: ApiClient, logger: ArmoyuLogger, usePreviousVersion: boolean = false) {
    super(client, logger, usePreviousVersion);
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
      const data = this.handle<any[]>(response);
      
      return this.createSuccess(data || [], response?.aciklama);
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
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[PaymentService] Failed to process payment ${paymentId}:`, error);
      return this.createError(error.message);
    }
  }
}



