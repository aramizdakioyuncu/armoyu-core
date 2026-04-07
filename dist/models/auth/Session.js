"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const User_1 = require("./User");
const CartItem_1 = require("../shop/CartItem");
const Chat_1 = require("../social/Chat");
const Notification_1 = require("../social/Notification");
class Session {
    constructor(data) {
        this.user = data.user || null;
        this.token = data.token || null;
        this.refreshToken = data.refreshToken || null;
        this.expiresAt = data.expiresAt || null;
        this.cart = data.cart || [];
        this.myArticles = data.myArticles || [];
        this.chatList = data.chatList || [];
        this.notifications = data.notifications || [];
    }
    /**
     * Checks if the session is still valid based on the expiration timestamp.
     */
    isValid() {
        if (!this.token || !this.expiresAt)
            return false;
        return Date.now() < this.expiresAt;
    }
    /**
     * Static factory for creating a Session instance from a JSON object.
     */
    static fromJSON(json) {
        return new Session({
            user: json.user ? User_1.User.fromJSON(json.user) : null,
            token: json.token || json.jwt_token || null,
            refreshToken: json.refreshToken || json.refresh_token || null,
            expiresAt: json.expiresAt || json.expires_at || (Date.now() + 3600 * 1000), // Default 1 hour
            cart: Array.isArray(json.cart) ? json.cart.map((i) => CartItem_1.CartItem.fromJSON(i)) : [],
            myArticles: json.myArticles || [],
            chatList: Array.isArray(json.chatList) ? json.chatList.map((c) => Chat_1.Chat.fromJSON(c)) : [],
            notifications: Array.isArray(json.notifications) ? json.notifications.map((n) => Notification_1.Notification.fromJSON(n)) : [],
        });
    }
}
exports.Session = Session;
