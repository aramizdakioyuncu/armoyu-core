import { BaseModel } from '../BaseModel';

/**
 * Represents a Store Item (Mağaza Eşyası/Ürün) in the aramizdakioyuncu.com platform.
 */
export class StoreItem extends BaseModel {
  id: string = '';
  name: string = '';
  category: string = '';
  price: string = '';
  image: string = '';
  isFeatured: boolean = false;
  badge: string = '';

  constructor(data: Partial<StoreItem>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a StoreItem object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): StoreItem {
    if (BaseModel.usePreviousApi) {
      return StoreItem.legacyFromJSON(json);
    }
    return StoreItem.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): StoreItem {
    return new StoreItem({
      id: json.id || '',
      name: json.name || json.title || '',
      category: json.category || '',
      price: json.price || '',
      image: json.image || '',
      isFeatured: json.isFeatured || false,
      badge: json.badge || '',
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): StoreItem {
    return new StoreItem({});
  }
}
