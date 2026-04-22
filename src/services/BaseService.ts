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

    // Special case: If path is just zeros (Universal Router), preserve it exactly
    const zeroSegments = cleanPath.split('/').filter(s => s !== '');
    const isAllZeros = zeroSegments.length > 0 && zeroSegments.every(s => s === '0');
    if (isAllZeros) {
        // Return as is, starting with /0/
        return cleanPath.startsWith('/0/') ? cleanPath : `/0${cleanPath}`;
    }

    // Identify exceptions that NEED token in URL
    const tokenRequiredKeywords = ['oyuncubak', 'destek'];
    const needsToken = tokenRequiredKeywords.some(kw => cleanPath.includes(kw));

    if (needsToken) {
      const config = (this.client as any).config;
      const potentialToken = config.token || '';
      const isValidToken = potentialToken.length > 50 && !potentialToken.includes(' ');
      const token = isValidToken ? potentialToken : '0';

      // If cleanPath already starts with /0/someToken/0/, strip it
      let corePath = cleanPath;
      if (zeroSegments[0] === '0' && zeroSegments[2] === '0') {
        corePath = '/' + zeroSegments.slice(3).join('/');
      } else if (zeroSegments[0] === '0' && zeroSegments[1] === '0') {
        corePath = '/' + zeroSegments.slice(2).join('/');
      }
      
      // Ensure slash
      if (!corePath.startsWith('/')) corePath = '/' + corePath;
      if (cleanPath.endsWith('/') && !corePath.endsWith('/')) corePath += '/';

      return `/0/${token}${corePath}`;
    }

    // Default: Ensure starts with /0/0/ and append the rest
    let finalCore = cleanPath;
    if (zeroSegments[0] === '0' && zeroSegments[1] === '0') {
        finalCore = '/' + zeroSegments.slice(2).join('/');
    }
    
    if (!finalCore.startsWith('/')) finalCore = '/' + finalCore;
    if (cleanPath.endsWith('/') && !finalCore.endsWith('/')) finalCore += '/';

    return `/0/0${finalCore}`;
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
