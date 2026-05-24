import { InvoiceDTO, InvoiceItemDTO } from '../../../models';
import { BaseMapper } from '../BaseMapper';

export class PaymentMapper extends BaseMapper {
  static mapInvoiceItem(raw: any): InvoiceItemDTO {
    return {
      id: this.toNumber(raw.item_ID),
      productId: this.toNumber(raw.product_ID),
      productName: raw.product_name || '',
      unitPrice: this.toNumber(raw.unit_price),
      quantity: this.toNumber(raw.quantity),
      date: raw.item_time || ''
    };
  }

  static mapInvoice(raw: any): InvoiceDTO {
    const owner = raw.invoice_owner || {};
    return {
      id: this.toNumber(raw.invoice_ID),
      name: raw.invoice_name || '',
      date: raw.invoice_time || '',
      price: this.toNumber(raw.invoice_price),
      vat: this.toNumber(raw.invoice_vat),
      total: this.toNumber(raw.invoice_total),
      status: this.toNumber(raw.invoice_status),
      paymentId: raw.invoice_paymentID || '',
      owner: {
        id: this.toNumber(owner.player_ID),
        username: owner.player_userlogin || '',
        displayName: owner.player_displayname || '',
        avatar: this.toImageUrl(owner.player_avatar) || ''
      },
      items: Array.isArray(raw.invoice_items)
        ? raw.invoice_items.map((i: any) => this.mapInvoiceItem(i))
        : undefined
    };
  }

  static mapInvoiceList(rawList: any[]): InvoiceDTO[] {
    return (rawList || []).map(item => this.mapInvoice(item));
  }
}
