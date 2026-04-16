import { BaseModel } from '../BaseModel';
import { Product } from './Product';

export class CartItem extends BaseModel {
  id: string; // Internal unique ID for the cart item
  product: Product;
  quantity: number;
  addedAt: number;

  constructor(data: Partial<CartItem>) {
    super();
    this.product = data.product || new Product({});
    this.id = data.id || `cart_${this.product.id || 'new'}_${Date.now()}`;
    this.quantity = data.quantity || 1;
    this.addedAt = data.addedAt || Date.now();
  }

  /**
   * Calculate total price for this item based on quantity and display price.
   */
  getTotalPrice(): number {
    return this.product.getDisplayPrice() * this.quantity;
  }

  /**
   * Instantiates a CartItem object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): CartItem {
    if (BaseModel.usePreviousApi) {
      return CartItem.legacyFromJSON(json);
    }
    return CartItem.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): CartItem {
    return new CartItem({
      id: json.id || '',
      product: json.product ? Product.fromJSON(json.product) : undefined,
      quantity: json.quantity || 1,
      addedAt: json.addedAt || Date.now()
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): CartItem {
    return new CartItem({});
  }
}
