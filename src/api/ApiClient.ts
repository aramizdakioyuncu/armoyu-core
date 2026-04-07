/**
 * Core API Client for the ARMOYU platform.
 * Used by all services in armoyu-core.
 */

let _apiUrl = 'https://api.aramizdakioyuncu.com';
let _token: string | null = null;

export const ApiConfig = {
  setBaseUrl(url: string) {
    _apiUrl = url;
  },
  setToken(token: string | null) {
    _token = token;
  },
  getToken(): string | null {
    return _token;
  }
};

export class ApiClient {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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

  static async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  static async post<T>(endpoint: string, body: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
  }

  static async put<T>(endpoint: string, body: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
  }

  static async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}
