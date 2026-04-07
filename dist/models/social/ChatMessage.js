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
            id: json.id || '',
            sender: json.sender ? User_1.User.fromJSON(json.sender) : (json.sender_name ? new User_1.User({ displayName: json.sender_name }) : null),
            content: json.content || json.text || '',
            timestamp: json.timestamp || json.time || '',
            isSystem: json.isSystem || json.is_system || false,
        });
    }
}
exports.ChatMessage = ChatMessage;
