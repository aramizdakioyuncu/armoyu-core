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

  async getProducts(page: number = 1, options?: { category?: string; searchTerm?: string; limit?: number }): Promise<ServiceResponse<Product[]>> {
    try {
      const query = new URLSearchParams({ page: page.toString() });
      if (options?.limit) query.set('limit', options.limit.toString());

      const response = await this.client.get<any>(`/v1/shop/products?${query}`);
      return this.createSuccess(this.handle<Product[]>(response) || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ShopServiceV2] Failed to fetch products:', error.message);
      return this.createError(error.message);
    }
  }

  async getProductDetails(productId: string | number): Promise<ServiceResponse<Product | null>> {
    try {
      const response = await this.client.get<any>(`/v1/shop/products/${productId}`);
      return this.createSuccess(this.handle<Product>(response), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ShopServiceV2] Failed to fetch product ${productId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async getCart(): Promise<ServiceResponse<any[]>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>('/v1/shop/cart');
      return this.createSuccess(this.handle<any[]>(response) || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ShopServiceV2] Failed to fetch cart:', error.message);
      return this.createError(error.message);
    }
  }

  async setCartItem(productId: string, quantity: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.put<any>('/v1/shop/cart', { productId, quantity });
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ShopServiceV2] Failed to update cart item ${productId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async getOrders(): Promise<ServiceResponse<any[]>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>('/v1/shop/orders');
      return this.createSuccess(this.handle<any[]>(response) || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ShopServiceV2] Failed to fetch orders:', error.message);
      return this.createError(error.message);
    }
  }

  async createOrder(delivery: any): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>('/v1/shop/orders', delivery);
      return this.createSuccess(this.handle<any>(response), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ShopServiceV2] Failed to create order:', error.message);
      return this.createError(error.message);
    }
  }

  async startPayment(orderId: string, urls: { successUrl: string; failUrl: string }): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>(`/v1/shop/orders/${orderId}/checkout`, urls);
      return this.createSuccess(this.handle<any>(response), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ShopServiceV2] Failed to start payment for ${orderId}:`, error.message);
      return this.createError(error.message);
    }
  }
}
