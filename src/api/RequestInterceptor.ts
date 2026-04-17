import { ArmoyuLogger } from './Logger';
import { ApiConfig, ApiRequestOptions } from './types';

/**
 * Handles URL building and request preparation for the ApiClient.
 */
export class RequestInterceptor {
  static buildUrl(baseUrl: string, endpoint: string, params?: Record<string, any>): string {
    const url = new URL(`${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`);
    if (params) Object.entries(params).forEach(([k, v]) => v !== undefined && url.searchParams.append(k, String(v)));
    return url.toString();
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
