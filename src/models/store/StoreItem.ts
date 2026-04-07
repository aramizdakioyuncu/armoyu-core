/**
 * Represents a Store Item (Mağaza Eşyası/Ürün) in the aramizdakioyuncu.com platform.
 */
export class StoreItem {
  id: string = '';
  name: string = '';
  category: string = '';
  price: string = '';
  image: string = '';
  isFeatured: boolean = false;
  badge: string = '';

  constructor(data: Partial<StoreItem>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a StoreItem object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): StoreItem {
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
}
