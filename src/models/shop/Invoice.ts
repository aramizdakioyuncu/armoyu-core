import { BaseModel } from '../BaseModel';

/**
 * Represents an invoice or payment record.
 */
export class Invoice extends BaseModel {
  id: number = 0;
  userId: number = 0;
  amount: number = 0;
  description: string = '';
  type: string = '';
  status: number = 0;
  date: string = '';

  constructor(data: Partial<Invoice>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates an Invoice object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): Invoice {
    if (BaseModel.usePreviousApi) {
      return Invoice.legacyFromJSON(json);
    }
    return Invoice.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): Invoice {
    return new Invoice({
      id: Number(json.payment_ID || json.fatura_ID || 0),
      userId: Number(json.payment_userId || json.fatura_userID || 0),
      amount: parseFloat(json.payment_amount || json.fatura_tutar || '0'),
      description: json.payment_description || json.fatura_aciklama || '',
      type: json.payment_type || json.fatura_tipi || '',
      status: Number(json.payment_status || json.fatura_durum || 0),
      date: json.payment_date || json.fatura_tarih || ''
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): Invoice {
    return new Invoice({});
  }
}
