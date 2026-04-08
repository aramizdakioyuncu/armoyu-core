import { Product } from '../models/shop/Product';
import { Order } from '../models/shop/Order';
import { BaseService } from './BaseService';

export class ShopService extends BaseService {
  /**
   * Get all products with optional filters.
   */
  async getProducts(category?: string, searchTerm?: string): Promise<Product[]> {
    try {
      const response = await this.client.get<{ products: any[] }>('/shop/products', {
        params: { category, q: searchTerm }
      });
      return response.products.map(p => Product.fromJSON(p));
    } catch (error) {
      console.error('[ShopService] Failed to fetch products:', error);
      return [];
    }
  }

  /**
   * Get detailed information for a specific product.
   */
  async getProductDetails(productId: string): Promise<Product | null> {
    try {
      const response = await this.client.get<any>(`/shop/products/${productId}`);
      return Product.fromJSON(response);
    } catch (error) {
      console.error(`[ShopService] Failed to fetch product ${productId}:`, error);
      return null;
    }
  }

  /**
   * Create a new purchase order.
   */
  async createOrder(items: { productId: number; quantity: number }[]): Promise<Order> {
    try {
      const response = await this.client.post<{ order: any }>('/shop/orders', { items });
      return Order.fromJSON(response.order);
    } catch (error) {
      console.error('[ShopService] Order creation failed:', error);
      throw error;
    }
  }
}
