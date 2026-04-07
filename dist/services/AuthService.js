"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const ApiClient_1 = require("../api/ApiClient");
const User_1 = require("../models/auth/User");
const Session_1 = require("../models/auth/Session");
class AuthService {
    /**
     * Authenticate a user with username and password.
     */
    static async login(username, password) {
        try {
            const response = await ApiClient_1.ApiClient.post('/auth/login', {
                username,
                password
            });
            this.currentUser = User_1.User.fromJSON(response.user);
            this.session = Session_1.Session.fromJSON(response.session);
            // Store token in localStorage if available
            if (typeof window !== 'undefined' && this.session.token) {
                localStorage.setItem('armoyu_token', this.session.token);
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
    static async register(data) {
        try {
            const response = await ApiClient_1.ApiClient.post('/auth/register', data);
            return { user: User_1.User.fromJSON(response.user) };
        }
        catch (error) {
            console.error('[AuthService] Registration failed:', error);
            throw error;
        }
    }
    /**
     * Logout the current user.
     */
    static async logout() {
        try {
            await ApiClient_1.ApiClient.post('/auth/logout', {});
        }
        catch (error) {
            console.error('[AuthService] Logout API call failed:', error);
        }
        finally {
            this.currentUser = null;
            this.session = null;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('armoyu_token');
            }
        }
    }
    /**
     * Get the currently authenticated user's profile.
     */
    static async me() {
        try {
            if (this.currentUser)
                return this.currentUser;
            const response = await ApiClient_1.ApiClient.get('/auth/me');
            this.currentUser = User_1.User.fromJSON(response.user);
            return this.currentUser;
        }
        catch (error) {
            return null;
        }
    }
    static getCurrentUser() {
        return this.currentUser;
    }
    static getSession() {
        return this.session;
    }
    static isAuthenticated() {
        return !!this.currentUser;
    }
}
exports.AuthService = AuthService;
AuthService.currentUser = null;
AuthService.session = null;
