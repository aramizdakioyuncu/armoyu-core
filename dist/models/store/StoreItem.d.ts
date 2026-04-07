/**
 * Represents a Store Item (Mağaza Eşyası/Ürün) in the aramizdakioyuncu.com platform.
 */
export declare class StoreItem {
    id: string;
    name: string;
    category: string;
    price: string;
    image: string;
    isFeatured: boolean;
    badge: string;
    constructor(data: Partial<StoreItem>);
    /**
     * Instantiates a StoreItem object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): StoreItem;
}
