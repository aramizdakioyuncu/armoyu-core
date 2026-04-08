"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialService = void 0;
const Post_1 = require("../models/social/Post");
const Notification_1 = require("../models/social/Notification");
const BaseService_1 = require("./BaseService");
const SocketService_1 = require("./SocketService");
class SocialService extends BaseService_1.BaseService {
    /**
     * Fetch the social feed (posts from follows/groups).
     */
    async getFeed(page = 1) {
        try {
            const response = await this.client.get(`/0/0/sosyal/liste/${page}/`);
            const icerik = this.handleResponse(response);
            return icerik.map(p => Post_1.Post.fromJSON(p));
        }
        catch (error) {
            console.error('[SocialService] Fetching feed failed:', error);
            return [];
        }
    }
    /**
     * Create a new post.
     */
    async createPost(content, media) {
        try {
            const response = await this.client.post('/social/posts', { content, media });
            const icerik = this.handleResponse(response);
            const post = Post_1.Post.fromJSON(icerik);
            // Notify via socket if connected
            SocketService_1.socketService.emit('post', post);
            return post;
        }
        catch (error) {
            console.error('[SocialService] Creating post failed:', error);
            return null;
        }
    }
    /**
     * Like or unlike a post.
     */
    async toggleLike(postId) {
        try {
            const response = await this.client.post(`/social/posts/${postId}/like`, {});
            const icerik = this.handleResponse(response);
            // Emit socket event for real-time update
            SocketService_1.socketService.emit('post_like', { postId, liked: icerik.liked });
            return icerik.liked;
        }
        catch (error) {
            console.error('[SocialService] Toggle like failed:', error);
            return false;
        }
    }
    /**
     * Add a comment to a post.
     */
    async addComment(postId, content) {
        try {
            const response = await this.client.post(`/social/posts/${postId}/comments`, { content });
            return this.handleResponse(response);
        }
        catch (error) {
            console.error('[SocialService] Adding comment failed:', error);
            return null;
        }
    }
    /**
     * Get user notifications.
     */
    async getNotifications() {
        try {
            const response = await this.client.get('/social/notifications');
            const icerik = this.handleResponse(response);
            return icerik.map(n => Notification_1.Notification.fromJSON(n));
        }
        catch (error) {
            console.error('[SocialService] Fetching notifications failed:', error);
            return [];
        }
    }
    /**
     * Mark a notification as read.
     */
    async markNotificationAsRead(notificationId) {
        try {
            const response = await this.client.post(`/social/notifications/${notificationId}/read`, {});
            this.handleResponse(response);
        }
        catch (error) {
            console.error('[SocialService] Marking notification as read failed:', error);
        }
    }
}
exports.SocialService = SocialService;
