import { ApiClient, type ApiConfig, type SessionHandlers, ApiVersion } from './ApiClient';
import { ArmoyuLogger, ConsoleLogger } from './Logger';
import { BaseMapper } from '../utils/mappers/BaseMapper';

/**
 * The main entry point for the ARMOYU platform API.
 */
export class ARMOYUCore {
  private client: ApiClient;
  private logger: ArmoyuLogger;

  constructor(version: ApiVersion, apiKeyOrConfig?: string | Partial<ApiConfig>, config?: Partial<ApiConfig>) {
    let finalConfig: Partial<ApiConfig> = {};
    let apiKey: string | null = null;

    if (typeof apiKeyOrConfig === 'string') {
      apiKey = apiKeyOrConfig;
      finalConfig = config || {};
    } else if (apiKeyOrConfig && typeof apiKeyOrConfig === 'object') {
      finalConfig = apiKeyOrConfig;
      apiKey = finalConfig.apiKey || null;
    }

    this.logger = finalConfig.logger || new ConsoleLogger();
    
    // 'old' maps to usePreviousVersion = true, 'current' maps to usePreviousVersion = false
    const useStrict = version === ApiVersion.OLD;
    BaseMapper.setStrictMode(useStrict);

    this.client = new ApiClient({
      baseUrl: finalConfig.baseUrl || 'https://api.aramizdakioyuncu.com',
      token: finalConfig.token || null,
      refreshToken: finalConfig.refreshToken || null,
      apiKey: apiKey,
      headers: finalConfig.headers || {},
      logger: this.logger,
      usePreviousVersion: useStrict,
      version: version
    });
  }

  /**
   * Initializes the API for use with a proxy server (no API key required on client).
   */
  static initForProxy(version: ApiVersion, proxyUrl: string, config?: Partial<Omit<ApiConfig, 'baseUrl' | 'apiKey' | 'version'>>): ARMOYUCore {
    let finalBaseUrl = proxyUrl;
    
    // Auto-detect origin for relative paths in browser environment
    if (typeof window !== 'undefined' && finalBaseUrl.startsWith('/')) {
      finalBaseUrl = `${window.location.origin}${finalBaseUrl}`;
    }

    return new ARMOYUCore(version, {
      ...config,
      baseUrl: finalBaseUrl,
      apiKey: null
    });
  }

  /**
   * Initializes the API for direct bot use (API key included in requests).
   */
  static initForBot(version: ApiVersion, apiKey: string, config?: Partial<Omit<ApiConfig, 'apiKey' | 'version'>>): ARMOYUCore {
    return new ARMOYUCore(version, apiKey, config);
  }

  get version() { return this.client.version; }
  setRefreshToken(token: string | null) { this.client.setRefreshToken(token); }
  setSessionHandlers(handlers: SessionHandlers) { this.client.setSessionHandlers(handlers); }

  // Delegated Services from ApiClient
  get auth() { return this.client.auth; }
  get users() { return this.client.users; }
  get blog() { return this.client.blog; }
  get shop() { return this.client.shop; }
  get forum() { return this.client.forum; }
  get support() { return this.client.support; }
  get rules() { return this.client.rules; }
  get socket() { return this.client.socket; }
  get search() { return this.client.search; }
  get events() { return this.client.events; }
  get siteInfo() { return this.client.siteInfo; }
  get groups() { return this.client.groups; }
  get groupMembers() { return this.client.groupMembers; }
  get social() { return this.client.social; }
  get chat() { return this.client.chat; }
  get schools() { return this.client.schools; }
  get projects() { return this.client.projects; }
  get stories() { return this.client.stories; }
  get polls() { return this.client.polls; }
  get blocks() { return this.client.blocks; }
  get stations() { return this.client.stations; }
  get teams() { return this.client.teams; }
  get staff() { return this.client.staff; }
  get locations() { return this.client.locations; }
  get payments() { return this.client.payments; }
  get management() { return this.client.management; }
  get music() { return this.client.music; }
  get reels() { return this.client.reels; }
  get media() { return this.client.media; }
  get education() { return this.client.education; }
  get workplaces() { return this.client.workplaces; }
  get giveaways() { return this.client.giveaways; }

  setAuthToken(t: string | null) { this.client.setAuthToken(t); }
  setApiKey(k: string | null) { this.client.setApiKey(k); }
  getApiKey() { return this.client.getApiKey(); }
  getBaseUrl() { return this.client.getBaseUrl(); }
  setConfig(c: any) { (this.client as any).config = { ...(this.client as any).config, ...c }; }
  
  get last() { return this.client.lastRaw; }

  async get<T>(e: string, o?: any) { return this.client.get<T>(e, o); }
  async post<T>(e: string, b?: any, o?: any) { return this.client.post<T>(e, b, o); }
  async put<T>(e: string, b?: any, o?: any) { return this.client.put<T>(e, b, o); }
  async patch<T>(e: string, b?: any, o?: any) { return this.client.patch<T>(e, b, o); }
  async delete<T>(e: string, b?: any, o?: any) { return this.client.delete<T>(e, b, o); }
}
