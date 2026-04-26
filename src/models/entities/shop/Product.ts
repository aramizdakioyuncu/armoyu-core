import { ProductDTO } from '../../dto/shop/ShopDTO';

export class Product implements ProductDTO {
  id: number;
  name: string;
  description?: string;
  price: number;
  currency: string;
  image: string;
  category?: string;
  stock?: number;
  url?: string;

  constructor(data: ProductDTO) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.currency = data.currency;
    this.image = data.image;
    this.category = data.category;
    this.stock = data.stock;
    this.url = data.url;
  }

  /**
   * Returns formatted price with currency (e.g., 50 ₺).
   */
  get formattedPrice(): string {
    return `${this.price} ${this.currency}`;
  }

  /**
   * Returns true if product is in stock.
   */
  get inStock(): boolean {
    return this.stock === undefined || this.stock > 0;
  }

  /**
   * Returns product URL.
   */
  get productUrl(): string {
    return `/market/urun/${this.url || this.id}`;
  }

  /**
   * Factory method to create a Product from a DTO.
   */
  static fromJSON(data: ProductDTO): Product {
    return new Product(data);
  }

  /**
   * Converts the entity back to a DTO for API submission.
   */
  toJSON(): ProductDTO {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      currency: this.currency,
      image: this.image,
      category: this.category,
      stock: this.stock,
      url: this.url
    };
  }
}
