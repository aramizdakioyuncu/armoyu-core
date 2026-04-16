import { BaseModel } from '../BaseModel';
import { CartItem } from './CartItem';

export type OrderStatus = 'pending' | 'completed' | 'canceled' | 'shipped';

export class Order extends BaseModel {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: number;
  paymentMethod: 'credit_card' | 'armoyu_coin' | 'paypal';

  constructor(data: Partial<Order>) {
    super();
    this.id = data.id || '';
    this.items = data.items || [];
    this.total = data.total || 0;
    this.status = data.status || 'pending';
    this.createdAt = data.createdAt || Date.now();
    this.paymentMethod = data.paymentMethod || 'credit_card';
  }

  /**
   * Instantiates an Order object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): Order {
    if (BaseModel.usePreviousApi) {
      return Order.legacyFromJSON(json);
    }
    return Order.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): Order {
    return new Order({
      id: json.id || '',
      items: Array.isArray(json.items) ? json.items.map((i: any) => CartItem.fromJSON(i)) : [],
      total: json.total || json.total_amount || 0,
      status: (json.status || 'pending') as OrderStatus,
      createdAt: json.createdAt || json.created_at || Date.now(),
      paymentMethod: (json.paymentMethod || json.payment_method || 'credit_card') as 'credit_card' | 'armoyu_coin' | 'paypal'
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): Order {
    return new Order({});
  }

  /**
   * Returns a user-friendly status name in Turkish.
   */
  getStatusLabel(): string {
    switch (this.status) {
      case 'pending': return 'Hazırlanıyor';
      case 'completed': return 'Tamamlandı';
      case 'shipped': return 'Kargoya Verildi';
      case 'canceled': return 'İptal Edildi';
      default: return this.status;
    }
  }
}
