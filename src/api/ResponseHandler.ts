import { ApiError } from './ApiClient';

/**
 * Handles API response parsing and error transformation.
 */
export class ResponseHandler {
  static async parseBody(response: Response): Promise<any> {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      try { return await response.json(); } catch { return null; }
    }
    const text = await response.text();
    try { return JSON.parse(text); } catch { return text; }
  }

  static processResponse<T>(response: Response, data: any): T {
    if (!response.ok) {
      const msg = data?.aciklama || data?.message || `API Error: ${response.status}`;
      throw new ApiError(msg, response.status, response.statusText, data);
    }
    return data as T;
  }

  // Deprecated: used for backward compatibility during refactor
  static async handleResponse<T>(response: Response): Promise<T> {
    const data = await this.parseBody(response);
    return this.processResponse<T>(response, data);
  }
}
