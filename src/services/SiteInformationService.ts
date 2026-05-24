import { SiteInformationResponse, ServiceResponse, MarketCurrencyResponse, WeatherResponse, LeagueStandingResponse, DiscountedGameResponse, NewMemberResponse, MinecraftStatResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { SiteInformationServiceV1 } from '../v1/SiteInformationServiceV1';
import { SiteInformationServiceV2 } from '../v2/SiteInformationServiceV2';

export class SiteInformationService extends BaseService {
  private version: SiteInformationServiceV1 | SiteInformationServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new SiteInformationServiceV1(client, logger)
      : new SiteInformationServiceV2(client, logger);
  }

  async getSiteInfo(): Promise<ServiceResponse<SiteInformationResponse>> {
    return this.version.getSiteInfo();
  }

  async getAboutContent(category: string = 'home'): Promise<ServiceResponse<any>> {
    return this.version.getAboutContent(category);
  }

  async getPrivacyPolicy(category: string = 'home'): Promise<ServiceResponse<any>> {
    return this.version.getPrivacyPolicy(category);
  }

  async getTermsOfService(category: string = 'home'): Promise<ServiceResponse<any>> {
    return this.version.getTermsOfService(category);
  }

  async getStatistics(category: string = 'aktifoyuncu'): Promise<ServiceResponse<any>> {
    return this.version.getStatistics(category);
  }

  async getSessionLogs(): Promise<ServiceResponse<any[]>> {
    return this.version.getSessionLogs();
  }

  async getSiteMessages(userId?: number): Promise<ServiceResponse<any[]>> {
    return this.version.getSiteMessages(userId);
  }

  async getSiteMessageDetail(userId?: number): Promise<ServiceResponse<any>> {
    return this.version.getSiteMessageDetail(userId);
  }

  async getLeagueStandings(): Promise<ServiceResponse<LeagueStandingResponse[]>> {
    return this.version.getLeagueStandings();
  }

  async getDiscountedGames(): Promise<ServiceResponse<DiscountedGameResponse[]>> {
    return this.version.getDiscountedGames();
  }

  async getNewMembers(): Promise<ServiceResponse<NewMemberResponse[]>> {
    return this.version.getNewMembers();
  }

  async getMinecraftStats(): Promise<ServiceResponse<MinecraftStatResponse[]>> {
    return this.version.getMinecraftStats();
  }

  async getMarketCurrencies(): Promise<ServiceResponse<MarketCurrencyResponse[]>> {
    return this.version.getMarketCurrencies();
  }

  async getWeather(): Promise<ServiceResponse<WeatherResponse[]>> {
    return this.version.getWeather();
  }
}
