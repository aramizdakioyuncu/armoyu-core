"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.News = void 0;
const User_1 = require("../auth/User");
/**
 * Represents a News item (Haber) in the aramizdakioyuncu.com platform.
 */
class News {
    constructor(data) {
        this.id = 0;
        this.slug = '';
        this.title = '';
        this.excerpt = '';
        this.content = '';
        this.date = '';
        this.relativeTime = '';
        this.category = '';
        this.image = '';
        this.thumbnail = '';
        this.fullImage = '';
        this.views = 0;
        // Author details
        this.authorId = 0;
        this.authorName = '';
        this.authorAvatar = '';
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
     * Returns a truncated version of the content if excerpt is missing.
     */
    getSummary(length = 150) {
        if (this.excerpt)
            return this.excerpt;
        if (!this.content)
            return '';
        return this.content.substring(0, length) + (this.content.length > length ? '...' : '');
    }
    /**
     * Instantiates a News object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        // Robustly handle slug from a full URL if needed
        let slug = json.slug || '';
        if (!slug && json.link) {
            const parts = json.link.split('/');
            slug = parts[parts.length - 1];
        }
        return new News({
            id: Number(json.haberID || json.id || 0),
            slug: slug,
            title: json.haberbaslik || json.title || '',
            excerpt: json.ozet || json.excerpt || json.summary || '',
            content: json.icerik || json.content || '',
            date: json.zaman || json.date || '',
            relativeTime: json.gecenzaman || json.relativeTime || '',
            category: json.kategori || json.category || '',
            image: json.resim || json.image || '',
            thumbnail: json.resimminnak || json.thumbnail || '',
            fullImage: json.resimorijinal || json.fullImage || '',
            views: Number(json.goruntulen || json.views || 0),
            authorId: Number(json.yazarID || json.authorId || 0),
            authorName: json.yazar || json.authorName || '',
            authorAvatar: json.yazaravatar || json.authorAvatar || '',
            author: json.author ? (json.author instanceof User_1.User ? json.author : User_1.User.fromJSON(json.author)) : (json.yazar ? new User_1.User({ id: String(json.yazarID), displayName: json.yazar, avatar: json.yazaravatar }) : null),
        });
    }
}
exports.News = News;
