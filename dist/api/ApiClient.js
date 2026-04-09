"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = exports.HttpMethod = exports.ApiError = void 0;
/**
 * Core API Client for the ARMOYU platform.
 * Supports instance-based configuration and standard HTTP methods.
 */
const Logger_1 = require("./Logger");
class ApiError extends Error {
    constructor(message, status, statusText, data) {
        super(message);
        this.message = message;
        this.status = status;
        this.statusText = statusText;
        this.data = data;
        this.name = 'ApiError';
    }
}
exports.ApiError = ApiError;
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["POST"] = "POST";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["PATCH"] = "PATCH";
    HttpMethod["DELETE"] = "DELETE";
})(HttpMethod || (exports.HttpMethod = HttpMethod = {}));
class ApiClient {
    constructor(config) {
        this.lastRawResponse = null;
        this.config = {
            ...config,
            headers: {
                ...config.headers,
            },
        };
        this.logger = config.logger || new Logger_1.ConsoleLogger();
    }
    async request(endpoint, options = {}) {
        const { params, ...fetchOptions } = options;
        // Build URL with query parameters
        let url = `${this.config.baseUrl}${endpoint}`;
        if (params) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    searchParams.append(key, String(value));
                }
            });
            const queryString = searchParams.toString();
            if (queryString) {
                url += (url.includes('?') ? '&' : '?') + queryString;
            }
        }
        const headers = new Headers(this.config.headers || {});
        // Default to JSON body handling if it's a plain object
        let requestBody = options.body;
        if (options.body && typeof options.body === 'object' &&
            !(options.body instanceof URLSearchParams) &&
            !(typeof FormData !== 'undefined' && options.body instanceof FormData)) {
            headers.set('Content-Type', 'application/json');
            requestBody = JSON.stringify(options.body);
        }
        if (this.config.token) {
            // Validate token to avoid 'non ISO-8859-1' errors in headers
            const isAscii = /^[ -~]*$/.test(this.config.token);
            if (isAscii) {
                headers.set('Authorization', `Bearer ${this.config.token}`);
            }
            else {
                this.logger.warn('[ApiClient] Token contains invalid characters, skipping Authorization header.');
            }
        }
        if (this.config.apiKey) {
            // Validate apiKey to avoid 'non ISO-8859-1' errors in headers
            const isAscii = /^[ -~]*$/.test(this.config.apiKey);
            if (isAscii) {
                headers.set('X-API-KEY', this.config.apiKey);
            }
            else {
                this.logger.warn('[ApiClient] API Key contains invalid characters, skipping X-API-KEY header.');
            }
        }
        try {
            const response = await fetch(url, {
                ...fetchOptions,
                headers,
                body: requestBody
            });
            let responseData;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                responseData = await response.json();
            }
            else {
                const text = await response.text();
                try {
                    // Robust JSON parsing for some ARMOYU API endpoints that return JSON but with wrong Content-Type
                    responseData = JSON.parse(text);
                }
                catch {
                    responseData = text;
                }
            }
            if (!response.ok) {
                this.lastRawResponse = responseData;
                const errorMsg = (responseData === null || responseData === void 0 ? void 0 : responseData.aciklama) || (responseData === null || responseData === void 0 ? void 0 : responseData.message) || `API Error: ${response.status} - ${response.statusText}`;
                throw new ApiError(errorMsg, response.status, response.statusText, responseData);
            }
            this.lastRawResponse = responseData;
            return responseData;
        }
        catch (error) {
            if (error instanceof ApiError)
                throw error;
            throw new ApiError(error instanceof Error ? error.message : 'Unknown Network Error');
        }
    }
    async get(endpoint, options) {
        return this.request(endpoint, { ...options, method: HttpMethod.GET });
    }
    async post(endpoint, body, options) {
        return this.request(endpoint, {
            ...options,
            method: HttpMethod.POST,
            body: body
        });
    }
    async put(endpoint, body, options) {
        return this.request(endpoint, {
            ...options,
            method: HttpMethod.PUT,
            body: body
        });
    }
    async patch(endpoint, body, options) {
        return this.request(endpoint, {
            ...options,
            method: HttpMethod.PATCH,
            body: body
        });
    }
    async delete(endpoint, options) {
        return this.request(endpoint, { ...options, method: HttpMethod.DELETE });
    }
    setToken(token) {
        this.config.token = token;
    }
    setApiKey(key) {
        this.config.apiKey = key;
    }
    getApiKey() {
        return this.config.apiKey || null;
    }
    setBaseUrl(url) {
        this.config.baseUrl = url;
    }
}
exports.ApiClient = ApiClient;
