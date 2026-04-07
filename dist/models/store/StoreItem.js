"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreItem = void 0;
/**
 * Represents a Store Item (Mağaza Eşyası/Ürün) in the aramizdakioyuncu.com platform.
 */
class StoreItem {
    constructor(data) {
        this.id = '';
        this.name = '';
        this.category = '';
        this.price = '';
        this.image = '';
        this.isFeatured = false;
        this.badge = '';
        Object.assign(this, data);
    }
    /**
     * Instantiates a StoreItem object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
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
exports.StoreItem = StoreItem;
