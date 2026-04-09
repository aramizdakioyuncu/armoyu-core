import { ApiClient, ApiConfig } from './ApiClient';
import { ArmoyuLogger, ConsoleLogger } from './Logger';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';
import { SocialService } from '../services/SocialService';
import { BlogService } from '../services/BlogService';
import { ShopService } from '../services/ShopService';
import { ForumService } from '../services/ForumService';
import { SupportService } from '../services/SupportService';
import { RuleService } from '../services/RuleService';
import { SocketService } from '../services/SocketService';

/**
 * The main entry point for the ARMOYU platform API.
 * Organizes all services into logical categories.
 */
export class ArmoyuApi {
  public auth: AuthService;
  public users: UserService;
  public social: SocialService;
  public blog: BlogService;
  public shop: ShopService;
  public forum: ForumService;
  public support: SupportService;
  public rules: RuleService;
  public socket: SocketService;

  private client: ApiClient;
  private logger: ArmoyuLogger;

  constructor(apiKey: string, config?: Partial<Omit<ApiConfig, 'apiKey'>>) {
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('ArmoyuApi: API Key is required.');
    }

    this.logger = config?.logger || new ConsoleLogger();
    const baseUrl = config?.baseUrl || 'https://api.aramizdakioyuncu.com';

    this.client = new ApiClient({
      baseUrl: baseUrl,
      token: config?.token || null,
      apiKey: apiKey,
      headers: config?.headers || {},
      logger: this.logger
    });

    // Initialize services with the api client and logger
    this.socket = new SocketService(this.logger);
    
    this.auth = new AuthService(this.client, this.logger);
    this.users = new UserService(this.client, this.logger);
    this.social = new SocialService(this.client, this.logger, this.socket);
    this.blog = new BlogService(this.client, this.logger);
    this.shop = new ShopService(this.client, this.logger);
    this.forum = new ForumService(this.client, this.logger);
    this.support = new SupportService(this.client, this.logger);
    this.rules = new RuleService(this.client, this.logger);
  }

  /**
   * Set a new authentication token for all services.
   */
  setToken(token: string | null) {
    this.client.setToken(token);
  }

  /**
   * Set a new API key for bot/rule services.
   */
  setApiKey(key: string | null) {
    this.client.setApiKey(key);
  }

  /**
   * Update the global API configuration.
   */
  setConfig(config: Partial<ApiConfig>) {
    if (config.apiKey !== undefined) this.client.setApiKey(config.apiKey);
    if (config.token !== undefined) this.client.setToken(config.token);
    if (config.baseUrl !== undefined) this.client.setBaseUrl(config.baseUrl);
    
    // Also update current config reference if needed (optional since client handles it)
  }

  /**
   * Get the last raw JSON response received from the API.
   */
  get lastResponse(): any {
    return (this.client as any).lastRawResponse;
  }
}


