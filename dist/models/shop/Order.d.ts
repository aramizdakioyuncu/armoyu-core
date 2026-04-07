import { CartItem } from './CartItem';
export type OrderStatus = 'pending' | 'completed' | 'canceled' | 'shipped';
export declare class Order {
    id: string;
    items: CartItem[];
    total: number;
    status: OrderStatus;
    createdAt: number;
    paymentMethod: 'credit_card' | 'armoyu_coin' | 'paypal';
    constructor(data: Partial<Order>);
    /**
     * Static factory to create an Order instance from JSON.
     */
    static fromJSON(json: any): Order;
    /**
     * Returns a user-friendly status name in Turkish.
     */
    getStatusLabel(): string;
}
