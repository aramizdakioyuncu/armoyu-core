import { OrderDTO, ProductDTO } from '../../dto/shop/ShopDTO';
import { Product } from './Product';

export class Order implements OrderDTO {
  id: number;
  total: number;
  status: string;
  createdAt?: string;
  date?: string;
  items?: Product[];

  constructor(data: OrderDTO) {
    this.id = data.id;
    this.total = data.total;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.date = data.date;
    this.items = data.items?.map(item => new Product(item));
  }

  /**
   * Returns true if order is completed.
   */
  get isCompleted(): boolean {
    return this.status === 'completed' || this.status === 'tamamlandi';
  }

  /**
   * Returns formatted total price.
   */
  get formattedTotal(): string {
    return `${this.total} ₺`;
  }

  /**
   * Returns count of items in order.
   */
  get itemCount(): number {
    return this.items?.length || 0;
  }

  /**
   * Factory method to create an Order from a DTO.
   */
  static fromJSON(data: OrderDTO): Order {
    return new Order(data);
  }

  /**
   * Converts the entity back to a DTO for API submission.
   */
  toJSON(): OrderDTO {
    return {
      id: this.id,
      total: this.total,
      status: this.status,
      createdAt: this.createdAt,
      date: this.date,
      items: this.items?.map(item => item.toJSON())
    };
  }
}
