import { InvoiceResponse, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';

/**
 * Service for managing payments, transactions, and store billing.
 */
export class PaymentService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Get invoices/payment history for the current user.
   */
  async getInvoices(page: number = 1): Promise<ServiceResponse<InvoiceResponse[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      const response = await this.client.post<any>('/0/0/faturalarim/0/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(data || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[PaymentService] Failed to fetch invoices:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Alias for getInvoices for backward compatibility or different naming conventions.
   */
  async getTransactionHistory(): Promise<ServiceResponse<InvoiceResponse[]>> {
    return this.getInvoices();
  }
}

