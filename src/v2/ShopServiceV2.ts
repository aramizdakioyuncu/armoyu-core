import { BaseService } from '../services/BaseService';
import { Product, Order, ShopResponseDTO, ShopProductDTO, ServiceResponse } from '../models';
import { ShopMapper } from '../utils/mappers/shop/ShopMapper';
import { UpdateShopParams, CreateProductParams } from '../models/dto/shop/ShopDTO';

export class ShopServiceV2 extends BaseService {
  async getShops(page: number = 1, limit?: number): Promise<ServiceResponse<ShopResponseDTO[]>> {
    try {
      let url = `/v1/shop?page=${page}`;
      if (limit) url += `&limit=${limit}`;
      const response = await this.client.get<any>(url);
      const data = this.handle<any[]>(response);
      return this.createSuccess(ShopMapper.mapShopList(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ShopServiceV2] Failed to fetch shops:', error.message);
      return this.createError(error.message);
    }
  }

  async getShop(shopId: number): Promise<ServiceResponse<ShopResponseDTO | null>> {
    try {
      const response = await this.client.get<any>(`/v1/shop/${shopId}`);
      const data = this.handle<any>(response);
      return this.createSuccess(data ? ShopMapper.mapShop(data) : null, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ShopServiceV2] Failed to fetch shop ${shopId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async updateShop(shopId: number, params: UpdateShopParams): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const body: Record<string, any> = {};
      if (params.name !== undefined) body.name = params.name;
      if (params.description !== undefined) body.description = params.description;
      if (params.logo !== undefined) body.logo = params.logo;
      if (params.logoSmall !== undefined) body.logo_small = params.logoSmall;
      if (params.logoTiny !== undefined) body.logo_tiny = params.logoTiny;
      const response = await this.client.put<any>(`/v1/shop/${shopId}`, body);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ShopServiceV2] Failed to update shop ${shopId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async deleteShop(shopId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.delete<any>(`/v1/shop/${shopId}`);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ShopServiceV2] Failed to delete shop ${shopId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async getShopProducts(shopId: number, page: number = 1, limit?: number): Promise<ServiceResponse<ShopProductDTO[]>> {
    try {
      let url = `/v1/shop/${shopId}/products?page=${page}`;
      if (limit) url += `&limit=${limit}`;
      const response = await this.client.get<any>(url);
      const data = this.handle<any[]>(response);
      return this.createSuccess(ShopMapper.mapShopProductList(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ShopServiceV2] Failed to fetch products for shop ${shopId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async getProduct(productId: number): Promise<ServiceResponse<ShopProductDTO | null>> {
    try {
      const response = await this.client.get<any>(`/v1/shop/products/${productId}`);
      const data = this.handle<any>(response);
      return this.createSuccess(data ? ShopMapper.mapShopProduct(data) : null, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ShopServiceV2] Failed to fetch product ${productId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async createProduct(params: CreateProductParams): Promise<ServiceResponse<ShopProductDTO>> {
    this.requireAuth();
    try {
      const body: Record<string, any> = {
        name: params.name,
        price: params.price,
        url: params.url
      };
      if (params.description !== undefined) body.description = params.description;
      if (params.shipping !== undefined) body.shipping = params.shipping;
      if (params.categoryId !== undefined) body.categoryId = params.categoryId;
      if (params.imageIds !== undefined) body.imageIds = params.imageIds;
      if (params.shopId !== undefined) body.shopId = params.shopId;
      const response = await this.client.post<any>('/v1/shop/products', body);
      const data = this.handle<any>(response);
      return this.createSuccess(ShopMapper.mapShopProduct(data), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ShopServiceV2] Failed to create product:', error.message);
      return this.createError(error.message);
    }
  }

  async deleteProduct(productId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.delete<any>(`/v1/shop/products/${productId}`);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ShopServiceV2] Failed to delete product ${productId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async getProducts(_page?: number, _options?: { category?: string; searchTerm?: string; limit?: number }): Promise<ServiceResponse<Product[]>> {
    return this.createError('getProducts is not supported in V2 — use getShopProducts() to access products');
  }

  async getProductDetails(_productId: string | number): Promise<ServiceResponse<Product | null>> {
    return this.createError('getProductDetails is not supported in V2 — use getProduct() instead');
  }

  async createOrder(_params: { items: { productId: number; quantity: number }[] }): Promise<ServiceResponse<Order>> {
    return this.createError('createOrder is not supported in V2 yet');
  }
}
