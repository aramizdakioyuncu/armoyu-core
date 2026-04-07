"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    constructor(data) {
        this.isFeatured = false;
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
    getDisplayPrice() {
        return this.discountPrice && this.discountPrice < this.price
            ? this.discountPrice
            : this.price;
    }
    static fromJSON(json) {
        const parsePrice = (p) => {
            if (typeof p === 'number')
                return p;
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
}
exports.Product = Product;
