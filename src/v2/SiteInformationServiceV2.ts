import { BaseService } from '../services/BaseService';
import { SiteInformationResponse, ServiceResponse, MarketCurrencyResponse, WeatherResponse, LeagueStandingResponse, DiscountedGameResponse, NewMemberResponse, MinecraftStatResponse } from '../models';

export class SiteInformationServiceV2 extends BaseService {
  async getSiteInfo(): Promise<ServiceResponse<SiteInformationResponse>> {
    return this.createError('getSiteInfo is not supported in V2 yet');
  }

  async getAboutContent(_category?: string): Promise<ServiceResponse<any>> {
    return this.createError('getAboutContent is not supported in V2 yet');
  }

  async getPrivacyPolicy(_category?: string): Promise<ServiceResponse<any>> {
    return this.createError('getPrivacyPolicy is not supported in V2 yet');
  }

  async getTermsOfService(_category?: string): Promise<ServiceResponse<any>> {
    return this.createError('getTermsOfService is not supported in V2 yet');
  }

  async getStatistics(_category?: string): Promise<ServiceResponse<any>> {
    return this.createError('getStatistics is not supported in V2 yet');
  }

  async getSessionLogs(): Promise<ServiceResponse<any[]>> {
    return this.createError('getSessionLogs is not supported in V2 yet');
  }

  async getSiteMessages(_userId?: number): Promise<ServiceResponse<any[]>> {
    return this.createError('getSiteMessages is not supported in V2 yet');
  }

  async getSiteMessageDetail(_userId?: number): Promise<ServiceResponse<any>> {
    return this.createError('getSiteMessageDetail is not supported in V2 yet');
  }

  async getLeagueStandings(): Promise<ServiceResponse<LeagueStandingResponse[]>> {
    return this.createError('getLeagueStandings is not supported in V2 yet');
  }

  async getDiscountedGames(): Promise<ServiceResponse<DiscountedGameResponse[]>> {
    return this.createError('getDiscountedGames is not supported in V2 yet');
  }

  async getNewMembers(): Promise<ServiceResponse<NewMemberResponse[]>> {
    return this.createError('getNewMembers is not supported in V2 yet');
  }

  async getMinecraftStats(): Promise<ServiceResponse<MinecraftStatResponse[]>> {
    return this.createError('getMinecraftStats is not supported in V2 yet');
  }

  async getMarketCurrencies(): Promise<ServiceResponse<MarketCurrencyResponse[]>> {
    return this.createError('getMarketCurrencies is not supported in V2 yet');
  }

  async getWeather(): Promise<ServiceResponse<WeatherResponse[]>> {
    return this.createError('getWeather is not supported in V2 yet');
  }
}
