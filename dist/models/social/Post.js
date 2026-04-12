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
        this.likesCount = 0;
        this.commentsCount = 0;
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
        const likes = Number(json.begenisay || 0);
        const comments = Number(json.yorumsay || 0);
        const reposts = Number(json.repostsay || 0);
        const shares = Number(json.sikayetsay || 0);
        return new Post({
            id: String(json.postID || json.id || json.post_ID || json.paylasimID || json.paylasim_ID || ''),
            author: (json.owner || json.author) ? User_1.User.fromJSON(json.owner || json.author) : null,
            content: json.paylasimicerik || json.content || json.post_content || '',
            media: Array.isArray(json.paylasimfoto) ? json.paylasimfoto.map((f) => ({ type: 'image', url: f.fotourl || f.fotoufakurl || f.foto_URL })) : (Array.isArray(json.media) ? json.media : []),
            createdAt: json.paylasimzaman || json.createdAt || json.created_at || json.post_date || '',
            likesCount: likes,
            commentsCount: comments,
            stats: {
                likes,
                comments,
                reposts,
                shares,
            },
            hashtags: json.hashtags || [],
            likeList: Array.isArray(json.paylasimilkucbegenen) ? json.paylasimilkucbegenen.map(User_1.User.fromJSON) : (Array.isArray(json.likeList) ? json.likeList.map(User_1.User.fromJSON) : []),
            commentList: Array.isArray(json.ilkucyorum) ? json.ilkucyorum.map((c) => ({
                ...c,
                author: User_1.User.fromJSON(c),
                content: c.yorumcuicerik,
                createdAt: c.yorumcuzaman
            })) : [],
            repostOf: json.repostOf ? Post.fromJSON(json.repostOf) : undefined
        });
    }
}
exports.Post = Post;
