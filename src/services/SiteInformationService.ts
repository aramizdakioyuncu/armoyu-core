import { SiteInformationResponse, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';

/**
 * Service for general site information, metadata, and announcements.
 */
export class SiteInformationService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Get general information about the platform (Legacy).
   */
  async getSiteInfo(): Promise<ServiceResponse<SiteInformationResponse>> {
    try {
      const response = await this.client.post<any>('/0/0/ana/0/0/', new FormData());
      const data = this.handle<any>(response);
      return this.createSuccess(data, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationService] Failed to fetch site info:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get about information content.
   */
  async getAboutContent(category: string = 'home'): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('kategori', category);
      const response = await this.client.post<any>('/0/0/hakkimizda/0/0/', formData);
      const data = this.handle<any>(response);
      return this.createSuccess(data, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationService] Failed to fetch about content:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get privacy policy content.
   */
  async getPrivacyPolicy(category: string = 'home'): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('kategori', category);
      const response = await this.client.post<any>('/0/0/gizlilik-politikasi/0/0/', formData);
      const data = this.handle<any>(response);
      return this.createSuccess(data, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationService] Failed to fetch privacy policy:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get terms of service content.
   */
  async getTermsOfService(category: string = 'home'): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('kategori', category);
      const response = await this.client.post<any>('/0/0/kullanim-sozlesmesi/0/0/', formData);
      const data = this.handle<any>(response);
      return this.createSuccess(data, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationService] Failed to fetch terms of service:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get site statistics.
   */
  async getStatistics(category: string = 'aktifoyuncu'): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('kategori', category);
      const response = await this.client.post<any>('/0/0/istatistikler/0/0/', formData);
      const data = this.handle<any>(response);
      return this.createSuccess(data, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationService] Failed to fetch statistics:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get session logs for troubleshooting.
   */
  async getSessionLogs(): Promise<ServiceResponse<any[]>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>('/0/0/ayarlar/oturum-kayitlari/0/', new FormData());
      const data = this.handle<any[]>(response);
      return this.createSuccess(Array.isArray(data) ? data : [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationService] Failed to fetch session logs:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get site wide messages/announcements for a user.
   */
  async getSiteMessages(userId?: number): Promise<ServiceResponse<any[]>> {
    try {
      const formData = new FormData();
      if (userId) formData.append('oyuncubakid', userId.toString());
      const response = await this.client.post<any>('/0/0/mesajlarim/0/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(Array.isArray(data) ? data : [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationService] Failed to fetch site messages:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get detailed site message.
   */
  async getSiteMessageDetail(userId?: number): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      if (userId) formData.append('oyuncubakid', userId.toString());
      const response = await this.client.post<any>('/0/0/mesajbak/0/0/', formData);
      const data = this.handle<any>(response);
      return this.createSuccess(data, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationService] Failed to fetch site message detail:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Search for tags/labels on the platform.
   */
  async searchTags(page: number, options?: { tag?: string, limit?: number }): Promise<ServiceResponse<any[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (options?.limit) formData.append('limit', options.limit.toString());
      if (options?.tag) formData.append('etiket', options.tag);

      const response = await this.client.post<any>('/0/0/etiketler/0/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(Array.isArray(data) ? data : [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationService] Failed to search tags:', error);
      return this.createError(error.message);
    }
  }
}

