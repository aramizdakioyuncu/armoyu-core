"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Forum = void 0;
/**
 * Represents a Forum Board (Forum Bölümü) in the aramizdakioyuncu.com platform.
 */
class Forum {
    constructor(data) {
        this.id = '';
        this.name = '';
        this.desc = '';
        this.topicCount = 0;
        this.postCount = 0;
        Object.assign(this, data);
    }
    /**
     * Returns the absolute URL to the forum board.
     */
    getUrl() {
        return `/forum/${this.id}`;
    }
    /**
     * Instantiates a Forum object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new Forum({
            id: json.id || '',
            name: json.name || json.title || '',
            desc: json.desc || json.description || '',
            topicCount: json.topicCount || 0,
            postCount: json.postCount || 0,
            lastPost: json.lastPost || null,
        });
    }
}
exports.Forum = Forum;
