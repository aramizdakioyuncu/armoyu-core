import { BaseService } from '../services/BaseService';
import { InvoiceResponse, ServiceResponse } from '../models';
import { PaymentMapper } from '../utils/mappers/shop/PaymentMapper';

export class PaymentServiceV1 extends BaseService {
  async getInvoices(page: number = 1): Promise<ServiceResponse<InvoiceResponse[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());

      const response = await this.client.post<any>('/0/0/faturalarim/0/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(PaymentMapper.mapInvoiceList(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[PaymentServiceV1] Failed to fetch invoices:', error.message);
      return this.createError(error.message);
    }
  }

  async getInvoice(_id: number): Promise<ServiceResponse<InvoiceResponse>> {
    return this.createError('getInvoice is not supported in V1');
  }

  async updateInvoice(_id: number, _paymentId: string): Promise<ServiceResponse<InvoiceResponse>> {
    return this.createError('updateInvoice is not supported in V1');
  }

  async deleteInvoice(_id: number): Promise<ServiceResponse<boolean>> {
    return this.createError('deleteInvoice is not supported in V1');
  }
}
