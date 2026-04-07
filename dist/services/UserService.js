"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const ApiClient_1 = require("../api/ApiClient");
const User_1 = require("../models/auth/User");
class UserService {
    /**
     * Search for users based on a query string.
     */
    static async search(query) {
        try {
            const response = await ApiClient_1.ApiClient.get(`/users/search?q=${encodeURIComponent(query)}`);
            return Array.isArray(response) ? response.map((u) => User_1.User.fromJSON(u)) : [];
        }
        catch (error) {
            console.error('[UserService] User search failed:', error);
            return [];
        }
    }
    /**
     * Get a specific user's public profile.
     */
    static async getProfile(username) {
        try {
            const response = await ApiClient_1.ApiClient.get(`/users/${username}`);
            return response ? User_1.User.fromJSON(response) : null;
        }
        catch (error) {
            console.error(`[UserService] Fetching profile for ${username} failed:`, error);
            return null;
        }
    }
    /**
     * Follow or unfollow a user.
     */
    static async toggleFollow(userId) {
        try {
            const response = await ApiClient_1.ApiClient.post(`/users/${userId}/follow`, {});
            return response.following;
        }
        catch (error) {
            console.error('[UserService] Toggle follow failed:', error);
            return false;
        }
    }
    /**
     * Get a user's friends list.
     */
    static async getFriends(userId) {
        try {
            const response = await ApiClient_1.ApiClient.get(`/users/${userId}/friends`);
            return Array.isArray(response) ? response.map((u) => User_1.User.fromJSON(u)) : [];
        }
        catch (error) {
            console.error('[UserService] Get friends failed:', error);
            return [];
        }
    }
    /**
     * Update the current user's profile information.
     */
    static async updateProfile(data) {
        try {
            const response = await ApiClient_1.ApiClient.post('/users/me/update', data);
            return response ? User_1.User.fromJSON(response) : null;
        }
        catch (error) {
            console.error('[UserService] Update profile failed:', error);
            return null;
        }
    }
}
exports.UserService = UserService;
