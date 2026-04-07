"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialService = void 0;
const ApiClient_1 = require("../api/ApiClient");
const Post_1 = require("../models/social/Post");
const Notification_1 = require("../models/social/Notification");
const SocketService_1 = require("./SocketService");
class SocialService {
    /**
     * Fetch the social feed (posts from follows/groups).
     */
    static async getFeed(page = 1) {
        try {
            const response = await ApiClient_1.ApiClient.get(`/social/feed?page=${page}`);
            return response.map(p => Post_1.Post.fromJSON(p));
        }
        catch (error) {
            console.error('[SocialService] Fetching feed failed:', error);
            return [];
        }
    }
    /**
     * Create a new post.
     */
    static async createPost(content, media) {
        try {
            const response = await ApiClient_1.ApiClient.post('/social/posts', { content, media });
            const post = Post_1.Post.fromJSON(response);
            // Notify via socket
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
    static async toggleLike(postId) {
        try {
            const response = await ApiClient_1.ApiClient.post(`/social/posts/${postId}/like`, {});
            // Emit socket event for real-time update
            SocketService_1.socketService.emit('post_like', { postId, liked: response.liked });
            return response.liked;
        }
        catch (error) {
            console.error('[SocialService] Toggle like failed:', error);
            return false;
        }
    }
    /**
     * Add a comment to a post.
     */
    static async addComment(postId, content) {
        try {
            const response = await ApiClient_1.ApiClient.post(`/social/posts/${postId}/comments`, { content });
            return response;
        }
        catch (error) {
            console.error('[SocialService] Adding comment failed:', error);
            return null;
        }
    }
    /**
     * Get user notifications.
     */
    static async getNotifications() {
        try {
            const response = await ApiClient_1.ApiClient.get('/social/notifications');
            return response.map(n => Notification_1.Notification.fromJSON(n));
        }
        catch (error) {
            console.error('[SocialService] Fetching notifications failed:', error);
            return [];
        }
    }
    /**
     * Mark a notification as read.
     */
    static async markNotificationAsRead(notificationId) {
        try {
            await ApiClient_1.ApiClient.post(`/social/notifications/${notificationId}/read`, {});
        }
        catch (error) {
            console.error('[SocialService] Marking notification as read failed:', error);
        }
    }
}
exports.SocialService = SocialService;
