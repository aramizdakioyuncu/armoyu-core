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

  async createOrder(params: { items: { productId: number; quantity: number }[] }): Promise<ServiceResponse<Order>> {
    return this.version.createOrder(params);
  }

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
