"use strict";
/**
 * Core API Client for the ARMOYU platform.
 * Used by all services in armoyu-core.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = exports.ApiConfig = void 0;
let _apiUrl = 'https://api.aramizdakioyuncu.com';
let _token = null;
exports.ApiConfig = {
    setBaseUrl(url) {
        _apiUrl = url;
    },
    setToken(token) {
        _token = token;
    },
    getToken() {
        return _token;
    }
};
class ApiClient {
    static async request(endpoint, options = {}) {
        const headers = new Headers(options.headers || {});
        headers.set('Content-Type', 'application/json');
        if (_token) {
            headers.set('Authorization', `Bearer ${_token}`);
        }
        const response = await fetch(`${_apiUrl}${endpoint}`, {
            ...options,
            headers,
        });
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }
        return response.json();
    }
    static async get(endpoint, options) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }
    static async post(endpoint, body, options) {
        return this.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
    }
    static async put(endpoint, body, options) {
        return this.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
    }
    static async delete(endpoint, options) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
}
exports.ApiClient = ApiClient;
