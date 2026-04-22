import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';

/**
 * Base class for all services providing common utilities.
 */
export class BaseService {
  constructor(protected client: ApiClient, protected logger: ArmoyuLogger) {}

  /**
   * Handle the standard API response structure.
   */
  protected handle<T>(response: any): T {
    if (typeof response === 'string') {
      const isHtml = response.trim().startsWith('<!DOCTYPE') || response.trim().startsWith('<html');
      if (isHtml) {
        throw new Error('API Hatası (Format): Beklenmedik HTML cevabı alındı (URL yapısı veya Yetki hatası olabilir)');
      }
    }

    const standard = response || {};
    
    // Legacy ARMOYU API uses 'durum' for success and 'icerik' for data
    if (standard.durum != null && Number(standard.durum) === 1) {
      return (standard.icerik !== undefined ? standard.icerik : standard.data) as T;
    }

    const errorMsg = standard.aciklama || 'API Execution Error';
    this.logger.error(`[BaseService] API Error (${standard.durum}): ${errorMsg}`);
    throw new Error(errorMsg);
  }

  protected createSuccess<T>(icerik: T, aciklama?: string, detail?: number) {
    return {
      durum: 1,
      aciklama: aciklama || 'İşlem Başarılı',
      aciklamadetay: detail,
      icerik
    };
  }

  protected createError(message: string) {
    return {
      durum: 0,
      aciklama: message,
      icerik: undefined
    };
  }

  protected requireAuth() {
    if (!(this.client as any).config.token) {
      throw new Error('Kullanıcı Girişi Yapılmamış');
    }
  }
}

