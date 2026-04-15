import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';

import { SearchCategory } from '../models/social/SearchEnums';

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
   * 
   * @param page The page slug (e.g. 'hakkimizda', 'gizlilik-sozlesmesi')
   * @param category The category slug (e.g. 'home')
   * @returns Raw content or structured page data
   */
  async getPageContent(page: string, category: string = 'home'): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('category', category);

      // Endpoint pattern usually follows /0/0/[page]/0/0/
      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/${page}/0/0/`), formData);
      
      // ARMOYU Info API: Sometimes data is in 'aciklamadetay' instead of 'icerik'
      if (response && Number(response.durum) === 1) {
        return response.aciklamadetay || response.icerik;
      }
      
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[SiteInformationService] Fetching ${page} content for ${category} failed:`, error);
      return null;
    }
  }

  /**
   * Fetches "About Us" page content.
   */
  async getAboutContent(category: string = 'home'): Promise<any> {
    return this.getPageContent('hakkimizda', category);
  }

  /**
   * Fetches "Privacy Policy" page content.
   */
  async getPrivacyPolicy(category: string = 'home'): Promise<any> {
    return this.getPageContent('gizlilik-sozlesmesi', category);
  }

  /**
   * Fetches "Terms of Service & User Policies" page content.
   */
  async getTermsOfService(category: string = 'home'): Promise<any> {
    return this.getPageContent('hizmetsartlari-kullanicipolitikalari', category);
  }

  /**
   * Fetches platform statistics.
   * 
   * @param category The statistics category (e.g. 'aktifoyuncu')
   * @returns Raw statistics data
   */
  async getStatistics(category: string = 'aktifoyuncu'): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('category', category);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/istatistik/0/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[SiteInformationService] Fetching statistics for ${category} failed:`, error);
      return null;
    }
  }

  /**
   * Fetches session logs/history.
   */
  async getSessionLogs(): Promise<any> {
    return this.getStatistics('oturumkayitlari');
  }

  /**
   * Fetches site messages for a specific player.
   * 
   * @param userId Optional ID of the player to fetch messages for (oyuncubakid)
   * @returns Raw message data or structured list of messages
   */
  async getSiteMessages(userId?: number): Promise<any> {
    this.requireAuth();
    try {
      const formData = new FormData();
      if (userId !== undefined) {
        formData.append('oyuncubakid', userId.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sitemesaji/0/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[SiteInformationService] Fetching site messages failed:`, error);
      return null;
    }
  }

  /**
   * Fetches detailed site message content for a specific player.
   * 
   * @param userId Optional ID of the player (oyuncubakid)
   * @returns Detailed message content
   */
  async getSiteMessageDetail(userId?: number): Promise<any> {
    this.requireAuth();
    try {
      const formData = new FormData();
      if (userId !== undefined) {
        formData.append('oyuncubakid', userId.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sitemesajidetay/0/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[SiteInformationService] Fetching site message detail failed:`, error);
      return null;
    }
  }

  /**
   * Searches for content or players by tags.
   * 
   * @param page Requested page number - MANDATORY
   * @param params Search query and pagination
   */
  async searchTags(page: number, params: { tag: string, limit?: number }): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('etiket', params.tag);
      formData.append('sayfa', page.toString());
      formData.append('limit', (params.limit || 50).toString());

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/etiketler/${page}/0/`), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[SiteInformationService] Searching tags for ${params.tag} failed:`, error);
      return null;
    }
  }

  /**
   * General search across different categories.
   * 
   * @param page Requested page number - MANDATORY
   * @param params Search query, category, and pagination
   */
  async search(page: number, params: { 
    query: string, 
    category: SearchCategory | string, 
    subCategory?: string, 
    limit?: number 
  }): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('oyuncuadi', params.query);
      formData.append('kategori', params.category);
      formData.append('kategoridetay', params.subCategory || '1');
      formData.append('sayfa', page.toString());
      formData.append('limit', (params.limit || 50).toString());

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/arama/${page}/0/`), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[SiteInformationService] Search for ${params.query} in ${params.category} failed:`, error);
      return null;
    }
  }
}
