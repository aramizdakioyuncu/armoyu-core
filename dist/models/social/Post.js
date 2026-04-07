"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const User_1 = require("../auth/User");
/**
 * Represents a Post (Gönderi/Paylaşım) in the aramizdakioyuncu.com platform.
 */
class Post {
    constructor(data) {
        this.id = '';
        this.author = null;
        this.content = '';
        this.media = [];
        this.createdAt = '';
        this.stats = { likes: 0, comments: 0, reposts: 0, shares: 0 };
        this.hashtags = [];
        this.isPending = false;
        // Real-time Lists
        this.likeList = [];
        this.repostList = [];
        this.commentList = [];
        Object.assign(this, data);
    }
    /**
     * Instantiates a Post object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new Post({
            id: json.id || '',
            author: json.author ? User_1.User.fromJSON(json.author) : null,
            content: json.content || '',
            media: Array.isArray(json.media) ? json.media : (json.imageUrl ? [{ type: 'image', url: json.imageUrl }] : []),
            createdAt: json.createdAt || json.created_at || '',
            stats: json.stats || {
                likes: json.likeCount || 0,
                comments: json.commentCount || 0,
                reposts: json.repostCount || 0,
                shares: json.shareCount || 0,
            },
            hashtags: json.hashtags || [],
            likeList: Array.isArray(json.likeList) ? json.likeList.map(User_1.User.fromJSON) : [],
            repostList: Array.isArray(json.repostList) ? json.repostList.map(User_1.User.fromJSON) : [],
            commentList: Array.isArray(json.commentList) ? json.commentList.map((c) => ({
                ...c,
                author: User_1.User.fromJSON(c.author),
                replies: Array.isArray(c.replies) ? c.replies.map((r) => ({ ...r, author: User_1.User.fromJSON(r.author) })) : []
            })) : [],
            repostOf: json.repostOf ? Post.fromJSON(json.repostOf) : undefined
        });
    }
}
exports.Post = Post;
