import { ApiClient, StandardApiResponse } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';

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
   */
  protected handleResponse<T>(response: any): T {
    // If it's a standard response object
    if (response && typeof response === 'object' && 'durum' in response) {
      const standardResponse = response as StandardApiResponse<T>;
      
      // Relaxed check: accept numeric or string "1" for success
      if (Number(standardResponse.durum) === 1) {
        return standardResponse.icerik;
      }
      
      // If durum is not 1, throw the API error message
      const errorMsg = standardResponse.aciklama || 'API Execution Error';
      this.logger.error(`[BaseService] API Error (${standardResponse.durum}): ${errorMsg}`, standardResponse);
      throw new Error(errorMsg);
    }

    // Fallback for non-standard responses
    return response as T;
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
}
