import { ApiClient, ApiConfig, defaultApiClient } from './ApiClient';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';
import { SocialService } from '../services/SocialService';
import { BlogService } from '../services/BlogService';
import { ShopService } from '../services/ShopService';
import { ForumService } from '../services/ForumService';
import { SupportService } from '../services/SupportService';
import { RuleService } from '../services/RuleService';

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

  private client: ApiClient;

  constructor(config?: Partial<ApiConfig>) {
    // Use provided config or default client
    if (config && config.baseUrl) {
      this.client = new ApiClient({
        baseUrl: config.baseUrl,
        token: config.token || null,
        apiKey: config.apiKey || null,
        headers: config.headers || {},
      });
    } else {
      this.client = defaultApiClient;
      if (config && config.token) this.client.setToken(config.token);
      if (config && config.apiKey) this.client.setApiKey(config.apiKey);
    }

    // Initialize services with the api client
    this.auth = new AuthService(this.client);
    this.users = new UserService(this.client);
    this.social = new SocialService(this.client);
    this.blog = new BlogService(this.client);
    this.shop = new ShopService(this.client);
    this.forum = new ForumService(this.client);
    this.support = new SupportService(this.client);
    this.rules = new RuleService(this.client);
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
   * Get the last raw JSON response received from the API.
   */
  get lastResponse(): any {
    return (this.client as any).lastRawResponse;
  }
}

// Global singleton instance for easy access
export const armoyu = new ArmoyuApi();
