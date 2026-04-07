import { Product } from './Product';

export class CartItem {
  id: string; // Internal unique ID for the cart item
  product: Product;
  quantity: number;
  addedAt: number;

  constructor(data: Partial<CartItem>) {
    this.product = data.product || new Product({});
    this.id = data.id || `cart_${this.product.id}_${Date.now()}`;
    this.quantity = data.quantity || 1;
    this.addedAt = data.addedAt || Date.now();
  }

  /**
   * Calculate total price for this item based on quantity and display price.
   */
  getTotalPrice(): number {
    return this.product.getDisplayPrice() * this.quantity;
  }

  static fromJSON(json: any): CartItem {
    return new CartItem({
      id: json.id || '',
      product: json.product ? Product.fromJSON(json.product) : undefined,
      quantity: json.quantity || 1,
      addedAt: json.addedAt || Date.now()
    });
  }
}
