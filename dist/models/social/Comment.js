"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const User_1 = require("../auth/User");
/**
 * Represents a Comment (Yorum) in the aramizdakioyuncu.com platform.
 */
class Comment {
    constructor(data) {
        this.id = '';
        this.author = null;
        this.text = '';
        this.date = '';
        this.replies = [];
        Object.assign(this, data);
    }
    /**
     * Adds a reply to the comment.
     */
    addReply(reply) {
        this.replies.push(reply);
    }
    /**
     * Instantiates a Comment object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new Comment({
            id: json.id || '',
            author: json.user ? User_1.User.fromJSON(json.user) : (json.author_name ? new User_1.User({ displayName: json.author_name }) : null),
            text: json.text || json.comment || '',
            date: json.date || json.created_at || '',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            replies: Array.isArray(json.replies) ? json.replies.map((r) => Comment.fromJSON(r)) : [],
        });
    }
}
exports.Comment = Comment;
