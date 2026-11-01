import { Product, Order, ShopResponseDTO, ShopProductDTO, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ShopServiceV1 } from '../v1/ShopServiceV1';
import { ShopServiceV2 } from '../v2/ShopServiceV2';
import { UpdateShopParams, CreateProductParams } from '../models/dto/shop/ShopDTO';

export { UpdateShopParams, CreateProductParams };

export class ShopService extends BaseService {
  private version: ShopServiceV1 | ShopServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new ShopServiceV1(client, logger)
      : new ShopServiceV2(client, logger);
  }

  async getProducts(page: number = 1, options?: { category?: string; searchTerm?: string; limit?: number }): Promise<ServiceResponse<Product[]>> {
    return this.version.getProducts(page, options);
  }

  async getProductDetails(productId: string | number): Promise<ServiceResponse<Product | null>> {
    return this.version.getProductDetails(productId);
  }

  async createOrder(params: any): Promise<ServiceResponse<Order>> {
    return this.version.createOrder(params);
  }

  private onlyV2<T>(run: (service: ShopServiceV2) => Promise<ServiceResponse<T>>): Promise<ServiceResponse<T>> {
    return this.usePreviousVersion
      ? Promise.resolve(this.createError('Bu işlem yalnızca V2 API ile kullanılabilir') as ServiceResponse<T>)
      : run(this.version as ShopServiceV2);
  }

  getCart() { return this.onlyV2((s) => s.getCart()); }
  setCartItem(productId: string, quantity: number) { return this.onlyV2((s) => s.setCartItem(productId, quantity)); }
  getOrders() { return this.onlyV2((s) => s.getOrders()); }
  startPayment(orderId: string, urls: { successUrl: string; failUrl: string }) { return this.onlyV2((s) => s.startPayment(orderId, urls)); }

  async getShops(page: number = 1, limit?: number): Promise<ServiceResponse<ShopResponseDTO[]>> {
    return this.version.getShops(page, limit);
  }

  async getShop(shopId: number): Promise<ServiceResponse<ShopResponseDTO | null>> {
    return this.version.getShop(shopId);
  }

  async updateShop(shopId: number, params: UpdateShopParams): Promise<ServiceResponse<boolean>> {
    return this.version.updateShop(shopId, params);
  }

  async deleteShop(shopId: number): Promise<ServiceResponse<boolean>> {
    return this.version.deleteShop(shopId);
  }

  async getShopProducts(shopId: number, page: number = 1, limit?: number): Promise<ServiceResponse<ShopProductDTO[]>> {
    return this.version.getShopProducts(shopId, page, limit);
  }

  async getProduct(productId: number): Promise<ServiceResponse<ShopProductDTO | null>> {
    return this.version.getProduct(productId);
  }

  async createProduct(params: CreateProductParams): Promise<ServiceResponse<ShopProductDTO>> {
    return this.version.createProduct(params);
  }

  async deleteProduct(productId: number): Promise<ServiceResponse<boolean>> {
    return this.version.deleteProduct(productId);
  }
}
