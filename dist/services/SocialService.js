"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialService = void 0;
const BaseService_1 = require("./BaseService");
const Post_1 = require("../models/social/Post");
/**
 * Service for managing social interactions, posts, feed, likes, and comments.
 * @checked 2026-04-12
 */
class SocialService extends BaseService_1.BaseService {
    constructor(client, logger) {
        super(client, logger);
    }
    /**
     * Fetches posts from the social feed or a specific post by ID (Legacy).
     *
     * @param page The page number (sayfa) - MANDATORY
     * @param params Additional query parameters (limit, postId, category, categoryDetail)
     * @returns List of posts or a single post
     */
    async getPosts(page, params = {}) {
        try {
            const formData = new FormData();
            formData.append('sayfa', page.toString());
            if (params.limit !== undefined) {
                formData.append('limit', params.limit.toString());
            }
            if (params.postId !== undefined) {
                formData.append('postID', params.postId.toString());
            }
            if (params.category !== undefined) {
                formData.append('category', params.category);
            }
            if (params.categoryDetail !== undefined) {
                formData.append('categorydetail', params.categoryDetail.toString());
            }
            const response = await this.client.post(this.resolveBotPath('/0/0/sosyal/liste/0/'), formData);
            if (response && response.durum === 1) {
                if (Array.isArray(response.icerik)) {
                    return response.icerik.map((p) => Post_1.Post.fromJSON(p));
                }
                else if (response.icerik && typeof response.icerik === 'object') {
                    return Post_1.Post.fromJSON(response.icerik);
                }
            }
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[SocialService] Fetching posts failed:`, error);
            return null;
        }
    }
    /**
     * Creates a new social post (Legacy).
     *
     * @param content The text content of the post
     * @param mediaIds Optional array of media IDs associated with the post
     */
    async createPost(content, mediaIds) {
        try {
            const formData = new FormData();
            formData.append('sosyalicerik', content);
            if (mediaIds && mediaIds.length > 0) {
                mediaIds.forEach(id => {
                    formData.append('paylasimfoto[]', id.toString());
                });
            }
            const response = await this.client.post(this.resolveBotPath('/0/0/sosyal/olustur/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[SocialService] Creating post failed:`, error);
            return null;
        }
    }
    /**
     * Deletes a social post (Legacy).
     *
     * @param postId The ID of the post to delete
     */
    async deletePost(postId) {
        try {
            const formData = new FormData();
            formData.append('postID', postId.toString());
            const response = await this.client.post(this.resolveBotPath('/0/0/sosyal/sil/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[SocialService] Deleting post ${postId} failed:`, error);
            return null;
        }
    }
    /**
     * Fetches the list of users who liked a specific post or comment (Legacy).
     *
     * @param params Identification parameters (postId or commentId)
     */
    async getLikers(params) {
        try {
            const formData = new FormData();
            if (params.postId !== undefined) {
                formData.append('postID', params.postId.toString());
            }
            if (params.commentId !== undefined) {
                formData.append('yorumID', params.commentId.toString());
            }
            const response = await this.client.post(this.resolveBotPath('/0/0/sosyal/begenenler/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[SocialService] Fetching likers failed:`, error);
            return null;
        }
    }
    /**
     * Removes a like from a post or comment (Legacy).
     *
     * @param params Query parameters (postId, commentId, category)
     */
    async removeLike(params) {
        var _a;
        try {
            const formData = new FormData();
            formData.append('postID', params.postId.toString());
            formData.append('yorumID', ((_a = params.commentId) === null || _a === void 0 ? void 0 : _a.toString()) || '');
            formData.append('kategori', params.category || 'post');
            const response = await this.client.post(this.resolveBotPath('/0/0/sosyal/begeni-sil/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[SocialService] Removing like failed:`, error);
            return null;
        }
    }
    /**
     * Adds a like to a post or comment (Legacy).
     *
     * @param params Query parameters (postId, category)
     */
    async addLike(params) {
        try {
            const formData = new FormData();
            formData.append('postID', params.postId.toString());
            formData.append('kategori', params.category || 'post');
            const response = await this.client.post(this.resolveBotPath('/0/0/sosyal/begen/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[SocialService] Adding like failed:`, error);
            return null;
        }
    }
    /**
     * Fetches comments for a specific post (Legacy).
     *
     * @param postId The ID of the post
     */
    async getComments(postId) {
        try {
            const formData = new FormData();
            formData.append('postID', postId.toString());
            const response = await this.client.post(this.resolveBotPath('/0/0/sosyal/yorumlar/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[SocialService] Fetching comments for ${postId} failed:`, error);
            return null;
        }
    }
    /**
     * Fetches specific social notifications (Legacy).
     *
     * @param params Query parameters (postId, category)
     */
    async getSocialNotifications(params) {
        try {
            const formData = new FormData();
            formData.append('postID', params.postId.toString());
            formData.append('bildirikategori', params.category || '');
            const response = await this.client.post(this.resolveBotPath('/0/0/sosyal/bildirim/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[SocialService] Fetching social notifications failed:`, error);
            return null;
        }
    }
    /**
     * Creates a new comment on a post (Legacy).
     *
     * @param params Comment parameters (postId, content, category, replyTo)
     */
    async createComment(params) {
        var _a;
        try {
            const formData = new FormData();
            formData.append('postID', params.postId.toString());
            formData.append('yorumicerik', params.content);
            formData.append('kategori', params.category || 'sosyal');
            formData.append('kimeyanit', ((_a = params.replyTo) === null || _a === void 0 ? void 0 : _a.toString()) || '0');
            const response = await this.client.post(this.resolveBotPath('/0/0/sosyal/yorum-olustur/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[SocialService] Creating comment failed:`, error);
            return null;
        }
    }
    /**
     * Deletes a comment (Legacy).
     *
     * @param commentId The ID of the comment to delete
     */
    async deleteComment(commentId) {
        try {
            const formData = new FormData();
            formData.append('yorumID', commentId.toString());
            const response = await this.client.post(this.resolveBotPath('/0/0/sosyal/yorum-sil/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[SocialService] Deleting comment ${commentId} failed:`, error);
            return null;
        }
    }
}
exports.SocialService = SocialService;
