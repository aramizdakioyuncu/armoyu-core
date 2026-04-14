"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessage = void 0;
const User_1 = require("../auth/User");
/**
 * Represents a single message in a Chat.
 */
class ChatMessage {
    constructor(data) {
        this.id = '';
        this.sender = null;
        this.content = '';
        this.timestamp = '';
        this.isSystem = false;
        Object.assign(this, data);
    }
    /**
     * Instantiates a ChatMessage object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new ChatMessage({
            id: String(json.id || json.sohbetID || json.mesajID || json.id_sohbet || ''),
            sender: json.sender ? User_1.User.fromJSON(json.sender) : (json.sender_name || json.gonderen_ad || json.oyuncu_ad ? new User_1.User({ displayName: json.sender_name || json.gonderen_ad || json.oyuncu_ad }) : null),
            content: json.content || json.text || json.icerik || json.mesaj || json.text_message || '',
            timestamp: json.timestamp || json.time || json.zaman || json.tarih || json.sent_at || '',
            isSystem: json.isSystem || json.is_system || json.system_message === 1 || false,
        });
    }
}
exports.ChatMessage = ChatMessage;
