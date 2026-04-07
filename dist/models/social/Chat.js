"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const User_1 = require("../auth/User");
const ChatMessage_1 = require("./ChatMessage");
/**
 * Represents a Chat conversation or summary.
 */
class Chat {
    constructor(data) {
        this.id = '';
        this.participants = [];
        this.name = '';
        this.avatar = '';
        this.lastMessage = null;
        this.time = '';
        this.unreadCount = 0;
        this.isOnline = false;
        this.lastSeen = '';
        this.updatedAt = 0;
        this.isGroup = false;
        this.isFavorite = false;
        this.messages = [];
        Object.assign(this, data);
    }
    /**
     * Instantiates a Chat object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new Chat({
            id: json.id || '',
            participants: Array.isArray(json.participants) ? json.participants.map((p) => User_1.User.fromJSON(p)) : [],
            name: json.name || '',
            avatar: json.avatar || '',
            lastMessage: json.lastMessage ? ChatMessage_1.ChatMessage.fromJSON(json.lastMessage) : (json.last_message ? ChatMessage_1.ChatMessage.fromJSON(json.last_message) : null),
            time: json.time || '',
            unreadCount: json.unreadCount || json.unread_count || 0,
            isOnline: json.isOnline || json.is_online || false,
            lastSeen: json.lastSeen || json.last_seen || '',
            updatedAt: json.updatedAt || json.updated_at || 0,
            isGroup: json.isGroup || json.is_group || false,
            isFavorite: json.isFavorite || json.is_favorite || false,
            messages: Array.isArray(json.messages) ? json.messages.map((m) => ChatMessage_1.ChatMessage.fromJSON(m)) : [],
        });
    }
}
exports.Chat = Chat;
