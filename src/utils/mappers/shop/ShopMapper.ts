import { StoreItemResponse, ProductDTO, OrderDTO, Product, Order } from '../../../models';
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

  static mapProduct(raw: any): Product {
    const legacy = this.shouldReturnRaw<ProductDTO>(raw);
    if (legacy) return new Product(legacy);
    if (!raw) return new Product({} as ProductDTO);

    return new Product({
      id: this.toNumber(raw.urunID || raw.id),
      name: raw.urunad || raw.name || '',
      description: raw.urunaciklama || raw.description || '',
      price: this.toNumber(raw.urunfiyat || raw.price),
      currency: raw.birim || '₺',
      image: this.toImageUrl(raw.urunresim || raw.image) || '',
      category: raw.urunkategori || raw.category || '',
      stock: raw.stok !== undefined ? this.toNumber(raw.stok) : undefined,
      url: raw.urunlink || raw.url
    });
  }

  static mapProductList(rawList: any[]): Product[] {
    return (rawList || []).map(item => this.mapProduct(item));
  }

  static mapOrder(raw: any): Order {
    const legacy = this.shouldReturnRaw<OrderDTO>(raw);
    if (legacy) return new Order(legacy);
    if (!raw) return new Order({} as OrderDTO);

    return new Order({
      id: this.toNumber(raw.siparisID || raw.id),
      total: this.toNumber(raw.toplam_tutar || raw.total),
      status: raw.durum || 'pending',
      date: raw.zaman || raw.date,
      items: Array.isArray(raw.urunler) ? raw.urunler.map((u: any) => this.mapProduct(u)) : []
    });
  }
}
