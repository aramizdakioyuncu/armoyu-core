import { ApiClient } from '../api/ApiClient';
import { StandardApi } from '../api/types';
import { ArmoyuLogger } from '../api/Logger';
import { ServiceResponse } from '../api/ServiceResponse';

/**
 * Abstract base class for all services. Shared utilities for response handling and bot path resolution.
 */
export abstract class BaseService {
  constructor(protected client: ApiClient, protected logger: ArmoyuLogger, protected usePreviousVersion: boolean = false) {}

  /**
   * Universal response handler for ARMOYU standard responses.
   */
  protected handle<T>(response: any): T {
    if (response && typeof response === 'object' && 'durum' in response) {
      const standard = response as StandardApi<T>;
      if (standard.durum != null && Number(standard.durum) === 1) return standard.icerik;
      
      const errorMsg = standard.aciklama || 'API Execution Error';
      this.logger.error(`[BaseService] API Error (${standard.durum}): ${errorMsg}`, standard);
      throw new Error(errorMsg);
    }

    if (response && (typeof response === 'object' || Array.isArray(response))) return response as T;

    const message = (response && typeof response === 'object') ? (response.aciklama || JSON.stringify(response)) : String(response || 'Bilinmeyen API Hatası');
    this.logger.error(`[BaseService] Invalid API Response Format: ${message}`);
    throw new Error(`API Hatası (Format): ${message}`);
  }

  protected createSuccess<T>(data: T, message: string = 'İşlem Başarılı') { return ServiceResponse.success(data, message); }
  protected createError<T>(message: string, code: number = 0) { return ServiceResponse.error<T>(message, code); }

  /**
   * Builds the correct path for bot-based endpoints.
   */
  protected resolveBotPath(path: string): string {
    const apiKey = this.client.getApiKey();
    const token = this.client.getToken();
    let res = path;

    if (apiKey && path.startsWith('/0/') && !path.includes('/botlar/')) {
      if (!this.client.getBaseUrl().includes('/botlar/')) res = `/botlar/${apiKey}${path}`;
    }

    const isAuth = res.includes('/giris/') || res.includes('/kayit-ol/') || res.includes('/sifremi-unuttum/') || res.endsWith('/0/0/0/');
    if (token && res.includes('/0/0/') && !isAuth) res = res.replace('/0/0/', `/0/${token}/`);

    return res;
  }

  protected requireAuth(): void {
    if (!this.client.getToken()) {
      this.logger.error(`[BaseService] Authentication required.`);
      throw new Error('Bu işlem için giriş yapmalısınız.');
    }
  }
}
