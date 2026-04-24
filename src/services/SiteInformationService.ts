import { SiteInformationResponse, ServiceResponse, MarketCurrencyResponse, WeatherResponse, LeagueStandingResponse, DiscountedGameResponse, NewMemberResponse, MinecraftStatResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { MarketMapper, LeagueMapper, GeneralContentMapper } from '../utils/mappers';

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
   * Get league standings (Süper Lig).
   */
  async getLeagueStandings(): Promise<ServiceResponse<LeagueStandingResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', '1');
      const response = await this.client.post<any>('/0/0/super-lig/0/', formData);
      const data = this.handle<any[]>(response);
      const mapped = LeagueMapper.mapStandingList(data);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationService] Failed to fetch league standings:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get discounted games.
   */
  async getDiscountedGames(): Promise<ServiceResponse<DiscountedGameResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', '1');
      const response = await this.client.post<any>('/0/0/indirimdeki-oyunlar/0/', formData);
      const data = this.handle<any[]>(response);
      const mapped = GeneralContentMapper.mapDiscountedGameList(data);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationService] Failed to fetch discounted games:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get new members of the platform.
   */
  async getNewMembers(): Promise<ServiceResponse<NewMemberResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', '1');
      const response = await this.client.post<any>('/0/0/yeni-uyeler/0/', formData);
      const data = this.handle<any[]>(response);
      const mapped = GeneralContentMapper.mapNewMemberList(data);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationService] Failed to fetch new members:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get Minecraft server statistics.
   */
  async getMinecraftStats(): Promise<ServiceResponse<MinecraftStatResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', '1');
      const response = await this.client.post<any>('/0/0/minecraft-istatistik/0/', formData);
      const data = this.handle<any[]>(response);
      const mapped = GeneralContentMapper.mapMinecraftStatList(data);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationService] Failed to fetch Minecraft stats:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get market currencies and gold prices.
   */
  async getMarketCurrencies(): Promise<ServiceResponse<MarketCurrencyResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', '1');
      const response = await this.client.post<any>('/0/0/piyasa-kur/0/', formData);
      const data = this.handle<any[]>(response);
      const mapped = MarketMapper.mapCurrencyList(data);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationService] Failed to fetch market currencies:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get weather information.
   */
  async getWeather(): Promise<ServiceResponse<WeatherResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', '1');
      const response = await this.client.post<any>('/0/0/hava-durumu/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(Array.isArray(data) ? data : [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationService] Failed to fetch weather:', error);
      return this.createError(error.message);
    }
  }
}
