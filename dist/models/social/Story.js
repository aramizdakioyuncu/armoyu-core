"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Story = void 0;
const User_1 = require("../auth/User");
/**
 * Represents a Story in the aramizdakioyuncu.com platform.
 */
class Story {
    constructor(data) {
        this.id = '';
        this.user = null;
        this.media = '';
        this.hasUnseen = false;
        this.isMe = false;
        Object.assign(this, data);
    }
    /**
     * Instantiates a Story object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new Story({
            id: json.id || '',
            user: json.user ? User_1.User.fromJSON(json.user) : (json.username ? new User_1.User({ username: json.username, avatar: json.avatar }) : null),
            media: json.media || '',
            hasUnseen: json.hasUnseen || false,
            isMe: json.isMe || false,
        });
    }
}
exports.Story = Story;
