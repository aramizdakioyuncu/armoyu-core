"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const CartItem_1 = require("./CartItem");
class Order {
    constructor(data) {
        this.id = data.id || '';
        this.items = data.items || [];
        this.total = data.total || 0;
        this.status = data.status || 'pending';
        this.createdAt = data.createdAt || Date.now();
        this.paymentMethod = data.paymentMethod || 'credit_card';
    }
    /**
     * Static factory to create an Order instance from JSON.
     */
    static fromJSON(json) {
        return new Order({
            id: json.id || '',
            items: Array.isArray(json.items) ? json.items.map((i) => CartItem_1.CartItem.fromJSON(i)) : [],
            total: json.total || json.total_amount || 0,
            status: (json.status || 'pending'),
            createdAt: json.createdAt || json.created_at || Date.now(),
            paymentMethod: (json.paymentMethod || json.payment_method || 'credit_card')
        });
    }
    /**
     * Returns a user-friendly status name in Turkish.
     */
    getStatusLabel() {
        switch (this.status) {
            case 'pending': return 'Hazırlanıyor';
            case 'completed': return 'Tamamlandı';
            case 'shipped': return 'Kargoya Verildi';
            case 'canceled': return 'İptal Edildi';
            default: return this.status;
        }
    }
}
exports.Order = Order;
