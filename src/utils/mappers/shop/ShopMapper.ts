import { StoreItemResponse, ProductResponse, OrderResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Shop and Store items.
 */
export class ShopMapper extends BaseMapper {
  static mapStoreItem(raw: any): StoreItemResponse {
    const legacy = this.shouldReturnRaw<StoreItemResponse>(raw);
    if (legacy) return legacy;
    if (!raw) return {} as StoreItemResponse;

    return {
      id: this.toNumber(raw.urunID || raw.id),
      name: raw.urunad || raw.name || '',
      description: raw.urunaciklama || raw.description || '',
      price: this.toNumber(raw.urunfiyat || raw.price),
      image: this.toImageUrl(raw.urunresim || raw.image) || '',
      category: raw.urunkategori || raw.category || ''
    };
  }

  static mapProduct(raw: any): ProductResponse {
    const legacy = this.shouldReturnRaw<ProductResponse>(raw);
    if (legacy) return legacy;
    if (!raw) return {} as ProductResponse;

    return {
      id: this.toNumber(raw.urunID || raw.id),
      name: raw.urunad || raw.name || '',
      price: this.toNumber(raw.urunfiyat || raw.price),
      currency: raw.birim || '₺'
    };
  }

  static mapProductList(rawList: any[]): ProductResponse[] {
    return (rawList || []).map(item => this.mapProduct(item));
  }

  static mapOrder(raw: any): OrderResponse {
    const legacy = this.shouldReturnRaw<OrderResponse>(raw);
    if (legacy) return legacy;
    if (!raw) return {} as OrderResponse;

    return {
      id: this.toNumber(raw.siparisID || raw.id),
      total: this.toNumber(raw.toplam_tutar || raw.total),
      status: raw.durum || 'pending'
    };
  }
}
