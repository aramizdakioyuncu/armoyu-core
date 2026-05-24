import { BaseService } from './BaseService';
import { InvoiceResponse, ServiceResponse } from '../models';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { PaymentServiceV1 } from '../v1/PaymentServiceV1';
import { PaymentServiceV2 } from '../v2/PaymentServiceV2';

export class PaymentService extends BaseService {
  private version: PaymentServiceV1 | PaymentServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new PaymentServiceV1(client, logger)
      : new PaymentServiceV2(client, logger);
  }

  async getInvoices(page: number = 1): Promise<ServiceResponse<InvoiceResponse[]>> {
    return this.version.getInvoices(page);
  }

  async getInvoice(id: number): Promise<ServiceResponse<InvoiceResponse>> {
    return this.version.getInvoice(id);
  }

  async updateInvoice(id: number, paymentId: string): Promise<ServiceResponse<InvoiceResponse>> {
    return this.version.updateInvoice(id, paymentId);
  }

  async deleteInvoice(id: number): Promise<ServiceResponse<boolean>> {
    return this.version.deleteInvoice(id);
  }
}
