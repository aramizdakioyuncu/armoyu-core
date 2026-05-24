import { BaseService } from '../services/BaseService';
import { SiteInformationResponse, ServiceResponse, MarketCurrencyResponse, WeatherResponse, LeagueStandingResponse, DiscountedGameResponse, NewMemberResponse, MinecraftStatResponse } from '../models';
import { MarketMapper, LeagueMapper, GeneralContentMapper } from '../utils/mappers';

export class SiteInformationServiceV1 extends BaseService {
  async getSiteInfo(): Promise<ServiceResponse<SiteInformationResponse>> {
    try {
      const response = await this.client.post<any>('/0/0/ana/0/0/', new FormData());
      const data = this.handle<any>(response);
      return this.createSuccess(data, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationServiceV1] Failed to fetch site info:', error.message);
      return this.createError(error.message);
    }
  }

  async getAboutContent(category: string = 'home'): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('kategori', category);
      const response = await this.client.post<any>('/0/0/hakkimizda/0/0/', formData);
      const data = this.handle<any>(response);
      return this.createSuccess(data, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationServiceV1] Failed to fetch about content:', error.message);
      return this.createError(error.message);
    }
  }

  async getPrivacyPolicy(category: string = 'home'): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('kategori', category);
      const response = await this.client.post<any>('/0/0/gizlilik-politikasi/0/0/', formData);
      const data = this.handle<any>(response);
      return this.createSuccess(data, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationServiceV1] Failed to fetch privacy policy:', error.message);
      return this.createError(error.message);
    }
  }

  async getTermsOfService(category: string = 'home'): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('kategori', category);
      const response = await this.client.post<any>('/0/0/kullanim-sozlesmesi/0/0/', formData);
      const data = this.handle<any>(response);
      return this.createSuccess(data, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationServiceV1] Failed to fetch terms of service:', error.message);
      return this.createError(error.message);
    }
  }

  async getStatistics(category: string = 'aktifoyuncu'): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('kategori', category);
      const response = await this.client.post<any>('/0/0/istatistikler/0/0/', formData);
      const data = this.handle<any>(response);
      return this.createSuccess(data, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationServiceV1] Failed to fetch statistics:', error.message);
      return this.createError(error.message);
    }
  }

  async getSessionLogs(): Promise<ServiceResponse<any[]>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>('/0/0/ayarlar/oturum-kayitlari/0/', new FormData());
      const data = this.handle<any[]>(response);
      return this.createSuccess(Array.isArray(data) ? data : [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationServiceV1] Failed to fetch session logs:', error.message);
      return this.createError(error.message);
    }
  }

  async getSiteMessages(userId?: number): Promise<ServiceResponse<any[]>> {
    try {
      const formData = new FormData();
      if (userId) formData.append('oyuncubakid', userId.toString());
      const response = await this.client.post<any>('/0/0/mesajlarim/0/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(Array.isArray(data) ? data : [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationServiceV1] Failed to fetch site messages:', error.message);
      return this.createError(error.message);
    }
  }

  async getSiteMessageDetail(userId?: number): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      if (userId) formData.append('oyuncubakid', userId.toString());
      const response = await this.client.post<any>('/0/0/mesajbak/0/0/', formData);
      const data = this.handle<any>(response);
      return this.createSuccess(data, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationServiceV1] Failed to fetch site message detail:', error.message);
      return this.createError(error.message);
    }
  }

  async getLeagueStandings(): Promise<ServiceResponse<LeagueStandingResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', '1');
      const response = await this.client.post<any>('/0/0/super-lig/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(LeagueMapper.mapStandingList(data), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationServiceV1] Failed to fetch league standings:', error.message);
      return this.createError(error.message);
    }
  }

  async getDiscountedGames(): Promise<ServiceResponse<DiscountedGameResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', '1');
      const response = await this.client.post<any>('/0/0/indirimdeki-oyunlar/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(GeneralContentMapper.mapDiscountedGameList(data), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationServiceV1] Failed to fetch discounted games:', error.message);
      return this.createError(error.message);
    }
  }

  async getNewMembers(): Promise<ServiceResponse<NewMemberResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', '1');
      const response = await this.client.post<any>('/0/0/yeni-uyeler/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(GeneralContentMapper.mapNewMemberList(data), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationServiceV1] Failed to fetch new members:', error.message);
      return this.createError(error.message);
    }
  }

  async getMinecraftStats(): Promise<ServiceResponse<MinecraftStatResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', '1');
      const response = await this.client.post<any>('/0/0/minecraft-istatistik/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(GeneralContentMapper.mapMinecraftStatList(data), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationServiceV1] Failed to fetch Minecraft stats:', error.message);
      return this.createError(error.message);
    }
  }

  async getMarketCurrencies(): Promise<ServiceResponse<MarketCurrencyResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', '1');
      const response = await this.client.post<any>('/0/0/piyasa-kur/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(MarketMapper.mapCurrencyList(data), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationServiceV1] Failed to fetch market currencies:', error.message);
      return this.createError(error.message);
    }
  }

  async getWeather(): Promise<ServiceResponse<WeatherResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', '1');
      const response = await this.client.post<any>('/0/0/hava-durumu/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(Array.isArray(data) ? data : [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SiteInformationServiceV1] Failed to fetch weather:', error.message);
      return this.createError(error.message);
    }
  }
}
