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

  /**
   * Resolve a path to its bot-compatible format.
   * Logic: Most endpoints use /0/0/ when Bearer header is present.
   * Exception: Some legacy endpoints (oyuncubak, destek) STILL require token in URL.
   */
  protected resolveBotPath(path: string): string {
    let cleanPath = path;
    if (!cleanPath.startsWith('/')) {
        cleanPath = '/' + cleanPath;
    }
    
    // Strip existing /0/0/ or /0/{token}/0/ to re-standardize
    const segments = cleanPath.split('/').filter(s => s !== '');
    let corePath = cleanPath;
    if (segments[0] === '0') {
        // Starts with /0/TOKEN/0/... or /0/0/...
        if (segments[2] === '0') {
            corePath = '/' + segments.slice(3).join('/');
        } else if (segments[1] === '0') {
            corePath = '/' + segments.slice(2).join('/');
        }
    }

    // Ensure corePath ends with slash for consistency if requested
    if (cleanPath.endsWith('/') && !corePath.endsWith('/')) {
        corePath += '/';
    }

    // Identify exceptions that NEED token in URL
    const tokenRequiredKeywords = ['oyuncubak', 'destek'];
    const needsToken = tokenRequiredKeywords.some(kw => corePath.includes(kw));

    if (needsToken) {
        const config = (this.client as any).config;
        const token = config.token || '0';
        return `/0/${token}/0${corePath}`;
    }
    
    // Default to clean /0/0/
    return `/0/0${corePath}`;
  }

  protected createSuccess<T>(icerik: T, aciklama?: string) {
    return {
      durum: 1,
      aciklama: aciklama || 'İşlem Başarılı',
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
