/**
 * Represents an invoice or payment record.
 */
export class Invoice {
  id: number = 0;
  userId: number = 0;
  amount: number = 0;
  description: string = '';
  type: string = '';
  status: number = 0;
  date: string = '';

  constructor(data: Partial<Invoice>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates an Invoice object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): Invoice {
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
}
