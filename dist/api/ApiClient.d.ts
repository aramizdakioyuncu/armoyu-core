/**
 * Core API Client for the ARMOYU platform.
 * Used by all services in armoyu-core.
 */
export declare const ApiConfig: {
    setBaseUrl(url: string): void;
    setToken(token: string | null): void;
    getToken(): string | null;
};
export declare class ApiClient {
    private static request;
    static get<T>(endpoint: string, options?: RequestInit): Promise<T>;
    static post<T>(endpoint: string, body: unknown, options?: RequestInit): Promise<T>;
    static put<T>(endpoint: string, body: unknown, options?: RequestInit): Promise<T>;
    static delete<T>(endpoint: string, options?: RequestInit): Promise<T>;
}
