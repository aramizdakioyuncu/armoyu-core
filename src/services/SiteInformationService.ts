import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ServiceResponse } from '../api/ServiceResponse';
import { SearchCategory } from '../models/social/search/SearchEnums';

/**
 * Service for fetching site-wide information, content pages, statistics, and announcements.
 * @checked 2026-04-12
 */
export class SiteInformationService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Fetches general page content based on category and page slug.
   */
  async getPageContent(page: string, category: string = 'home'): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('category', category);

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/${page}/0/0/`), formData);
      
      let icerik: any = null;
      if (response && Number(response.durum) === 1) {
        icerik = response.aciklamadetay || response.icerik;
      } else {
        icerik = this.handle<any>(response);
      }
      
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SiteInformationService] Fetching ${page} content for ${category} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches "About Us" page content.
   */
  async getAboutContent(category: string = 'home'): Promise<ServiceResponse<any>> {
    return this.getPageContent('hakkimizda', category);
  }

  /**
   * Fetches "Privacy Policy" page content.
   */
  async getPrivacyPolicy(category: string = 'home'): Promise<ServiceResponse<any>> {
    return this.getPageContent('gizlilik-sozlesmesi', category);
  }

  /**
   * Fetches "Terms of Service & User Policies" page content.
   */
  async getTermsOfService(category: string = 'home'): Promise<ServiceResponse<any>> {
    return this.getPageContent('hizmetsartlari-kullanicipolitikalari', category);
  }

  /**
   * Fetches platform statistics.
   */
  async getStatistics(category: string = 'aktifoyuncu'): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('category', category);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/istatistik/0/0/'), formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SiteInformationService] Fetching statistics for ${category} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches session logs/history.
   */
  async getSessionLogs(): Promise<ServiceResponse<any>> {
    return this.getStatistics('oturumkayitlari');
  }

  /**
   * Fetches site messages for a specific player.
   */
  async getSiteMessages(userId?: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      if (userId !== undefined) {
        formData.append('oyuncubakid', userId.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sitemesaji/0/0/'), formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SiteInformationService] Fetching site messages failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches detailed site message content for a specific player.
   */
  async getSiteMessageDetail(userId?: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      if (userId !== undefined) {
        formData.append('oyuncubakid', userId.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sitemesajidetay/0/0/'), formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SiteInformationService] Fetching site message detail failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Searches for content or players by tags.
   */
  async searchTags(page: number, params: { tag: string, limit?: number }): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('etiket', params.tag);
      formData.append('sayfa', page.toString());
      formData.append('limit', (params.limit || 50).toString());

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/etiketler/${page}/0/`), formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SiteInformationService] Searching tags for ${params.tag} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * General search across different categories.
   */
  async search(page: number, params: { 
    query: string, 
    category: SearchCategory | string, 
    subCategory?: string, 
    limit?: number 
  }): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('oyuncuadi', params.query);
      formData.append('kategori', params.category);
      formData.append('kategoridetay', params.subCategory || '1');
      formData.append('sayfa', page.toString());
      formData.append('limit', (params.limit || 50).toString());

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/arama/${page}/0/`), formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SiteInformationService] Search for ${params.query} in ${params.category} failed:`, error);
      return this.createError(error.message);
    }
  }
}



