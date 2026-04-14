"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const User_1 = require("../models/auth/User");
const Session_1 = require("../models/auth/Session");
const BaseService_1 = require("./BaseService");
/**
 * Service for managing user authentication, registration, and session lifecycle.
 * @checked 2026-04-12
 */
class AuthService extends BaseService_1.BaseService {
    constructor(client, logger) {
        super(client, logger);
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
            const response = await this.client.post(this.resolveBotPath('/0/0/0'), formData);
            // Handle raw response if it's still a string (though ApiClient should have parsed it)
            const data = typeof response === 'string' ? JSON.parse(response) : response;
            const icerik = this.handleResponse(data);
            if (!icerik) {
                throw new Error('API Hatası: Kullanıcı bilgileri alınamadı.');
            }
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
            // ARMOYU Login logic: Token can be in 'aciklama' OR inside 'icerik'
            const extractedToken = token || (icerik === null || icerik === void 0 ? void 0 : icerik.token) || (icerik === null || icerik === void 0 ? void 0 : icerik.session_token) || null;
            // EXTRA VALIDATION: Ensure we have a valid user ID and a token
            if (!this.currentUser.id || !extractedToken) {
                this.logger.error('[AuthService] Login failed validation:', {
                    hasId: !!this.currentUser.id,
                    hasToken: !!extractedToken,
                    aciklama: data.aciklama,
                    icerikItems: Object.keys(icerik || {})
                });
                throw new Error('Geçersiz kullanıcı bilgileri veya token alınamadı.');
            }
            this.session = new Session_1.Session({
                user: this.currentUser,
                token: extractedToken
            });
            // Update client token for all subsequent requests
            this.client.setToken(this.session.token);
            return { user: this.currentUser, session: this.session };
        }
        catch (error) {
            this.logger.error('[AuthService] Login failed:', error);
            throw error;
        }
    }
    /**
     * Register a new user (Legacy).
     */
    async register(params) {
        try {
            const formData = new FormData();
            formData.append('kullaniciadi', params.username);
            formData.append('ad', params.firstName);
            formData.append('soyad', params.lastName);
            formData.append('email', params.email);
            formData.append('parola', params.password);
            formData.append('parolakontrol', params.password);
            const response = await this.client.post(this.resolveBotPath('/kayit-ol/0/0/0/0/'), formData);
            const data = typeof response === 'string' ? JSON.parse(response) : response;
            this.handleResponse(data);
            return data && Number(data.durum) === 1;
        }
        catch (error) {
            this.logger.error('[AuthService] Registration failed:', error);
            return false;
        }
    }
    /**
     * Request a password reset (Legacy).
     */
    async forgotPassword(params) {
        try {
            const formData = new FormData();
            formData.append('kullaniciadi', params.username);
            formData.append('email', params.email);
            formData.append('dogumtarihi', params.birthday);
            formData.append('sifirlamatercihi', params.preference);
            const response = await this.client.post(this.resolveBotPath('/sifremi-unuttum/0/0/0/0/'), formData);
            const data = typeof response === 'string' ? JSON.parse(response) : response;
            this.handleResponse(data);
            return data && Number(data.durum) === 1;
        }
        catch (error) {
            this.logger.error('[AuthService] Forgot password request failed:', error);
            return false;
        }
    }
    /**
     * Verify and complete password reset (Legacy).
     */
    async verifyPasswordReset(params) {
        try {
            const formData = new FormData();
            formData.append('kullaniciadi', params.username);
            formData.append('email', params.email);
            formData.append('dogumtarihi', params.birthday);
            formData.append('dogrulamakodu', params.code);
            formData.append('sifre', params.newPassword);
            formData.append('sifretekrar', params.newPassword);
            const response = await this.client.post(this.resolveBotPath('/sifremi-unuttum-dogrula/0/0/0/0/'), formData);
            const data = typeof response === 'string' ? JSON.parse(response) : response;
            this.handleResponse(data);
            return data && Number(data.durum) === 1;
        }
        catch (error) {
            this.logger.error('[AuthService] Verify password reset failed:', error);
            return false;
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
            this.logger.error('[AuthService] Logout API call failed:', error);
        }
        finally {
            this.currentUser = null;
            this.session = null;
            this.client.setToken(null);
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
