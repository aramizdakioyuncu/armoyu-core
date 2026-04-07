import { Product } from './Product';
export declare class CartItem {
    id: string;
    product: Product;
    quantity: number;
    addedAt: number;
    constructor(data: Partial<CartItem>);
    /**
     * Calculate total price for this item based on quantity and display price.
     */
    getTotalPrice(): number;
    static fromJSON(json: any): CartItem;
}
