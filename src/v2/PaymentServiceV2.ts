import { BaseService } from '../services/BaseService';
import { InvoiceResponse, ServiceResponse } from '../models';
import { PaymentMapper } from '../utils/mappers/shop/PaymentMapper';

export class PaymentServiceV2 extends BaseService {
  async getInvoices(page: number = 1): Promise<ServiceResponse<InvoiceResponse[]>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>(`/v1/payments?page=${page}`);
      const data = this.handle<any[]>(response);
      return this.createSuccess(PaymentMapper.mapInvoiceList(data || []), response?.aciklama, response?.aciklamadetay);
    } catch (error: any) {
      this.logger.error('[PaymentServiceV2] Failed to fetch invoices:', error.message);
      return this.createError(error.message);
    }
  }

  async getInvoice(id: number): Promise<ServiceResponse<InvoiceResponse>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>(`/v1/payments/${id}`);
      const data = this.handle<any>(response);
      return this.createSuccess(PaymentMapper.mapInvoice(data), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[PaymentServiceV2] Failed to fetch invoice ${id}:`, error.message);
      return this.createError(error.message);
    }
  }

  async updateInvoice(id: number, paymentId: string): Promise<ServiceResponse<InvoiceResponse>> {
    this.requireAuth();
    try {
      const response = await this.client.patch<any>(`/v1/payments/${id}`, { paymentID: paymentId });
      const data = this.handle<any>(response);
      return this.createSuccess(PaymentMapper.mapInvoice(data), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[PaymentServiceV2] Failed to update invoice ${id}:`, error.message);
      return this.createError(error.message);
    }
  }

  async deleteInvoice(id: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.delete<any>(`/v1/payments/${id}`);
      this.handle<any>(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[PaymentServiceV2] Failed to delete invoice ${id}:`, error.message);
      return this.createError(error.message);
    }
  }
}
