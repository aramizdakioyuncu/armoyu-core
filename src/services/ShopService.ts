import { Product } from '../models/shop/Product';
import { Order } from '../models/shop/Order';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';

export class ShopService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }
  /**
   * Get all products with optional filters.
   */
  async getProducts(category?: string, searchTerm?: string): Promise<Product[]> {
    try {
      const response = await this.client.get<any>('/shop/products', {
        params: { category, q: searchTerm }
      });
      const icerik = this.handleResponse<{ products: any[] }>(response);
      return icerik.products.map(p => Product.fromJSON(p));
    } catch (error) {
      this.logger.error('[ShopService] Failed to fetch products:', error);
      return [];
    }
  }

  /**
   * Get detailed information for a specific product.
   */
  async getProductDetails(productId: string): Promise<Product | null> {
    try {
      const response = await this.client.get<any>(`/shop/products/${productId}`);
      const icerik = this.handleResponse<any>(response);
      return Product.fromJSON(icerik);
    } catch (error) {
      this.logger.error(`[ShopService] Failed to fetch product ${productId}:`, error);
      return null;
    }
  }

  /**
   * Create a new purchase order.
   */
  async createOrder(items: { productId: number; quantity: number }[]): Promise<Order> {
    try {
      const response = await this.client.post<any>('/shop/orders', { items });
      const icerik = this.handleResponse<{ order: any }>(response);
      return Order.fromJSON(icerik.order);
    } catch (error) {
      this.logger.error('[ShopService] Order creation failed:', error);
      throw error;
    }
  }
}
