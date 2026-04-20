import { ProductResponse, OrderResponse, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ShopMapper } from '../utils/mappers';

/**
 * Service for managing the platform store, products, and purchase orders.
 */
export class ShopService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Get all products with optional filters.
   */
  async getProducts(page: number = 1, options?: { category?: string, searchTerm?: string, limit?: number }): Promise<ServiceResponse<ProductResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (options?.limit) formData.append('limit', options.limit.toString());
      if (options?.category) formData.append('kategori', options.category);
      if (options?.searchTerm) formData.append('arama', options.searchTerm);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/market/0/0/'), formData);
      const data = this.handle<any[]>(response);
      const mappedData = ShopMapper.mapProductList(data || []);
      return this.createSuccess(mappedData, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ShopService] Failed to fetch products:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get detailed information for a specific product.
   */
  async getProductDetails(productId: string | number): Promise<ServiceResponse<ProductResponse | null>> {
    try {
      const formData = new FormData();
      formData.append('urunID', productId.toString());
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/market/detay/0/'), formData);
      const data = this.handle<any>(response);
      const mappedData = data ? ShopMapper.mapProduct(data) : null;
      return this.createSuccess(mappedData, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ShopService] Failed to fetch product ${productId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Create a new purchase order.
   */
  async createOrder(params: { items: { productId: number; quantity: number }[] }): Promise<ServiceResponse<OrderResponse>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('urunler', JSON.stringify(params.items));
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/market/satin-al/0/'), formData);
      const data = this.handle<any>(response);
      const mappedData = data ? ShopMapper.mapOrder(data) : ({} as OrderResponse);
      return this.createSuccess(mappedData, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ShopService] Order creation failed:', error);
      return this.createError(error.message);
    }
  }
}
