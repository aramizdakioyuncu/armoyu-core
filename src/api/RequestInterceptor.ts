import { ArmoyuLogger } from './Logger';
import { ApiConfig, ApiRequestOptions } from './types';

/**
 * Handles URL building and request preparation for the ApiClient.
 */
export class RequestInterceptor {
  static buildUrl(baseUrl: string, endpoint: string, params?: Record<string, any>): string {
    // Separate base path from existing query string if any
    const [basePath, baseQuery] = baseUrl.split('?');
    const cleanBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // Build combined path
    let fullPath = `${cleanBase}${cleanEndpoint}`;
    if (baseQuery) fullPath += `?${baseQuery}`;

    if (fullPath.includes('://')) {
      const url = new URL(fullPath);
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined) url.searchParams.append(k, String(v));
        });
      }
      return url.toString();
    }

    const searchParams = new URLSearchParams(baseQuery || '');
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined) searchParams.append(k, String(v));
      });
    }
    const qs = searchParams.toString();
    const basePathOnly = fullPath.split('?')[0];
    return qs ? `${basePathOnly}?${qs}` : basePathOnly;
  }

  static prepareRequest(config: ApiConfig, options: ApiRequestOptions, logger: ArmoyuLogger) {
    const headers = new Headers(config.headers || {});
    if (config.apiKey) headers.set('X-API-KEY', config.apiKey);
    if (config.token) headers.set('Authorization', `Bearer ${config.token}`);
    if (options.headers) new Headers(options.headers).forEach((v, k) => headers.set(k, v));

    let body = options.body;
    if (body && !(body instanceof FormData) && !(body instanceof Blob) && typeof body === 'object') {
      headers.set('Content-Type', 'application/json');
      body = JSON.stringify(body);
    }

    logger.debug?.(`[ApiClient] Request: ${options.method || 'GET'} ${headers.get('Content-Type') || 'No-Type'}`);
    return { headers, body };
  }
}
