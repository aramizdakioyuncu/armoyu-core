export declare class Product {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    image: string;
    category: string;
    stock: number;
    tags?: string[];
    isFeatured: boolean;
    badge?: string;
    constructor(data: Partial<Product>);
    /**
     * Helper to get the display price (discounted if available)
     */
    getDisplayPrice(): number;
    static fromJSON(json: any): Product;
}
