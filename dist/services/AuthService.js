"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const User_1 = require("../models/auth/User");
const Session_1 = require("../models/auth/Session");
const BaseService_1 = require("./BaseService");
class AuthService extends BaseService_1.BaseService {
    constructor() {
        super(...arguments);
        this.currentUser = null;
        this.session = null;
    }
    /**
     * Authenticate a user with username and password.
     */
    async login(username, password) {
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            const response = await this.client.post('/0/0/0', formData);
            // Handle raw response if it's still a string (though ApiClient should have parsed it)
            const data = typeof response === 'string' ? JSON.parse(response) : response;
            const icerik = this.handleResponse(data);
            // ARMOYU Login logic: Token is inside the 'aciklama' field (as a string or object)
            let token = '';
            if (typeof data.aciklama === 'string') {
                // Only treat as token if it doesn't contain spaces/special characters (not a sentence like "Giriş Başarılı")
                const isStrictToken = /^[a-zA-Z0-9.\-_=]+$/.test(data.aciklama);
                if (isStrictToken) {
                    token = data.aciklama;
                }
            }
            else if (data.aciklama && typeof data.aciklama === 'object') {
                token = data.aciklama.token || data.aciklama.session_token || '';
            }
            this.currentUser = User_1.User.fromJSON(icerik);
            this.session = new Session_1.Session({
                user: this.currentUser,
                token: token || (icerik === null || icerik === void 0 ? void 0 : icerik.token) || (icerik === null || icerik === void 0 ? void 0 : icerik.session_token) || null
            });
            // Update client token for all subsequent requests
            if (this.session.token) {
                this.client.setToken(this.session.token);
                // Store token in localStorage if available (standard browser behavior)
                if (typeof window !== 'undefined') {
                    localStorage.setItem('armoyu_token', this.session.token);
                }
            }
            return { user: this.currentUser, session: this.session };
        }
        catch (error) {
            console.error('[AuthService] Login failed:', error);
            throw error;
        }
    }
    /**
     * Register a new user.
     */
    async register(data) {
        try {
            const response = await this.client.post('/auth/register', data);
            const icerik = this.handleResponse(response);
            return { user: User_1.User.fromJSON(icerik.user) };
        }
        catch (error) {
            console.error('[AuthService] Registration failed:', error);
            throw error;
        }
    }
    /**
     * Logout the current user.
     */
    async logout() {
        try {
            await this.client.post('/auth/logout', {});
        }
        catch (error) {
            console.error('[AuthService] Logout API call failed:', error);
        }
        finally {
            this.currentUser = null;
            this.session = null;
            this.client.setToken(null);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('armoyu_token');
            }
        }
    }
    /**
     * Get the currently authenticated user's profile.
     */
    async me() {
        try {
            const response = await this.client.get('/auth/me');
            const icerik = this.handleResponse(response);
            // Robust mapping: handle direct user object or nested { user: {...} }
            const userData = icerik && (icerik.user || icerik);
            this.currentUser = userData ? User_1.User.fromJSON(userData) : null;
            return this.currentUser;
        }
        catch (error) {
            this.currentUser = null;
            return null;
        }
    }
    getCurrentUser() {
        return this.currentUser;
    }
    getSession() {
        return this.session;
    }
    isAuthenticated() {
        return !!this.currentUser || !!this.client;
    }
}
exports.AuthService = AuthService;
