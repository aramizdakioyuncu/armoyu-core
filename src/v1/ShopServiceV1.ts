import { BaseService } from '../services/BaseService';
import { Product, Order, ShopResponseDTO, ShopProductDTO, ServiceResponse } from '../models';
import { ShopMapper } from '../utils/mappers/shop/ShopMapper';
import { UpdateShopParams, CreateProductParams } from '../models/dto/shop/ShopDTO';

export class ShopServiceV1 extends BaseService {
  async getProducts(page: number = 1, options?: { category?: string; searchTerm?: string; limit?: number }): Promise<ServiceResponse<Product[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (options?.limit) formData.append('limit', options.limit.toString());
      if (options?.category) formData.append('kategori', options.category);
      if (options?.searchTerm) formData.append('arama', options.searchTerm);
      const response = await this.client.post<any>('/0/0/market/0/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(ShopMapper.mapProductList(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ShopServiceV1] Failed to fetch products:', error.message);
      return this.createError(error.message);
    }
  }

  async getProductDetails(productId: string | number): Promise<ServiceResponse<Product | null>> {
    try {
      const formData = new FormData();
      formData.append('urunID', productId.toString());
      const response = await this.client.post<any>('/0/0/market/detay/0/', formData);
      const data = this.handle<any>(response);
      return this.createSuccess(data ? ShopMapper.mapProduct(data) : null, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ShopServiceV1] Failed to fetch product ${productId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async createOrder(params: { items: { productId: number; quantity: number }[] }): Promise<ServiceResponse<Order>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('urunler', JSON.stringify(params.items));
      const response = await this.client.post<any>('/0/0/market/satin-al/0/', formData);
      const data = this.handle<any>(response);
      return this.createSuccess(data ? ShopMapper.mapOrder(data) : ({} as Order), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ShopServiceV1] Order creation failed:', error.message);
      return this.createError(error.message);
    }
  }

  async getShops(_page?: number, _limit?: number): Promise<ServiceResponse<ShopResponseDTO[]>> {
    return this.createError('getShops is not supported in V1');
  }

  async getShop(_shopId: number): Promise<ServiceResponse<ShopResponseDTO | null>> {
    return this.createError('getShop is not supported in V1');
  }

  async updateShop(_shopId: number, _params: UpdateShopParams): Promise<ServiceResponse<boolean>> {
    return this.createError('updateShop is not supported in V1');
  }

  async deleteShop(_shopId: number): Promise<ServiceResponse<boolean>> {
    return this.createError('deleteShop is not supported in V1');
  }

  async getShopProducts(_shopId: number, _page?: number, _limit?: number): Promise<ServiceResponse<ShopProductDTO[]>> {
    return this.createError('getShopProducts is not supported in V1');
  }

  async getProduct(_productId: number): Promise<ServiceResponse<ShopProductDTO | null>> {
    return this.createError('getProduct is not supported in V1');
  }

  async createProduct(_params: CreateProductParams): Promise<ServiceResponse<ShopProductDTO>> {
    return this.createError('createProduct is not supported in V1');
  }

  async deleteProduct(_productId: number): Promise<ServiceResponse<boolean>> {
    return this.createError('deleteProduct is not supported in V1');
  }
}
