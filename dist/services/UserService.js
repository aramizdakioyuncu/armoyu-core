"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_1 = require("../models/auth/User");
const BaseService_1 = require("./BaseService");
class UserService extends BaseService_1.BaseService {
    constructor(client) {
        super(client);
        console.log('[UserService] Initialized with methods:', Object.getOwnPropertyNames(UserService.prototype));
    }
    /**
     * Search for users based on a query string.
     */
    async search(query) {
        try {
            const response = await this.client.get(`/users/search`, {
                params: { q: query }
            });
            const icerik = this.handleResponse(response);
            return Array.isArray(icerik) ? icerik.map((u) => User_1.User.fromJSON(u)) : [];
        }
        catch (error) {
            console.error('[UserService] User search failed:', error);
            return [];
        }
    }
    /**
     * Get a specific user's public profile using the bot API.
     */
    async getUserByUsername(username) {
        console.log('[UserService] Getting profile for:', username);
        try {
            const formData = new FormData();
            formData.append('oyuncubakusername', username);
            const response = await this.client.post('/0/0/0/', formData);
            const icerik = this.handleResponse(response);
            return icerik ? User_1.User.fromJSON(icerik) : null;
        }
        catch (error) {
            console.error(`[UserService] Fetching profile for ${username} failed:`, error);
            return null;
        }
    }
    /**
     * Get a specific user's public profile (Legacy API).
     */
    /**
     * Follow or unfollow a user.
     */
    async toggleFollow(userId) {
        try {
            const response = await this.client.post(`/users/${userId}/follow`, {});
            const icerik = this.handleResponse(response);
            return icerik.following;
        }
        catch (error) {
            console.error('[UserService] Toggle follow failed:', error);
            return false;
        }
    }
    /**
     * Get a user's friends list.
     */
    async getFriends(userId) {
        try {
            const response = await this.client.get(`/users/${userId}/friends`);
            const icerik = this.handleResponse(response);
            return Array.isArray(icerik) ? icerik.map((u) => User_1.User.fromJSON(u)) : [];
        }
        catch (error) {
            console.error('[UserService] Get friends failed:', error);
            return [];
        }
    }
    /**
     * Update the current user's profile information.
     */
    async updateProfile(data) {
        try {
            const response = await this.client.post('/users/me/update', data);
            const icerik = this.handleResponse(response);
            return icerik ? User_1.User.fromJSON(icerik) : null;
        }
        catch (error) {
            console.error('[UserService] Update profile failed:', error);
            return null;
        }
    }
}
exports.UserService = UserService;
