/**
 * Core API Client for the ARMOYU platform.
 * Supports instance-based configuration and standard HTTP methods.
 */

export class ApiError extends Error {
  constructor(
    public message: string,
    public status?: number,
    public statusText?: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
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

export class ApiClient {
  private config: ApiConfig;
  public lastRawResponse: any = null;

  constructor(config: ApiConfig) {
    this.config = {
      ...config,
      headers: {
        ...config.headers,
      },
    };
  }

  private async request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
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
    let requestBody: any = options.body;
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
      } else {
        console.warn('[ApiClient] Token contains invalid characters, skipping Authorization header.');
      }
    }
    
    if (this.config.apiKey) {
      // Validate apiKey to avoid 'non ISO-8859-1' errors in headers
      const isAscii = /^[ -~]*$/.test(this.config.apiKey);
      if (isAscii) {
        headers.set('X-API-KEY', this.config.apiKey);
      } else {
        console.warn('[ApiClient] API Key contains invalid characters, skipping X-API-KEY header.');
      }
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        body: requestBody
      });

      let responseData: any;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        try {
          // Robust JSON parsing for some ARMOYU API endpoints that return JSON but with wrong Content-Type
          responseData = JSON.parse(text);
        } catch {
          responseData = text;
        }
      }

      if (!response.ok) {
        this.lastRawResponse = responseData;
        const errorMsg = responseData?.aciklama || responseData?.message || `API Error: ${response.status} - ${response.statusText}`;
        throw new ApiError(
          errorMsg,
          response.status,
          response.statusText,
          responseData
        );
      }

      this.lastRawResponse = responseData;
      return responseData as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(error instanceof Error ? error.message : 'Unknown Network Error');
    }
  }

  async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: HttpMethod.GET });
  }

  async post<T>(endpoint: string, body?: any, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { 
      ...options, 
      method: HttpMethod.POST, 
      body: body
    });
  }

  async put<T>(endpoint: string, body?: any, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { 
      ...options, 
      method: HttpMethod.PUT, 
      body: body
    });
  }

  async patch<T>(endpoint: string, body?: any, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { 
      ...options, 
      method: HttpMethod.PATCH, 
      body: body
    });
  }

  async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: HttpMethod.DELETE });
  }

  setToken(token: string | null) {
    this.config.token = token;
  }

  setApiKey(key: string | null) {
    this.config.apiKey = key;
  }

  getApiKey(): string | null {
    return this.config.apiKey || null;
  }

  setBaseUrl(url: string) {
    this.config.baseUrl = url;
  }
}

// Default instance for shared use
export const defaultApiClient = new ApiClient({
  baseUrl: 'https://api.aramizdakioyuncu.com'
});

