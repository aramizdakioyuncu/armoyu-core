"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItem = void 0;
const Product_1 = require("./Product");
class CartItem {
    constructor(data) {
        this.product = data.product || new Product_1.Product({});
        this.id = data.id || `cart_${this.product.id}_${Date.now()}`;
        this.quantity = data.quantity || 1;
        this.addedAt = data.addedAt || Date.now();
    }
    /**
     * Calculate total price for this item based on quantity and display price.
     */
    getTotalPrice() {
        return this.product.getDisplayPrice() * this.quantity;
    }
    static fromJSON(json) {
        return new CartItem({
            id: json.id || '',
            product: json.product ? Product_1.Product.fromJSON(json.product) : undefined,
            quantity: json.quantity || 1,
            addedAt: json.addedAt || Date.now()
        });
    }
}
exports.CartItem = CartItem;
