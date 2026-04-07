"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.News = void 0;
const User_1 = require("../auth/User");
/**
 * Represents a News item (Haber) in the aramizdakioyuncu.com platform.
 */
class News {
    constructor(data) {
        this.slug = '';
        this.title = '';
        this.excerpt = '';
        this.content = '';
        this.date = '';
        this.category = '';
        this.image = '';
        this.author = null;
        Object.assign(this, data);
    }
    /**
     * Returns the absolute URL to the news article.
     */
    getUrl() {
        return `/haberler/${this.slug}`;
    }
    /**
     * Instantiates a News object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new News({
            slug: json.slug || '',
            title: json.title || '',
            excerpt: json.excerpt || json.summary || '',
            content: json.content || '',
            date: json.date || '',
            category: json.category || '',
            image: json.image || '',
            author: json.author ? (json.author instanceof User_1.User ? json.author : User_1.User.fromJSON(json.author)) : (json.authorUsername ? new User_1.User({ username: json.authorUsername, displayName: json.authorName }) : null),
        });
    }
}
exports.News = News;
