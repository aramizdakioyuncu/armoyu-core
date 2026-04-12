"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_1 = require("../models/auth/User");
const RankedUser_1 = require("../models/auth/RankedUser");
const BaseService_1 = require("./BaseService");
const MediaEnums_1 = require("../models/social/MediaEnums");
/**
 * Service for managing user profiles, relationships, media, and social rankings.
 * @checked 2026-04-12
 */
class UserService extends BaseService_1.BaseService {
    constructor(client, logger) {
        var _a, _b;
        super(client, logger);
        (_b = (_a = this.logger).debug) === null || _b === void 0 ? void 0 : _b.call(_a, '[UserService] Initialized');
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
            this.logger.error('[UserService] User search failed:', error);
            return [];
        }
    }
    /**
     * Get a specific user's public profile using the bot API.
     */
    async getUserByUsername(username) {
        this.logger.info('[UserService] Getting profile for:', username);
        try {
            const formData = new FormData();
            formData.append('oyuncubakusername', username);
            const response = await this.client.post(this.resolveBotPath('/0/0/0/'), formData);
            const icerik = this.handleResponse(response);
            return icerik ? User_1.User.fromJSON(icerik) : null;
        }
        catch (error) {
            this.logger.error(`[UserService] Fetching profile for ${username} failed:`, error);
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
            this.logger.error('[UserService] Toggle follow failed:', error);
            return false;
        }
    }
    /**
     * Sends a friend request or adds a friend (Legacy).
     *
     * @param userId The ID of the player to add (oyuncubakid)
     */
    async addFriend(userId) {
        try {
            const formData = new FormData();
            formData.append('oyuncubakid', userId.toString());
            const response = await this.client.post(this.resolveBotPath('/0/0/arkadas-ol/0/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[UserService] Adding friend ${userId} failed:`, error);
            return null;
        }
    }
    /**
     * Removes a friend connection (Legacy).
     *
     * @param userId The ID of the player to remove (oyuncubakid)
     */
    async removeFriend(userId) {
        try {
            const formData = new FormData();
            formData.append('oyuncubakid', userId.toString());
            const response = await this.client.post(this.resolveBotPath('/0/0/arkadas-cikar/0/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[UserService] Removing friend ${userId} failed:`, error);
            return null;
        }
    }
    /**
     * Responds to a friend request (Legacy).
     *
     * @param userId The ID of the requester (oyuncubakid)
     * @param response The response (1 for accept, 0 for decline)
     */
    async respondToFriendRequest(userId, response) {
        try {
            const formData = new FormData();
            formData.append('oyuncubakid', userId.toString());
            formData.append('cevap', response.toString());
            const responseApi = await this.client.post(this.resolveBotPath('/0/0/arkadas-cevap/0/0/'), formData);
            return this.handleResponse(responseApi);
        }
        catch (error) {
            this.logger.error(`[UserService] Responding to friend ${userId} failed:`, error);
            return null;
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
            this.logger.error('[UserService] Get friends failed:', error);
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
            this.logger.error('[UserService] Update profile failed:', error);
            return null;
        }
    }
    /**
     * Updates the current user's private personal information (Legacy).
     *
     * @param data The private information data including password verification
     */
    async updatePrivatePersonalInfo(data) {
        var _a, _b;
        try {
            const formData = new FormData();
            formData.append('v1', '1');
            formData.append('ad', data.firstName || '');
            formData.append('soyad', data.lastName || '');
            formData.append('email', data.email || '');
            formData.append('birthday', data.birthday || '');
            formData.append('phoneNumber', data.phoneNumber || '');
            formData.append('countryID', ((_a = data.countryID) === null || _a === void 0 ? void 0 : _a.toString()) || '');
            formData.append('provinceID', ((_b = data.provinceID) === null || _b === void 0 ? void 0 : _b.toString()) || '');
            formData.append('passwordControl', data.passwordControl);
            const response = await this.client.post(this.resolveBotPath('/0/0/profil/ozelbilgiler/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error('[UserService] Update private personal info failed:', error);
            return null;
        }
    }
    /**
     * Fetches the educational history (schools) for a specific player (Legacy).
     *
     * @param userId Optional ID of the player (oyuncubakid)
     */
    async getUserSchools(userId) {
        try {
            const formData = new FormData();
            if (userId !== undefined) {
                formData.append('oyuncubakid', userId.toString());
            }
            const response = await this.client.post(this.resolveBotPath('/0/0/okullarim/0/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[UserService] Fetching schools failed:`, error);
            return null;
        }
    }
    /**
     * Fetches detailed information about a specific school (Legacy).
     *
     * @param schoolId The ID of the school (okulID)
     */
    async getSchoolDetail(schoolId) {
        try {
            const formData = new FormData();
            formData.append('okulID', schoolId.toString());
            const response = await this.client.post(this.resolveBotPath('/0/0/okullar/detay/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[UserService] Fetching school detail for ${schoolId} failed:`, error);
            return null;
        }
    }
    /**
     * Fetches the friends list for a specific player (Legacy).
     *
     * @param params Pagination and specific player ID
     */
    async getFriendsList(params = {}) {
        try {
            const formData = new FormData();
            formData.append('sayfa', (params.page || 1).toString());
            formData.append('limit', (params.limit || 100).toString());
            if (params.userId !== undefined) {
                formData.append('oyuncubakid', params.userId.toString());
            }
            const response = await this.client.post(this.resolveBotPath('/0/0/arkadaslarim/0/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[UserService] Fetching friends list failed:`, error);
            return null;
        }
    }
    /**
     * Fetches the invitations list for the current player (Legacy).
     *
     * @param page The page number (sayfa)
     */
    async getInvitationsList(page = 1) {
        try {
            const formData = new FormData();
            formData.append('sayfa', page.toString());
            const response = await this.client.post(this.resolveBotPath('/0/0/davetliste/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[UserService] Fetching invitations list failed:`, error);
            return null;
        }
    }
    /**
     * Refreshes the user's invitation code (Legacy).
     */
    async refreshInviteCode() {
        try {
            const response = await this.client.post(this.resolveBotPath('/0/0/davetkodyenile/0/'), {});
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[UserService] Refreshing invite code failed:`, error);
            return null;
        }
    }
    /**
     * Requests an email verification URL for the user (Legacy).
     *
     * @param userId Optional ID of the player (userID)
     */
    async requestEmailVerificationUrl(userId) {
        try {
            const formData = new FormData();
            if (userId !== undefined) {
                formData.append('userID', userId.toString());
            }
            const response = await this.client.post(this.resolveBotPath('/0/0/profil/maildogrulamaURL/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[UserService] Requesting email verification URL failed:`, error);
            return null;
        }
    }
    /**
     * Pokes a friend (Legacy).
     *
     * @param userId The ID of the friend to poke (oyuncubakid)
     */
    async pokeFriend(userId) {
        try {
            const formData = new FormData();
            formData.append('oyuncubakid', userId.toString());
            const response = await this.client.post(this.resolveBotPath('/0/0/arkadas-durt/0/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[UserService] Poking friend ${userId} failed:`, error);
            return null;
        }
    }
    /**
     * Sets the user's favorite team (Legacy).
     *
     * @param teamId The ID of the team (favoritakimID)
     */
    async setFavoriteTeam(teamId) {
        try {
            const formData = new FormData();
            formData.append('favoritakimID', teamId.toString());
            const response = await this.client.post(this.resolveBotPath('/0/0/profil/favoritakimsec/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[UserService] Setting favorite team ${teamId} failed:`, error);
            return null;
        }
    }
    /**
     * Fetches the media (photos/videos) for a specific player (Legacy).
     *
     * @param params Filtering and pagination options
     */
    async getUserMedia(params) {
        try {
            const formData = new FormData();
            if (params.userId !== undefined) {
                formData.append('oyuncubakid', params.userId.toString());
            }
            formData.append('limit', (params.limit || 50).toString());
            formData.append('sayfa', (params.page || 1).toString());
            formData.append('kategori', params.category || 'all');
            const response = await this.client.post(this.resolveBotPath('/0/0/medya/0/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[UserService] Fetching media failed:`, error);
            return null;
        }
    }
    /**
     * Fetches the social profile details for a specific player (Legacy).
     *
     * @param userId Optional ID of the player (oyuncubakid)
     */
    async getSocialProfile(userId) {
        try {
            const formData = new FormData();
            if (userId !== undefined) {
                formData.append('oyuncubakid', userId.toString());
            }
            const response = await this.client.post(this.resolveBotPath('/0/0/sosyal/profil/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[UserService] Fetching social profile failed:`, error);
            return null;
        }
    }
    /**
     * Fetches the notifications for the current user (Legacy).
     */
    async getNotifications() {
        try {
            const response = await this.client.post(this.resolveBotPath('/0/0/bildirim/0/0/'), {});
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[UserService] Fetching notifications failed:`, error);
            return null;
        }
    }
    /**
     * Fetches the paginated notifications history for the current user (Legacy).
     *
     * @param page The page number (sayfa)
     * @param limit The number of items per page
     * @param category Optional category filter (kategori)
     * @param subCategory Optional sub-category filter (kategoridetay)
     */
    async getNotificationsHistory(page = 1, limit = 20, category, subCategory) {
        try {
            const formData = new FormData();
            formData.append('sayfa', page.toString());
            formData.append('limit', limit.toString());
            if (category) {
                formData.append('kategori', category);
            }
            if (subCategory) {
                formData.append('kategoridetay', subCategory);
            }
            const response = await this.client.post(this.resolveBotPath('/0/0/bildirimler/0/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[UserService] Fetching notifications history failed:`, error);
            return null;
        }
    }
    /**
     * Updates the user's avatar (Legacy).
     *
     * @param image The image file to upload (File, Blob, or File[])
     */
    async updateAvatar(image) {
        try {
            const file = Array.isArray(image) ? image[0] : image;
            if (!file)
                return null;
            const formData = new FormData();
            formData.append('resim', file);
            const response = await this.client.post(this.resolveBotPath('/0/0/avatar-guncelle/0/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[UserService] Updating avatar failed:`, error);
            return null;
        }
    }
    /**
     * Resets the user's avatar to default (Legacy).
     */
    async resetAvatar() {
        try {
            const response = await this.client.post(this.resolveBotPath('/0/0/avatar-varsayilan/0/0/'), {});
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[UserService] Resetting avatar failed:`, error);
            return null;
        }
    }
    /**
     * Resets the user's profile banner to default (Legacy).
     */
    async resetBanner() {
        try {
            const response = await this.client.post(this.resolveBotPath('/0/0/banner-varsayilan/0/0/'), {});
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[UserService] Resetting banner failed:`, error);
            return null;
        }
    }
    /**
     * Updates the user's profile background (Legacy).
     *
     * @param image The image file to upload (File, Blob, or File[])
     */
    async updateBackground(image) {
        try {
            const file = Array.isArray(image) ? image[0] : image;
            if (!file)
                return null;
            const formData = new FormData();
            formData.append('resim', file);
            const response = await this.client.post(this.resolveBotPath('/0/0/arkaplan-guncelle/0/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[UserService] Updating background failed:`, error);
            return null;
        }
    }
    /**
     * Rotates a photo by a specified degree (Legacy).
     *
     * @param photoId The ID of the photo to rotate
     * @param degree The rotation degree (e.g. -1 for clockwise, 90, 180, etc.)
     */
    async rotateMedia(photoId, degree) {
        try {
            const formData = new FormData();
            formData.append('fotografID', photoId.toString());
            formData.append('derece', degree.toString());
            const response = await this.client.post(this.resolveBotPath('/0/0/medya/donder/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[UserService] Rotating media ${photoId} failed:`, error);
            return null;
        }
    }
    /**
     * Deletes a specific media item (Legacy).
     *
     * @param mediaId The ID of the media to delete
     */
    async deleteMedia(mediaId) {
        try {
            const formData = new FormData();
            formData.append('medyaID', mediaId.toString());
            const response = await this.client.post(this.resolveBotPath('/0/0/medya/sil/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[UserService] Deleting media ${mediaId} failed:`, error);
            return null;
        }
    }
    /**
     * Uploads one or more media files (Legacy).
     *
     * @param files Array of File or Blob objects
     * @param category Optional category for the upload
     */
    async uploadMedia(files, category = MediaEnums_1.MediaCategory.ALL) {
        try {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('media[]', file);
            });
            formData.append('category', category);
            const response = await this.client.post(this.resolveBotPath('/0/0/medya/yukle/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[UserService] Uploading media failed:`, error);
            return null;
        }
    }
    /**
     * Fetches the user's notification settings (Legacy).
     */
    async getNotificationSettings() {
        try {
            const response = await this.client.post(this.resolveBotPath('/0/0/bildirimler/ayarlar/liste/'), {});
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[UserService] Fetching notification settings failed:`, error);
            return null;
        }
    }
    /**
     * Updates notification settings (Legacy).
     *
     * @param settings Record of settings (e.g. { paylasimbegeni: true })
     */
    async updateNotificationSettings(settings) {
        try {
            const formData = new FormData();
            Object.entries(settings).forEach(([key, value]) => {
                const val = typeof value === 'boolean' ? (value ? 1 : 0) : value;
                formData.append('notification[]', `${key}=${val}`);
            });
            const response = await this.client.post(this.resolveBotPath('/deneme/deneme/bildirimler/ayarlar/0/'), formData);
            return this.handleResponse(response);
        }
        catch (error) {
            this.logger.error(`[UserService] Updating notification settings failed:`, error);
            return null;
        }
    }
    /**
     * Fetches the XP rankings (leaderboard) (Legacy).
     *
     * @param page Ranking page number
     */
    async getXpRankings(page = 1) {
        try {
            const formData = new FormData();
            formData.append('sayfa', page.toString());
            const url = this.resolveBotPath('/0/0/xpsiralama/0/0/');
            const apiResponse = await this.client.post(url, formData);
            const data = this.handleResponse(apiResponse);
            return Array.isArray(data) ? data.map((u) => RankedUser_1.RankedUser.fromJSON(u)) : [];
        }
        catch (error) {
            this.logger.error('[UserService] Fetching XP rankings failed:', error);
            return [];
        }
    }
    /**
     * Fetches the popularity rankings (Legacy).
     *
     * @param page Ranking page number
     */
    async getPopRankings(page = 1) {
        try {
            const formData = new FormData();
            formData.append('sayfa', page.toString());
            const url = this.resolveBotPath('/0/0/popsiralama/0/0/');
            const apiResponse = await this.client.post(url, formData);
            const data = this.handleResponse(apiResponse);
            return Array.isArray(data) ? data.map((u) => RankedUser_1.RankedUser.fromJSON(u)) : [];
        }
        catch (error) {
            this.logger.error('[UserService] Fetching popularity rankings failed:', error);
            return [];
        }
    }
}
exports.UserService = UserService;
