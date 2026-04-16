import { BaseModel } from '../BaseModel';

export class Product extends BaseModel {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  category: string;
  stock: number;
  tags?: string[];
  isFeatured: boolean = false;
  badge?: string;

  constructor(data: Partial<Product>) {
    super();
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.price = data.price || 0;
    this.discountPrice = data.discountPrice;
    this.image = data.image || '';
    this.category = data.category || '';
    this.stock = data.stock || 0;
    this.tags = data.tags || [];
    this.isFeatured = data.isFeatured || false;
    this.badge = data.badge;
  }

  /**
   * Helper to get the display price (discounted if available)
   */
  getDisplayPrice(): number {
    return this.discountPrice && this.discountPrice < this.price 
      ? this.discountPrice 
      : this.price;
  }

  /**
   * Instantiates a Product object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): Product {
    if (BaseModel.usePreviousApi) {
      return Product.legacyFromJSON(json);
    }
    return Product.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): Product {
    const parsePrice = (p: any): number => {
      if (typeof p === 'number') return p;
      if (typeof p === 'string') {
        const cleaned = p.replace(/[₺,]/g, '').replace(' ', '');
        return parseFloat(cleaned) || 0;
      }
      return 0;
    };

    return new Product({
      id: json.id || '',
      name: json.name || json.product_name || '',
      description: json.description || json.desc || '',
      price: parsePrice(json.price),
      discountPrice: json.discountPrice !== undefined ? parsePrice(json.discountPrice) : undefined,
      image: json.image || json.img_url || '',
      category: json.category || 'Genel',
      stock: json.stock || 0,
      tags: json.tags || [],
      isFeatured: json.isFeatured || json.is_featured || false,
      badge: json.badge
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): Product {
    return new Product({});
  }
}
