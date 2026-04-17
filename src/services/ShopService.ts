import { Product } from '../models/shop/Product';
import { Order } from '../models/shop/Order';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ServiceResponse } from '../api/ServiceResponse';

/**
 * Service for managing the platform store, products, and purchase orders.
 * @checked 2026-04-12
 */
export class ShopService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger, usePreviousVersion: boolean = false) {
    super(client, logger, usePreviousVersion);
  }

  /**
   * Get all products with optional filters.
   */
  async getProducts(category?: string, searchTerm?: string): Promise<ServiceResponse<Product[]>> {
    try {
      const response = await this.client.get<any>('/shop/products', {
        params: { category, q: searchTerm }
      });
      const icerik = this.handle<{ products: any[] }>(response);
      return this.createSuccess(icerik?.products || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ShopService] Failed to fetch products:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get detailed information for a specific product.
   */
  async getProductDetails(productId: string): Promise<ServiceResponse<Product | null>> {
    try {
      const response = await this.client.get<any>(`/shop/products/${productId}`);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik || null, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ShopService] Failed to fetch product ${productId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Create a new purchase order.
   */
  async createOrder(items: { productId: number; quantity: number }[]): Promise<ServiceResponse<Order>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>('/shop/orders', { items });
      const icerik = this.handle<{ order: any }>(response);
      return this.createSuccess(icerik?.order || null, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ShopService] Order creation failed:', error);
      return this.createError(error.message);
    }
  }
}



