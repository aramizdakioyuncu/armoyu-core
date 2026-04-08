import { ApiClient, StandardApiResponse } from '../api/ApiClient';

export abstract class BaseService {
  constructor(protected client: ApiClient) {}

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
      throw new Error(standardResponse.aciklama || 'API Execution Error');
    }

    // Fallback for non-standard responses
    return response as T;
  }
}
