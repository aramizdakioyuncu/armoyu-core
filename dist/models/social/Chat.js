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
        var _a;
        return new Chat({
            id: String(json.id || json.id_user || json.user_id || json.arkadasID || json.oyuncubakid || json.oyuncuID || json.groupID || json.grupID || ''),
            participants: Array.isArray(json.participants) ? json.participants.map((p) => User_1.User.fromJSON(p)) : [],
            name: json.name || json.displayname || json.displayName || json.user_displayname || json.oyuncuad || json.grupad || json.username || json.title || '',
            avatar: typeof json.avatar === 'string' ? json.avatar : (((_a = json.avatar) === null || _a === void 0 ? void 0 : _a.media_URL) || json.oyuncuminnakavatar || json.grup_minnakavatar || json.logo || json.avatar || ''),
            lastMessage: json.lastMessage ? ChatMessage_1.ChatMessage.fromJSON(json.lastMessage) : (json.last_message ? ChatMessage_1.ChatMessage.fromJSON(json.last_message) : null),
            time: json.time || json.zaman || json.tarih || json.last_message_time || '',
            unreadCount: json.unreadCount || json.unread_count || json.okunmamis_sayi || 0,
            isOnline: json.isOnline || json.is_online || json.oyuncu_online === 1 || false,
            lastSeen: json.lastSeen || json.last_seen || json.son_gorulme || '',
            updatedAt: json.updatedAt || json.updated_at || 0,
            isGroup: json.isGroup || json.is_group || json.grupID !== undefined || false,
            isFavorite: json.isFavorite || json.is_favorite || false,
            messages: Array.isArray(json.messages) ? json.messages.map((m) => ChatMessage_1.ChatMessage.fromJSON(m)) : (Array.isArray(json.liste) ? json.liste.map((m) => ChatMessage_1.ChatMessage.fromJSON(m)) : []),
        });
    }
}
exports.Chat = Chat;
