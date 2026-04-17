import { ApiError } from './ApiClient';

/**
 * Handles API response parsing and error transformation.
 */
export class ResponseHandler {
  static async handleResponse<T>(response: Response): Promise<T> {
    let responseData: any;
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = text;
      }
    }

    if (!response.ok) {
      const msg = responseData?.aciklama || responseData?.message || `API Error: ${response.status}`;
      throw new ApiError(msg, response.status, response.statusText, responseData);
    }

    return responseData as T;
  }
}
