import { ApiClient, StandardApiResponse } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ServiceResponse } from '../api/ServiceResponse';

/**
 * Abstract base class for all services.
 * Provides shared utilities for response handling and bot path resolution.
 * @checked 2026-04-12
 */
export abstract class BaseService {
  constructor(
    protected client: ApiClient,
    protected logger: ArmoyuLogger
  ) {}

  /**
   * Universal response handler for ARMOYU standard responses.
   * Extracts 'icerik' if 'durum' is 1, otherwise throws error with 'aciklama'.
   * If the response doesn't have a 'durum' field but is an object/array, it is returned as-is.
   */
  protected handleResponse<T>(response: any): T {
    // If it's a standard response object with 'durum'
    if (response && typeof response === 'object' && 'durum' in response) {
      const standardResponse = response as StandardApiResponse<T>;
      
      // Relaxed check: accept numeric or string "1" for success
      if (standardResponse.durum != null && Number(standardResponse.durum) === 1) {
        return standardResponse.icerik;
      }
      
      // If durum is not 1, throw the API error message
      const errorMsg = standardResponse.aciklama || 'API Execution Error';
      this.logger.error(`[BaseService] API Error (${standardResponse.durum}): ${errorMsg}`, standardResponse);
      throw new Error(errorMsg);
    }

    // If it's a raw object or array without 'durum', return it as-is
    if (response && (typeof response === 'object' || Array.isArray(response))) {
      return response as T;
    }

    // ARMOYU SECURITY FIX: No longer allowing fallback for primitive non-standard responses
    const message = (response && typeof response === 'object') 
      ? (response.aciklama || JSON.stringify(response)) 
      : String(response || 'Bilinmeyen API Hatası');
      
    this.logger.error(`[BaseService] Invalid API Response Format: ${message}`);
    throw new Error(`API Hatası (Format): ${message}`);
  }

  /**
   * Helper to create a success ServiceResponse.
   */
  protected createSuccess<T>(data: T, message: string = 'İşlem Başarılı'): ServiceResponse<T> {
    return ServiceResponse.success(data, message);
  }

  /**
   * Helper to create an error ServiceResponse.
   */
  protected createError<T>(message: string, code: number = 0): ServiceResponse<T> {
    return ServiceResponse.error<T>(message, code);
  }

  /**
   * Builds the correct path for bot-based endpoints by automatically prepending 
   * the /botlar/[apiKey] prefix if it's missing.
   * 
   * @param path The relative path (e.g. /0/0/arama/0/0/)
   * @returns Resolved path with bot prefix if necessary
   */
  protected resolveBotPath(path: string): string {
    const apiKey = this.client.getApiKey();
    const baseUrl = this.client.getBaseUrl();
    
    // If we have an API key and the path is a legacy bot path starting with /0/
    // and it doesn't already contain /botlar/ AND the baseUrl doesn't already contain /botlar/
    if (apiKey && path.startsWith('/0/') && !path.includes('/botlar/')) {
      // Check if baseUrl already handles the botlar prefix
      if (!baseUrl.includes('/botlar/')) {
        return `/botlar/${apiKey}${path}`;
      }
    }

    return path;
  }

  /**
   * Helper to enforce authentication on sensitive operations.
   * Throws an error if no authentication token is present in the client.
   */
  protected requireAuth(): void {
    if (!(this.client as any).getToken()) {
      const errorMsg = 'Bu işlem için giriş yapmalısınız.';
      this.logger.error(`[${this.constructor.name}] Authentication required: ${errorMsg}`);
      throw new Error(errorMsg);
    }
  }
}
