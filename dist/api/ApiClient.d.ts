/**
 * Core API Client for the ARMOYU platform.
 * Supports instance-based configuration and standard HTTP methods.
 */
export declare class ApiError extends Error {
    message: string;
    status?: number | undefined;
    statusText?: string | undefined;
    data?: any | undefined;
    constructor(message: string, status?: number | undefined, statusText?: string | undefined, data?: any | undefined);
}
export declare enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE"
}
export interface ApiRequestOptions extends RequestInit {
    params?: Record<string, string | number | boolean | undefined>;
    method?: HttpMethod | string;
}
export interface ApiConfig {
    baseUrl: string;
    token?: string | null;
    apiKey?: string | null;
    headers?: Record<string, string>;
}
/**
 * Standard API Response structure for ARMOYU legacy and bot APIs.
 */
export interface StandardApiResponse<T = any> {
    durum: number;
    aciklama: string | any;
    aciklamadetay?: number;
    icerik: T;
    zaman: string;
}
export declare class ApiClient {
    private config;
    lastRawResponse: any;
    constructor(config: ApiConfig);
    private request;
    get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T>;
    post<T>(endpoint: string, body?: any, options?: ApiRequestOptions): Promise<T>;
    put<T>(endpoint: string, body?: any, options?: ApiRequestOptions): Promise<T>;
    patch<T>(endpoint: string, body?: any, options?: ApiRequestOptions): Promise<T>;
    delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T>;
    setToken(token: string | null): void;
    setApiKey(key: string | null): void;
    getApiKey(): string | null;
    setBaseUrl(url: string): void;
}
export declare const defaultApiClient: ApiClient;
